import {getRepository, Repository} from "typeorm";
import {PassUsage} from "../models/pass_usage.model";
import {Employee, EmployeeType} from "../models/employee.model";
import {Pass, PassType} from "../models/pass.model";
import {Area} from "../models/area.model";
import {AreaAccess} from "../models/area_access.model";
import {PassAreas} from "../models/pass_areas.model";

// TODO Verifier la capacité d'une area lors d'un passUsage

export class AccessController {
    private static instance: AccessController;

    private passUsageRepository: Repository<PassUsage>;
    private employeeRepository: Repository<Employee>;
    private areaRepository: Repository<Area>;
    private areaAccessRepository: Repository<AreaAccess>;

    private constructor() {
        this.passUsageRepository = getRepository(PassUsage);
        this.employeeRepository = getRepository(Employee);
        this.areaRepository = getRepository(Area);
        this.areaAccessRepository = getRepository(AreaAccess);
    }

    public static async getInstance(): Promise<AccessController> {
        if (AccessController.instance === undefined) {
            AccessController.instance = new AccessController();
        }
        return AccessController.instance;
    }

    public async accessZoo(pass: Pass): Promise<PassUsage> {
        const passId = pass.id;
        const currentDate = new Date(Date.now());
        currentDate.setHours(0, 0, 0);
        const passUsage = await this.passUsageRepository.createQueryBuilder()
            .where("DATE(NOW()) = DATE(createdAt) AND passId = :passId", {passId})
            .withDeleted()
            .getOne();
        console.log(passUsage)
        if(passUsage === undefined){
            const passUsage = await this.passUsageRepository.create();
            passUsage.pass = pass;
            return await this.passUsageRepository.save(passUsage);
        }
        else{
            return await this.passUsageRepository.recover(passUsage);
        }
    }

    public async zooCanOpen(date: Date): Promise<Boolean> {
        const absenceDate = date || "NOW()";
        const absentEmployees = await this.employeeRepository.createQueryBuilder()
            .select("Employee.id")
            .leftJoin("Employee.absences", "Absence")
            .where("WEEK(:absenceDate) = WEEK(Absence.absenceDate)");
        const presentEmployees = await this.employeeRepository.createQueryBuilder()
            .where(" id NOT IN (" + absentEmployees.getSql() + ")", {absenceDate})
            .getMany();
        return (this.containsType(presentEmployees, EmployeeType.RECEPTION) ||
            this.containsType(presentEmployees, EmployeeType.VETERINARY) ||
            this.containsType(presentEmployees, EmployeeType.SELLER) ||
            this.containsType(presentEmployees, EmployeeType.SERVICE_AGENT));
    }

    public async canAccessZoo(pass: Pass): Promise<Boolean> {
        const currentDate = new Date();
        currentDate.setHours(0,0,0)
        if (pass.endDate === undefined || (currentDate <= pass.startDate && currentDate >= pass.endDate)) {
            return false;
        }
        if (pass.type === PassType.ONCE_MONTHLY) {
            const passId = pass.id;
            const passUsage = await this.passUsageRepository.createQueryBuilder()
                .where("MONTH(NOW()) = MONTH(createdAt)")
                .andWhere("passId = :passId", {passId})
                .getOne();
            if (passUsage !== undefined && passUsage.createdAt.getDate() !== currentDate.getDate()) {
                return false;
            }
        }
        return true;
    }

    public async canAccessArea(pass: Pass, area: Area): Promise<Boolean> {
        const passId = pass.id;
        const passAreas = await this.getAccessibleAreas(pass.id);
        if (!passAreas.some(passArea => passArea.id === area.id)) {
            return false;
        }
        if (pass.isEscapeGame) {
            const countAccess = await this.areaAccessRepository.createQueryBuilder()
                .leftJoin("AreaAccess.passUsage", "PassUsage")
                .where("PassUsage.passId = :passId AND DATE(PassUsage.createdAt) = DATE(NOW())", {passId})
                .getMany();
            console.log(countAccess)
            if(countAccess.length > 0) {
                const areaId = passAreas[countAccess.length-1].id
                const areaAccess = await this.areaAccessRepository.createQueryBuilder()
                    .leftJoin("AreaAccess.passUsage", "PassUsage")
                    .where("PassUsage.passId = :passId AND DATE(PassUsage.createdAt) = DATE(NOW())", {passId})
                    .andWhere("AreaAccess.areaId = :areaId", {areaId})
                    .getOne();
                if(areaAccess !== undefined){
                    await this.areaAccessRepository.softRemove(areaAccess);
                }
            }
            return passAreas[countAccess.length].id === area.id;
        }
        return true;
    }

    public async accessArea(pass: Pass, area: Area): Promise<AreaAccess> {
        const passId = pass.id;
        const areaId = area.id;
        const passUsage = await this.passUsageRepository.createQueryBuilder()
            .where("DATE(NOW()) = DATE(createdAt) AND passId = :passId", {passId})
            .getOneOrFail();
        const passUsageId = passUsage.id;
        const areaAccess = await this.areaAccessRepository.createQueryBuilder()
            .leftJoin("AreaAccess.area", "Area")
            .leftJoin("AreaAccess.passUsage", "PassUsage")
            .where("Area.id = :areaId", {areaId})
            .andWhere("PassUsage.id = :passUsageId", {passUsageId})
            .getOne();
        if (areaAccess !== undefined) {
            return areaAccess;
        } else {
            const areaAccess = this.areaAccessRepository.create({createdAt: new Date(), passUsage, area});
            return await this.areaAccessRepository.save(areaAccess);
        }
    }

    public async leaveZoo(passId: string): Promise<PassUsage> {
        const passUsage = await this.passUsageRepository.createQueryBuilder()
            .leftJoin("PassUsage.pass", "Pass")
            .where("DATE(NOW()) = DATE(PassUsage.createdAt)")
            .andWhere("Pass.id = :passId", {passId})
            .getOneOrFail();
        await this.passUsageRepository.softRemove(passUsage);
        return passUsage;
    }

    private async getAccessibleAreas(passId: string): Promise<Area[]> {
        const areaInMaintenance = this.areaRepository.createQueryBuilder()
            .select("Area.id")
            .leftJoin("Area.maintenances", "Maintenance")
            .where("MONTH(NOW()) = MONTH(Maintenance.maintenanceDate)");
        return await this.areaRepository.createQueryBuilder()
            .select("Area.id")
            .leftJoin("Area.passes", "PassAreas")
            .where("PassAreas.pass = :passId", {passId})
            .andWhere("Area.id NOT IN (" + areaInMaintenance.getSql() + ")")
            .orderBy("PassAreas.order", "ASC")
            .getMany();
    }

    private containsType(presentEmployees: Employee[], type: EmployeeType): boolean {
        return presentEmployees.some(e => e.type === type);
    }
}
