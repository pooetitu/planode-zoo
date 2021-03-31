import {
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";
import {EmployeeInstance} from "./employee.model";
import {AnimalInstance} from "./animal.model";

export interface TreatmentProps {
    id: number;
    description: string;
}

export interface TreatmentCreationProps extends Optional<TreatmentProps, "id"> {
}

export interface TreatmentInstance extends Model<TreatmentProps, TreatmentCreationProps>, TreatmentProps {
    setEmployee: BelongsToSetAssociationMixin<EmployeeInstance, "id">;
    getEmployee: BelongsToGetAssociationMixin<EmployeeInstance>;
    setAnimal: BelongsToSetAssociationMixin<AnimalInstance, "id">;
    getAnimal: BelongsToGetAssociationMixin<AnimalInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<TreatmentInstance> {
    return sequelize.define<TreatmentInstance>("Treatment", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        underscored: true,
        freezeTableName: true,
        timestamps: false
    });
}