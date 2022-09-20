import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import BaseModel from 'Common/Models/BaseModel';
import User from './User';
import Project from './Project';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import SlugifyColumn from 'Common/Types/Database/SlugifyColumn';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/Database/TableColumnType';
import TableColumn from 'Common/Types/Database/TableColumn';
import ColumnType from 'Common/Types/Database/ColumnType';
import ObjectID from 'Common/Types/ObjectID';
import ColumnLength from 'Common/Types/Database/ColumnLength';
import Color from 'Common/Types/Color';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import UniqueColumnBy from 'Common/Types/Database/UniqueColumnBy';
import TenantColumn from 'Common/Types/Database/TenantColumn';
import SingularPluralName from 'Common/Types/Database/SingularPluralName';

@TenantColumn('projectId')
@TableAccessControl({
    create: [Permission.ProjectOwner, Permission.CanCreateProjectIncidentState],
    read: [
        Permission.ProjectOwner,
        Permission.CanReadProjectIncidentState,
        Permission.ProjectMember,
    ],
    delete: [Permission.ProjectOwner, Permission.CanDeleteProjectIncidentState],
    update: [Permission.ProjectOwner, Permission.CanEditProjectIncidentState],
})
@CrudApiEndpoint(new Route('/incident-state'))
@SlugifyColumn('name', 'slug')
@SingularPluralName('Incident State', 'Incident States')
@Entity({
    name: 'IncidentState',
})
export default class IncidentState extends BaseModel {
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.CanCreateProjectIncidentState,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'projectId',
        type: TableColumnType.Entity,
        modelType: Project,
    })
    @ManyToOne(
        (_type: string) => {
            return Project;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'projectId' })
    public project?: Project = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.CanCreateProjectIncidentState,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [],
    })
    @Index()
    @TableColumn({ type: TableColumnType.ObjectID, required: true })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.CanCreateProjectIncidentState,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.CanEditProjectIncidentState,
        ],
    })
    @TableColumn({ required: true, type: TableColumnType.ShortText, canReadOnPopulate: true })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
    })
    @UniqueColumnBy('projectId')
    public name?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [],
    })
    @TableColumn({ required: true, unique: true, type: TableColumnType.Slug })
    @Column({
        nullable: false,
        type: ColumnType.Slug,
        length: ColumnLength.Slug,
    })
    public slug?: string = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.CanCreateProjectIncidentState,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.CanEditProjectIncidentState,
        ],
    })
    @TableColumn({ required: false, type: TableColumnType.LongText })
    @Column({
        nullable: true,
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
    })
    public description?: string = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.CanCreateProjectIncidentState,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'createdByUserId',
        type: TableColumnType.Entity,
        modelType: User,
    })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'createdByUserId' })
    public createdByUser?: User = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.CanCreateProjectIncidentState,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [],
    })
    @TableColumn({ type: TableColumnType.ObjectID })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public createdByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'deletedByUserId',
        type: TableColumnType.ObjectID,
    })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            cascade: false,
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'deletedByUserId' })
    public deletedByUser?: User = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [],
    })
    @TableColumn({ type: TableColumnType.ObjectID })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public deletedByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.CanCreateProjectIncidentState,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.CanEditProjectIncidentState,
        ],
    })
    @TableColumn({
        title: 'Color',
        required: true,
        unique: false,
        type: TableColumnType.Color,
    })
    @Column({
        type: ColumnType.Color,
        length: ColumnLength.Color,
        unique: false,
        nullable: false,
        transformer: Color.getDatabaseTransformer(),
    })
    public color?: Color = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.CanCreateProjectIncidentState,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.CanEditProjectIncidentState,
        ],
    })
    @TableColumn({ isDefaultValueColumn: false, type: TableColumnType.Boolean })
    @Column({
        type: ColumnType.Boolean,
        default: false,
    })
    public isCreatedState?: boolean = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.CanCreateProjectIncidentState,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.CanEditProjectIncidentState,
        ],
    })
    @TableColumn({ isDefaultValueColumn: false, type: TableColumnType.Boolean })
    @Column({
        type: ColumnType.Boolean,
        default: false,
    })
    public isAcknowledgedState?: boolean = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.CanCreateProjectIncidentState,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.CanEditProjectIncidentState,
        ],
    })
    @TableColumn({ isDefaultValueColumn: false, type: TableColumnType.Boolean })
    @Column({
        type: ColumnType.Boolean,
        default: false,
    })
    public isResolvedState?: boolean = undefined;

    @UniqueColumnBy('projectId')
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.CanCreateProjectIncidentState,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.CanReadProjectIncidentState,
            Permission.ProjectMember,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.CanEditProjectIncidentState,
        ],
    })
    @TableColumn({
        isDefaultValueColumn: false,
        type: TableColumnType.SmallNumber,
    })
    @Column({
        type: ColumnType.SmallNumber,
    })
    public order?: number = undefined;
}
