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
        currentDate.setHours(0,0,0);
        const passUsage = await this.passUsageRepository.createQueryBuilder()
            .where("DATE(NOW()) = DATE(`use_date`) AND id = :passId",{passId})
            .getOneOrFail();
        passUsage.leaveDate = undefined;
        if (passUsage.useDate === currentDate) {
            return passUsage;
        } else {
            const passUsage = await this.passUsageRepository.create({useDate: currentDate});
            passUsage.pass = pass;
            return await this.passUsageRepository.save(passUsage);
        }
    }

    public async zooCanOpen(date: Date): Promise<Boolean> {
        const presenceDate = date || "NOW()";
        const presentEmployees = await this.employeeRepository.createQueryBuilder()
                .leftJoin("Employee.presences", "Presence")
                .where("WEEK(:presenceDate) = WEEK(Presence.presenceDate)", {presenceDate})
                .getMany();
        return (this.containsType(presentEmployees, EmployeeType.RECEPTION) !== undefined ||
            this.containsType(presentEmployees, EmployeeType.VETERINARY) !== undefined ||
            this.containsType(presentEmployees, EmployeeType.SELLER) !== undefined ||
            this.containsType(presentEmployees, EmployeeType.SERVICE_AGENT) !== undefined);
    }

    public async canAccessZoo(pass: Pass): Promise<Boolean> {
        const currentDate = new Date();
        if (pass.endDate === undefined || !(pass.startDate <= currentDate && pass.endDate >= currentDate)) {
            return false;
        }
        if (pass.type === PassType.ONCE_MONTHLY) {
            const passUsage = await this.passUsageRepository.createQueryBuilder()
                .where("MONTH(NOW()) = MONTH(useDate)")
                .getOneOrFail();
            if (passUsage.useDate !== currentDate) {
                return false;
            }
        }
        return true;
    }

    private async getAccessibleAreas(passId: string): Promise<Area[]>{
        const areaInMaintenance = this.areaRepository.createQueryBuilder()
            .select("id")
            .leftJoin("Area.maintenances", "Maintenance")
            .where("MONTH(NOW()) = MONTH(Maintenance.maintenanceDate)");
         return await this.areaRepository.createQueryBuilder()
            .select("id")
            .leftJoin("Area.passes", "PassAreas")
            .where("PassAreas.pass = :passId", {passId})
            .where("Area.id NOT IN ("+ areaInMaintenance.getSql() +")")
            .orderBy("PassAreas.id","ASC")
            .getMany();
    }

    public async canAccessArea(pass: Pass, area: Area): Promise<Boolean> {
        const passId = pass.id;
        const passAreas = await this.getAccessibleAreas(pass.id);
        if (!passAreas.some(passArea => passArea.id === area.id)) {
            return false;
        }
        if (pass.isEscapeGame) {
            const countAccess = await this.areaAccessRepository.createQueryBuilder()
                .leftJoin("AreaAccess.passUsage","PassUsage")
                .where("PassUsage.pass = :passId AND DATE(PassUsage.useDate) = DATE(NOW())", {passId})
                .getCount();
            return passAreas[countAccess].id === area.id;
        }
        return true;
    }

    public async accessArea(pass: Pass, area: Area): Promise<AreaAccess | null> {
        const areaId = area.id;
        if (await this.canAccessArea(pass, area)) {
            const passUsage = await this.passUsageRepository.createQueryBuilder()
                    .where("DATE(NOW()) = DATE(useDate) AND user = :id", {areaId})
                    .getOneOrFail();
            const areaAccess = this.areaAccessRepository.create({
                useDate: new Date()
            });
            if (areaAccess !== null) {
                areaAccess.passUsage = passUsage;
                areaAccess.area = area;
                return await this.areaAccessRepository.save(areaAccess);
            }
        }
        return null;
    }

    private containsType(presentEmployees: Employee[], type: EmployeeType): boolean {
        return presentEmployees.some(e => e.type === type);
    }

    public async leaveZoo(passId: string): Promise<PassUsage> {
        const passUsage = await this.passUsageRepository.createQueryBuilder()
            .where("DATE(NOW()) = DATE(PassUsage.useDate)")
            .leftJoin("PassUsage.pass", "Pass")
            .where("Pass.id = passId", {passId})
            .getOneOrFail();
        passUsage.leaveDate = new Date(Date.now());
        await this.passUsageRepository.save(passUsage);
        return passUsage;
    }
}
