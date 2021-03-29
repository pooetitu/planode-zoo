import {
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyGetAssociationsMixin, HasOneCreateAssociationMixin, HasOneGetAssociationMixin,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";
import {SessionInstance} from "./session.model";
import {EmployeeInstance} from "./employee.model";

export interface UserProps {
    id: number;
    login: string;
    password: string;
    email: string;
}

export interface UserCreationProps extends Optional<UserProps, "id"> {
}

export interface UserInstance extends Model<UserProps, UserCreationProps>, UserProps {
    getSessions: HasManyGetAssociationsMixin<SessionInstance>;
    addSession: HasManyAddAssociationMixin<SessionInstance, "id">;
    setEmployee: BelongsToSetAssociationMixin<EmployeeInstance, "id">;
    getEmployee: BelongsToGetAssociationMixin<EmployeeInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<UserInstance> {
    return sequelize.define<UserInstance>("User", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}