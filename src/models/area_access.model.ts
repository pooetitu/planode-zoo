import {
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";
import {PassUsageInstance} from "./pass_usage.model";
import {AreaInstance} from "./area.model";

export interface AreaAccessProps {
    id: number;
    useDate: Date;
}

export interface AreaAccessCreationProps extends Optional<AreaAccessProps, "id"> {
}

export interface AreaAccessInstance extends Model<AreaAccessProps, AreaAccessCreationProps>, AreaAccessProps {
    setPassUsage: BelongsToSetAssociationMixin<PassUsageInstance, "id">;
    getPassUsage: BelongsToGetAssociationMixin<PassUsageInstance>;
    setArea: BelongsToSetAssociationMixin<AreaInstance, "id">;
    getArea: BelongsToGetAssociationMixin<AreaInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<AreaAccessInstance> {
    return sequelize.define<AreaAccessInstance>("AreaAccess", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        useDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: false
    });
}