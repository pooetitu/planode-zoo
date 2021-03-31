import {
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";
import {EmployeeInstance} from "./employee.model";

export interface PresenceProps {
    id: number;
    presenceDate: Date;
}

export interface PresenceCreationProps extends Optional<PresenceProps, "id"> {
}

export interface PresenceInstance extends Model<PresenceProps, PresenceCreationProps>, PresenceProps {
    setEmployee: BelongsToSetAssociationMixin<EmployeeInstance, "id">;
    getEmployee: BelongsToGetAssociationMixin<EmployeeInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<PresenceInstance> {
    return sequelize.define<PresenceInstance>("Presence", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        presenceDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true,
        timestamps: false
    });
}