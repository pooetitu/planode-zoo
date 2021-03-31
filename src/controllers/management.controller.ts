import {ModelCtor} from "sequelize";
import {UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models/index.model";
import {EmployeeInstance} from "../models/employee.model";
import {TreatmentCreationProps, TreatmentInstance} from "../models/treatment.model";
import {AnimalInstance} from "../models/animal.model";
import {AreaInstance} from "../models/area.model";
import {MaintenanceCreationProps, MaintenanceInstance} from "../models/maintenance.model";

export class ManagementController {

    private static instance: ManagementController;

    Treatment: ModelCtor<TreatmentInstance>;
    Maintenance: ModelCtor<MaintenanceInstance>;

    private constructor(Treatment: ModelCtor<TreatmentInstance>, Maintenance: ModelCtor<MaintenanceInstance>) {
        this.Treatment = Treatment;
        this.Maintenance = Maintenance;
    }

    public static async getInstance(): Promise<ManagementController> {
        if (ManagementController.instance === undefined) {
            const {Treatment, Maintenance} = await SequelizeManager.getInstance();
            ManagementController.instance = new ManagementController(Treatment, Maintenance);
        }
        return ManagementController.instance;
    }

    public async lockArea(props: MaintenanceCreationProps, admin: EmployeeInstance, area: AreaInstance):Promise<MaintenanceInstance | null> {
        if(admin !== null && area !== null){
            let maintenance = await this.Maintenance.create({
                ...props
            });
            maintenance.setEmployee(admin);
            maintenance.setArea(area);
            return maintenance;
        }
        return null;
    }

    public async treatAnimal(props: TreatmentCreationProps, veterinary: EmployeeInstance, animal: AnimalInstance): Promise<TreatmentInstance | null> {
        if(veterinary !== null && animal !== null) {
            let treatment = await this.Treatment.create({
                ...props
            });
            treatment.setEmployee(veterinary);
            treatment.setAnimal(animal);
            return treatment;
        }
        return null;
    }
}
