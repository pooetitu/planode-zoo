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
import {AreaAccessInstance} from "./area_access.model";

export interface PassUsageProps {
    id: number;
    useDate: Date;
}

export interface PassUsageCreationProps extends Optional<PassUsageProps, "id"> {
}

export interface PassUsageInstance extends Model<PassUsageProps, PassUsageCreationProps>, PassUsageProps {
    setPass: BelongsToSetAssociationMixin<PassInstance, "id">;
    getPass: BelongsToGetAssociationMixin<PassInstance>;
    getAreasAccesses: HasManyGetAssociationsMixin<AreaAccessInstance>;
    addAreaAccess: HasManyAddAssociationMixin<AreaAccessInstance, "id">;
}

export default function (sequelize: Sequelize): ModelCtor<PassUsageInstance> {
    return sequelize.define<PassUsageInstance>("PassUsage", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        useDate: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: false
    });
}