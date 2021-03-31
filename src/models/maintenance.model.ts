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
import {AreaInstance} from "./area.model";

export interface MaintenanceProps {
    id: number;
    maintenanceDate: Date;
}

export interface MaintenanceCreationProps extends Optional<MaintenanceProps, "id"> {
}

export interface MaintenanceInstance extends Model<MaintenanceProps, MaintenanceCreationProps>, MaintenanceProps {
    setEmployee: BelongsToSetAssociationMixin<EmployeeInstance, "id">;
    getEmployee: BelongsToGetAssociationMixin<EmployeeInstance>;
    setArea: BelongsToSetAssociationMixin<AreaInstance, "id">;
    getArea: BelongsToGetAssociationMixin<AreaInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<MaintenanceInstance> {
    return sequelize.define<MaintenanceInstance>("Maintenance", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        maintenanceDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true,
        timestamps: false
    });
}