import {
    BelongsToGetAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyGetAssociationsMixin,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";
import {UserInstance} from "./user.model";
import {AreaInstance} from "./area.model";
import {PassUsageInstance} from "./pass_usage.model";

export const passMap = {"DAILY": 1, "WEEK_END": 2, "YEARLY": 365, "ONCE_MONTHLY": 365};

export enum PassType {
    DAILY = "DAILY",
    WEEK_END = "WEEK_END",
    YEARLY = "YEARLY",
    ONCE_MONTHLY = "ONCE_MONTHLY"
}

export interface PassProps {
    id: number;
    isEscapeGame: boolean;
    startDate: Date;
    endDate?: Date;
    type: PassType;
}

export interface PassCreationProps extends Optional<PassProps, "id"> {
}

export interface PassInstance extends Model<PassProps, PassCreationProps>, PassProps {
    setUser: BelongsToSetAssociationMixin<UserInstance, "id">;
    getUser: BelongsToGetAssociationMixin<UserInstance>;
    getAreas: BelongsToManyGetAssociationsMixin<AreaInstance>;
    addArea: BelongsToManyAddAssociationsMixin<AreaInstance, "id">;
    getPassUsages: HasManyGetAssociationsMixin<PassUsageInstance>;
    addPassUsage: HasManyAddAssociationMixin<PassUsageInstance, "id">;
}

export default function (sequelize: Sequelize): ModelCtor<PassInstance> {
    return sequelize.define<PassInstance>("Pass", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        isEscapeGame: {
            type: DataTypes.BOOLEAN,
        },
        startDate: {
            type: DataTypes.DATE
        },
        endDate: {
            type: DataTypes.DATE
        },
        type: {
            type: DataTypes.ENUM,
            values: ["DAILY", "WEEK_END", "YEARLY", "ONCE_MONTHLY"],
            allowNull: false
        }
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: false
    });
}