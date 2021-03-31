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
import {UserInstance} from "./user.model";
import {AreaInstance} from "./area.model";
import {PassUsageInstance} from "./pass_usage.model";

export interface PassProps {
    id: number;
    isEscapeGame: boolean;
    startDate: Date;
    endDate: Date;
}

export interface PassCreationProps extends Optional<PassProps, "id"> {
}

export interface PassInstance extends Model<PassProps, PassCreationProps>, PassProps {
    setUser: BelongsToSetAssociationMixin<UserInstance, "id">;
    getUser: BelongsToGetAssociationMixin<UserInstance>;
    getAreas: HasManyGetAssociationsMixin<AreaInstance>;
    addArea: HasManyAddAssociationMixin<AreaInstance, "id">;
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
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: false
    });
}