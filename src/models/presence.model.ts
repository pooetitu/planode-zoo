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

export interface PresenceProps {
    id: number;
    presenceDate: Date;
}

export interface PresenceCreationProps extends Optional<PresenceProps, "id"> {
}

export interface PresenceInstance extends Model<PresenceProps, PresenceCreationProps>, PresenceProps {
    setUser: BelongsToSetAssociationMixin<UserInstance, "id">;
    getUser: BelongsToGetAssociationMixin<UserInstance>;
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
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        paranoid: true
    });
}