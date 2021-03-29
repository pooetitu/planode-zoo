import {
    DataTypes,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";

export interface PassProps {
    id: number;
    isEscapeGame: boolean;
    startDate: string;
    lastDate: string;
}
export interface PassCreationProps extends Optional<PassProps, "id"> {
}

export interface PassInstance extends Model<PassProps, PassCreationProps>, PassProps {

}

export default function (sequelize: Sequelize): ModelCtor<PassInstance> {
    return sequelize.define<PassInstance>("Pass", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}