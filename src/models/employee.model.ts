import {
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";
import {UserInstance} from "./user.model";

export enum EmployeeType {
    ADMIN,
    VETERINARY,
    SELLER,
    RECEPTION,
    SERVICE_AGENT
}

export interface EmployeeProps {
    id: number;
    firstname: string;
    lastname: string;
    type: EmployeeType;
}

export interface EmployeeCreationProps extends Optional<EmployeeProps, "id"> {
}

export interface EmployeeInstance extends Model<EmployeeProps, EmployeeCreationProps>, EmployeeProps {
    setUser: BelongsToSetAssociationMixin<UserInstance, "id">;
    getUser: BelongsToGetAssociationMixin<UserInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<EmployeeInstance> {
    return sequelize.define<EmployeeInstance>("Employee", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM,
            values: ["ADMIN", "VETERINARY", "SELLER", "RECEPTION", "SERVICE_AGENT"],
            allowNull: false
        }
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: false,
        paranoid: true
    });
}