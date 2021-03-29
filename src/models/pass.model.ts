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