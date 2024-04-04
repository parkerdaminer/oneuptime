import PostgresDatabase from '../Infrastructure/PostgresDatabase';
import Model, { ProductType } from 'Model/Models/TelemetryUsageBilling';
import DatabaseService from './DatabaseService';
import ObjectID from 'Common/Types/ObjectID';
import { LIMIT_PER_PROJECT } from 'Common/Types/Database/LimitMax';
import OneUptimeDate from 'Common/Types/Date';
import QueryHelper from '../Types/Database/QueryHelper';
import SortOrder from 'Common/Types/BaseDatabase/SortOrder';
import { MeteredPlanUtil } from '../Types/Billing/MeteredPlan/AllMeteredPlans';
import MeteredPlan from 'Common/Types/Billing/MeteredPlan';
import ServerMeteredPlan from '../Types/Billing/MeteredPlan/ServerMeteredPlan';
import Decimal from 'Common/Types/Decimal';
import TelemetryMeteredPlan from '../Types/Billing/MeteredPlan/TelemetryMeteredPlan';

export class Service extends DatabaseService<Model> {
    public constructor(postgresDatabase?: PostgresDatabase) {
        super(Model, postgresDatabase);
        this.hardDeleteItemsOlderThanInDays('createdAt', 120);
    }

    public async getUnreportedUsageBilling(data: {
        projectId: ObjectID;
        productType: ProductType;
    }): Promise<Model[]> {
        return await this.findBy({
            query: {
                projectId: data.projectId,
                productType: data.productType,
                isReportedToBillingProvider: false,
                createdAt: QueryHelper.lessThan(
                    OneUptimeDate.addRemoveDays(
                        OneUptimeDate.getCurrentDate(),
                        -1
                    )
                ), // we need to get everything that's not today.
            },
            skip: 0,
            limit: LIMIT_PER_PROJECT,
            select: {
                _id: true,
                totalCostInUSD: true,
            },
            props: {
                isRoot: true,
            },
        });
    }

    public async updateUsageBilling(data: {
        projectId: ObjectID;
        productType: ProductType;
        telemetryServiceId: ObjectID;
        dataIngestedInGB: number;
        retentionInDays: number;
    }): Promise<void> {
        const serverMeteredPlan: TelemetryMeteredPlan =
            MeteredPlanUtil.getTelemetryMeteredPlanByProductType(data.productType);

        const totalCostOfThisOperationInUSD: number =
            serverMeteredPlan.getTotalCostInUSD(
                {
                    dataIngestedInGB: data.dataIngestedInGB,
                    retentionInDays: data.retentionInDays,
                }
            );

        const usageBilling: Model | null = await this.findOneBy({
            query: {
                projectId: data.projectId,
                productType: data.productType,
                telemetryServiceId: data.telemetryServiceId,
                isReportedToBillingProvider: false,
                createdAt: QueryHelper.inBetween(
                    OneUptimeDate.addRemoveDays(
                        OneUptimeDate.getCurrentDate(),
                        -1
                    ),
                    OneUptimeDate.getCurrentDate()
                ),
            },
            select: {
                _id: true,
                dataIngestedInGB: true,
                totalCostInUSD: true,
            },
            props: {
                isRoot: true,
            },
            sort: {
                createdAt: SortOrder.Descending,
            },
        });

        if (usageBilling && usageBilling.id) {
            await this.updateOneById({
                id: usageBilling.id,
                data: {
                    usageCount: new Decimal(
                        (usageBilling.usageCount?.value || 0) + data.usageCount
                    ),
                    totalCostInUSD: new Decimal(
                        (usageBilling.totalCostInUSD?.value || 0) +
                        totalCostOfThisOperationInUSD
                    ),
                },
                props: {
                    isRoot: true,
                },
            });
        } else {
            const usageBilling: Model = new Model();
            usageBilling.projectId = data.projectId;
            usageBilling.productType = data.productType;
            usageBilling.usageCount = new Decimal(data.usageCount);
            usageBilling.isReportedToBillingProvider = false;
            usageBilling.createdAt = OneUptimeDate.getCurrentDate();
            usageBilling.day = OneUptimeDate.getDateString(
                OneUptimeDate.getCurrentDate()
            );
            usageBilling.totalCostInUSD = new Decimal(
                totalCostOfThisOperationInUSD
            );
           

            await this.create({
                data: usageBilling,
                props: {
                    isRoot: true,
                },
            });
        }
    }
}

export default new Service();
