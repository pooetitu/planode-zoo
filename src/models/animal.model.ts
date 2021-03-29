import {
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";
import {SessionInstance} from "./session.model";
import {TreatmentInstance} from "./treatment.model";
import {EmployeeInstance} from "./employee.model";
import {AreaInstance} from "./area.model";

export interface AnimalProps {
    id: number;
    name: string;
}

export interface AnimalCreationProps extends Optional<AnimalProps, "id"> {
}

export interface AnimalInstance extends Model<AnimalProps, AnimalCreationProps>, AnimalProps {
    getTreatments: HasManyGetAssociationsMixin<TreatmentInstance>;
    addTreatment: HasManyAddAssociationMixin<TreatmentInstance, "id">;
    setArea: BelongsToSetAssociationMixin<AreaInstance, "id">;
    getArea: BelongsToGetAssociationMixin<AreaInstance>;
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