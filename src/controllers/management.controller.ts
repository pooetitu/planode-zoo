import {Maintenance, MaintenanceProps} from "../models/maintenance.model";
import {Area} from "../models/area.model";
import {Employee} from "../models/employee.model";
import {Animal} from "../models/animal.model";
import {Treatment, TreatmentProps} from "../models/treatment.model";
import {getRepository, Repository} from "typeorm";
import {AreaAccess} from "../models/area_access.model";

export class ManagementController {

    private static instance: ManagementController;
    private areaAccessRepository: Repository<AreaAccess>;
    private treatmentRepository: Repository<Treatment>;
    private maintenanceRepository: Repository<Maintenance>;

    private constructor() {
        this.areaAccessRepository = getRepository(AreaAccess);
        this.treatmentRepository = getRepository(Treatment);
        this.maintenanceRepository = getRepository(Maintenance);
    }

    public static async getInstance(): Promise<ManagementController> {
        if (ManagementController.instance === undefined) {
            ManagementController.instance = new ManagementController();
        }
        return ManagementController.instance;
    }

    public async setAreaMaintenanceDate(props: MaintenanceProps, admin: Employee, area: Area): Promise<Maintenance> {
        const maintenance = this.maintenanceRepository.create({
            ...props
        });
        maintenance.employee = admin;
        maintenance.area = area;
        return await this.maintenanceRepository.save(maintenance);
    }

    public async treatAnimal(props: TreatmentProps, veterinary: Employee, animal: Animal): Promise<Treatment> {
        const treatment = this.treatmentRepository.create({
            ...props
        });
        treatment.animal = animal;
        treatment.employee = veterinary;
        return await this.treatmentRepository.save(treatment);

    }

    /*TODO
    Trouver un moyen d'avoir les mois n'ayant aucun acces a un espace
     */
    public async suggestedMaintenanceDate(areaId: string): Promise<number> {
        const result = await this.areaAccessRepository.createQueryBuilder()
            .leftJoin("AreaAccess.area", "Area")
            .where("Area.id = :areaId", {areaId})
            .andWhere("DATE(NOW())-1 = DATE(createdAt)")
            .groupBy("MONTH(createdAt)")
            .select("COUNT(*)", "count")
            .getRawMany();
        console.log(result);/*
        let access = areaAccess.reduce((a, b) =>
            // @ts-ignore
            b.getDataValue(`totalCount`) < a.getDataValue(`totalCount`) ? b : a
        );*/
        return 0;// access.createdAt.getMonth();
    }
}
