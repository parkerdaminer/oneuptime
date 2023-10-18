/** 
 * CREATE TABLE opentelemetry_logs
(
    trace_id String,
    span_id String,
    name String,
    time DateTime('UTC'),
    body String,
    attributes Nested
    (
        key String,
        value String
    ),
    flags Int32,
    severity_number Int32,
    severity_text String
) ENGINE = MergeTree()
ORDER BY (trace_id, span_id);

 */

import AnalyticsBaseModel from 'Common/AnalyticsModels/BaseModel';
import AnalyticsTableColumn from 'Common/Types/AnalyticsDatabase/TableColumn';
import TableColumnType from 'Common/Types/AnalyticsDatabase/TableColumnType';
import AnalyticsTableEngine from 'Common/Types/AnalyticsDatabase/AnalyticsTableEngine';
import ObjectID from 'Common/Types/ObjectID';
import KeyValueNestedModel from './NestedModels/KeyValueNestedModel';

export default class Log extends AnalyticsBaseModel {
    public constructor() {
        super({
            tableName: 'Log',
            tableEngine: AnalyticsTableEngine.MergeTree,
            singularName: 'Log',
            pluralName: 'Logs',
            tableColumns: [
                new AnalyticsTableColumn({
                    key: 'projectId',
                    title: 'Project ID',
                    description: 'ID of project',
                    required: true,
                    type: TableColumnType.ObjectID,
                }),

                new AnalyticsTableColumn({
                    key: 'serviceId',
                    title: 'Service ID',
                    description: 'ID of the Service which created the log',
                    required: true,
                    type: TableColumnType.ObjectID,
                }),

                new AnalyticsTableColumn({
                    key: 'name',
                    title: 'Name',
                    description: 'Name',
                    required: true,
                    type: TableColumnType.Text,
                }),

                new AnalyticsTableColumn({
                    key: 'body',
                    title: 'Log Body',
                    description: 'Log Body',
                    required: true,
                    type: TableColumnType.Text,
                }),

                new AnalyticsTableColumn({
                    key: 'time',
                    title: 'Time',
                    description: 'When was the log created?',
                    required: true,
                    type: TableColumnType.Date,
                }),

                new AnalyticsTableColumn({
                    key: 'severityText',
                    title: 'Severity Text',
                    description: 'Log Severity Text',
                    required: true,
                    type: TableColumnType.Text,
                }),

                new AnalyticsTableColumn({
                    key: 'severityNumber',
                    title: 'Severity Number',
                    description: 'Log Severity Number',
                    required: true,
                    type: TableColumnType.Number,
                }),

                new AnalyticsTableColumn({
                    key: 'flags',
                    title: 'Flags',
                    description: 'Log Flags',
                    required: true,
                    type: TableColumnType.Number,
                }),

                new AnalyticsTableColumn({
                    key: 'attributes',
                    title: 'Attributes',
                    description: 'Attributes',
                    required: false,
                    type: TableColumnType.NestedModel,
                    nestedModel: new KeyValueNestedModel(),
                }),

                new AnalyticsTableColumn({
                    key: 'traceId',
                    title: 'Trace ID',
                    description: 'ID of the trace',
                    required: false,
                    type: TableColumnType.Text,
                }),

                new AnalyticsTableColumn({
                    key: 'spanId',
                    title: 'Span ID',
                    description: 'ID of the span',
                    required: false,
                    type: TableColumnType.Text,
                }),
            ],
            primaryKeys: ['projectId', 'serviceId', 'time'],
        });
    }

    public get projectId(): ObjectID | undefined {
        return this.getColumnValue('projectId') as ObjectID | undefined;
    }

    public set projectId(v: ObjectID | undefined) {
        this.setColumnValue('projectId', v);
    }

    public get serviceId(): ObjectID | undefined {
        return this.getColumnValue('serviceId') as ObjectID | undefined;
    }

    public set serviceId(v: ObjectID | undefined) {
        this.setColumnValue('serviceId', v);
    }

    public get name(): string | undefined {
        return this.getColumnValue('name') as string | undefined;
    }

    public set name(v: string | undefined) {
        this.setColumnValue('name', v);
    }

    public get body(): string | undefined {
        return this.getColumnValue('body') as string | undefined;
    }

    public set body(v: string | undefined) {
        this.setColumnValue('body', v);
    }

    public get time(): Date | undefined {
        return this.getColumnValue('time') as Date | undefined;
    }

    public set time(v: Date | undefined) {
        this.setColumnValue('time', v);
    }

    public get severityText(): string | undefined {
        return this.getColumnValue('severityText') as string | undefined;
    }

    public set severityText(v: string | undefined) {
        this.setColumnValue('severityText', v);
    }

    public get severityNumber(): number | undefined {
        return this.getColumnValue('severityNumber') as number | undefined;
    }

    public set severityNumber(v: number | undefined) {
        this.setColumnValue('severityNumber', v);
    }

    public get flags(): number | undefined {
        return this.getColumnValue('flags') as number | undefined;
    }

    public set flags(v: number | undefined) {
        this.setColumnValue('flags', v);
    }

    public get attributes(): Array<KeyValueNestedModel> | undefined {
        return this.getColumnValue('attributes') as
            | Array<KeyValueNestedModel>
            | undefined;
    }

    public set attributes(v: Array<KeyValueNestedModel> | undefined) {
        this.setColumnValue('attributes', v);
    }

    public get traceId(): string | undefined {
        return this.getColumnValue('traceId') as string | undefined;
    }

    public set traceId(v: string | undefined) {
        this.setColumnValue('traceId', v);
    }

    public get spanId(): string | undefined {
        return this.getColumnValue('spanId') as string | undefined;
    }

    public set spanId(v: string | undefined) {
        this.setColumnValue('spanId', v);
    }
}
