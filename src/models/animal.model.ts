import {
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";

export interface AnimalProps {
    id: number;
    name: string;
}

export interface AnimalCreationProps extends Optional<AnimalProps, "id"> {
}

export interface AnimalInstance extends Model<AnimalProps, AnimalCreationProps>, AnimalProps {

}

export default function (sequelize: Sequelize): ModelCtor<AnimalInstance> {
    return sequelize.define<AnimalInstance>("Animal", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        paranoid: true
    });
}