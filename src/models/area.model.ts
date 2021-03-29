import {
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyGetAssociationsMixin,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";
import {PassInstance} from "./pass.model";
import {AnimalInstance} from "./animal.model";
import {MaintenanceInstance} from "./maintenance.model";

export interface AreaProps {
    id: number;
    name: string;
    type: string;
    description: string;
    capacity: number;
    duration: number;
    openingTime: Date;
    disabledAccess: boolean;
    maintenance: boolean;
}
export interface AreaCreationProps extends Optional<AreaProps, "id"> {
}

export interface AreaInstance extends Model<AreaProps, AreaCreationProps>, AreaProps {
    setPass: BelongsToSetAssociationMixin<PassInstance, "id">;
    getPass: BelongsToGetAssociationMixin<PassInstance>;
    getAnimals: HasManyGetAssociationsMixin<AnimalInstance>;
    addAnimal: HasManyAddAssociationMixin<AnimalInstance, "id">;
    getMaintenances: HasManyGetAssociationsMixin<MaintenanceInstance>;
    addMaintenance: HasManyAddAssociationMixin<MaintenanceInstance, "id">;
}

export default function (sequelize: Sequelize): ModelCtor<AreaInstance> {
    return sequelize.define<AreaInstance>("Area", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        type: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        capacity: {
            type: DataTypes.BIGINT
        },
        duration: {
            type: DataTypes.INTEGER
        },
        openingTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        disabledAccess: {
            type: DataTypes.BOOLEAN
        },
        maintenance: {
            type: DataTypes.BOOLEAN
        },
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}