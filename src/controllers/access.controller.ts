import {getRepository, Repository} from "typeorm";
import {PassUsage} from "../models/pass_usage.model";
import {Employee, EmployeeType} from "../models/employee.model";
import {Pass, PassType} from "../models/pass.model";
import {Area} from "../models/area.model";
import {AreaAccess} from "../models/area_access.model";
import {PassAreas} from "../models/pass_areas.model";
import {Schedule} from "../models/schedule.model";
import {StatsController} from "./stats.controller";


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

    /**
     * Gives access to the zoo for the given pass by creating a PassUsage available for the day, even if the pass is used to leave the zoo
     * @param pass The pass to access the zoo
     */
    public async accessZoo(pass: Pass): Promise<PassUsage> {
        const passId = pass.id;
        const passUsage = await this.passUsageRepository.createQueryBuilder()
            .where("DATE(NOW()) = DATE(createdAt) AND passId = :passId", {passId})
            .withDeleted()
            .getOne();
        if (passUsage === undefined) {
            const passUsage = await this.passUsageRepository.create();
            passUsage.pass = pass;
            return await this.passUsageRepository.save(passUsage);
        } else {
            return await this.passUsageRepository.recover(passUsage);
        }
    }

    /**
     * Checks if the zoo can open this week depending on the personal absence
     * @param date The date on which the accessibility is checked
     */
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

    /**
     * Checks if the zoo can be accessed by a given pass
     * @param pass The pass asking for access to the zoo
     */
    public async canAccessZoo(pass: Pass): Promise<Boolean> {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0)
        if (pass.endDate === undefined || (currentDate <= pass.startDate && currentDate >= pass.endDate)) {
            return false;
        }
        if (pass.type === PassType.ONCE_MONTHLY) {
            const passId = pass.id;
            const passUsage = await this.passUsageRepository.createQueryBuilder()
                .where("MONTH(NOW()) = MONTH(createdAt)")
                .andWhere("passId = :passId", {passId})
                .getOne();
            if (passUsage !== undefined) {
                passUsage.createdAt.setHours(0, 0, 0, 0);
                if (passUsage.createdAt.getTime() !== currentDate.getTime()) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Checks if the pass can access the given area
     * @param pass The pass asking for access to the area
     * @param area The area to be accessed
     */
    public async canAccessArea(pass: Pass, area: Area): Promise<Boolean> {
        const passAreas = await this.getAccessibleAreas(pass.id);
        const statsController = await StatsController.getInstance();
        if((await statsController.getAreaRealtimeAttendance(area)) >= area.capacity){
            return false;
        }
        const isOpen = await this.isAreaOpen(area)
        if (!isOpen || !passAreas.some(passArea => passArea.id === area.id)) {
            return false;
        }
        if (pass.isEscapeGame) {
            return await this.canAccessEscapeGameArea(passAreas, area.id, pass.id);
        }
        return true;
    }

    /**
     * Check if the area is currently opened depending on the area's schedule
     * @param area The area to be checked
     * @private
     */
    private async isAreaOpen(area: Area): Promise<Boolean>{
        const currentDate = new Date();
        currentDate.setFullYear(0,0,0)
        if(!Array.isArray(area.schedules)) {
            area.schedules = [area.schedules];
        }
        return area.schedules.some(schedule => {
            schedule.openTime.setFullYear(0,0,0);
            schedule.closeTime.setFullYear(0,0,0);
            return schedule.openTime.getTime() <= currentDate.getTime() && schedule.closeTime.getTime() >= currentDate.getTime();
        });
    }

    /**
     * Gives access to the area for the given pass
     * @param pass The pass accessing the area
     * @param area The area to be accessed
     */
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

    /**
     * Sets the status of the pass to left by soft deleting the PassUsage
     * This allows to count how many people are in the zoo
     * @param passId The pass used to leave the zoo
     */
    public async leaveZoo(passId: string): Promise<PassUsage> {
        const passUsage = await this.passUsageRepository.createQueryBuilder()
            .leftJoin("PassUsage.pass", "Pass")
            .where("DATE(NOW()) = DATE(PassUsage.createdAt)")
            .andWhere("Pass.id = :passId", {passId})
            .getOneOrFail();
        await this.passUsageRepository.softRemove(passUsage);
        return passUsage;
    }

    /**
     * Checks if the given area is the next to be accessed with this pass in its parkour
     * @param passAreas A list of areas accessible by the pass
     * @param areaId The area to be accessed
     * @param passId The pass accessing the area
     * @private
     */
    private async canAccessEscapeGameArea(passAreas: Area[], areaId: string, passId: string): Promise<boolean> {
        const countAccess = await this.areaAccessRepository.createQueryBuilder()
            .leftJoin("AreaAccess.passUsage", "PassUsage")
            .where("PassUsage.passId = :passId AND DATE(PassUsage.createdAt) = DATE(NOW())", {passId})
            .withDeleted()
            .getMany();
        if (countAccess.length > 0) {
            await this.softDeletePreviousAreaAccess(passAreas[countAccess.length - 1].id, passId)
        }
        return passAreas[countAccess.length].id === areaId;
    }

    /**
     * If the user is accessing another area the previous one is soft delete,
     * This later allows to count how many people are in a given area in real time
     * @param areaId The previous area accessed
     * @param passId The pass used to access the area
     * @private
     */
    private async softDeletePreviousAreaAccess(areaId: string, passId: string): Promise<void> {
        const areaAccess = await this.areaAccessRepository.createQueryBuilder()
            .leftJoin("AreaAccess.passUsage", "PassUsage")
            .where("PassUsage.passId = :passId AND DATE(PassUsage.createdAt) = DATE(NOW())", {passId})
            .andWhere("AreaAccess.areaId = :areaId", {areaId})
            .getOne();
        if (areaAccess !== undefined) {
            await this.areaAccessRepository.softRemove(areaAccess);
        }
    }

    /**
     * Get a list of areas accessible with a given pass,
     * This allows to filter if an area is currently in maintenance to not block the visitor in his parkour
     * @param passId The pass used to access an area
     * @private
     */
    private async getAccessibleAreas(passId: string): Promise<Area[]> {
        const areaInMaintenance = this.areaRepository.createQueryBuilder()
            .select("Area.id")
            .leftJoin("Area.maintenances", "Maintenance")
            .where("MONTH(NOW()) = MONTH(Maintenance.maintenanceDate)");
        return await this.areaRepository.createQueryBuilder()
            .select("Area.id")
            .leftJoinAndMapOne("Area.schedules", "Area.schedules","Schedule")
            .leftJoin("Area.passes", "PassAreas")
            .where("PassAreas.pass = :passId", {passId})
            .andWhere("Area.id NOT IN (" + areaInMaintenance.getSql() + ")")
            .orderBy("PassAreas.order", "ASC")
            .getMany();
    }

    /**
     * Checks if the type of employee is present in the given list
     * @param presentEmployees A list of employees
     * @param type The type to be checked in the list
     * @private
     */
    private containsType(presentEmployees: Employee[], type: EmployeeType): boolean {
        return presentEmployees.some(e => e.type === type);
    }
}
