import {col, fn, ModelCtor, Op} from "sequelize";
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

    public async lockArea(props: MaintenanceCreationProps, admin: EmployeeInstance, area: AreaInstance): Promise<MaintenanceInstance | null> {
        if (admin !== null && area !== null) {
            const maintenance = await this.Maintenance.create({
                ...props
            });
            await maintenance.setEmployee(admin);
            await maintenance.setArea(area);
            return maintenance;
        }
        return null;
    }

    public async treatAnimal(props: TreatmentCreationProps, veterinary: EmployeeInstance, animal: AnimalInstance): Promise<TreatmentInstance | null> {
        if (veterinary !== null && animal !== null) {
            const treatment = await this.Treatment.create({
                ...props
            });
            await treatment.setAnimal(animal);
            await treatment.setEmployee(veterinary);
            return treatment;
        }
        return null;
    }

    /*TODO
    Trouver un moyen d'avoir les mois n'ayant aucun acces a un espace
     */
    public async suggestedMaintenanceDate(area: AreaInstance): Promise<number> {
        const lastYearStart = new Date(new Date().getFullYear() - 1, 0, 2);
        const lastYearEnd = new Date(new Date().getFullYear() - 1, 11, 32);
        const areaAccess = await area.getAreaAccesses({
            attributes: ['useDate', [fn('COUNT', 'id'), 'totalCount']],
            group: [fn('MONTH', col('use_date'))],
            where: {use_date: {[Op.between]: [lastYearStart, lastYearEnd]}}
        });
        let access = areaAccess.reduce((a, b) =>
            // @ts-ignore
            b.getDataValue(`totalCount`) < a.getDataValue(`totalCount`) ? b : a
        );
        return access.useDate.getMonth();
    }
}
