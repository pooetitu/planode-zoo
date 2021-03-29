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
import {SessionInstance, SessionProps} from "./session.model";
import {UserInstance} from "./user.model";

export interface EspaceProps {
    id: number;
    name: string;
    type: string;
    description: string;
    capacity: number;
    duration: number;
    openingstime: Date;
    disabledaccess: boolean;
    maintenance: boolean;


}
export interface EspaceCreationProps extends Optional<EspaceProps, "id"> {
}

export interface EspaceInstance extends Model<EspaceProps, EspaceCreationProps>, EspaceProps {

}

export default function (sequelize: Sequelize): ModelCtor<EspaceInstance> {
    return sequelize.define<EspaceInstance>("Espace", {
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
        openingstime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        disabledaccess: {
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