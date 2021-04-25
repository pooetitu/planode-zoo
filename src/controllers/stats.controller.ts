import {Area} from "../models/area.model";
import {AreaAccess} from "../models/area_access.model";
import {PassUsage} from "../models/pass_usage.model";
import {getRepository, Repository} from "typeorm";

export class StatsController {
    private static instance: StatsController;

    private passUsageRepository: Repository<PassUsage>;
    private areaAccessRepository: Repository<AreaAccess>;

    private constructor() {
        this.passUsageRepository = getRepository(PassUsage);
        this.areaAccessRepository = getRepository(AreaAccess);
    }

    public static async getInstance(): Promise<StatsController> {
        if (StatsController.instance === undefined) {
            StatsController.instance = new StatsController();
        }
        return StatsController.instance;
    }

    public async getZooRealtimeAttendance(): Promise<number> {
        return await this.passUsageRepository.createQueryBuilder()
            .where("DATE(NOW()) = DATE(createdAt)")
            .getCount();
    }

    public async getAreaRealtimeAttendance(area: Area): Promise<number> {
        const areaId = area.id;
        let startDate: Date = new Date();
        let endDate: Date = new Date(startDate);
        startDate.setMinutes(startDate.getMinutes() - area.duration);
        return await this.areaAccessRepository.createQueryBuilder()
            .where("createdAt BETWEEN :startDate AND :endDate", {startDate, endDate})
            .andWhere("areaId = :areaId", {areaId})
            .getCount();
    }

    public async getZooAttendance(date: Date, period: "WEEK" | "DATE" | "MONTH"): Promise<number> {
        const year = date.getFullYear();
        return await this.passUsageRepository.createQueryBuilder()
            .select("DISTINCT ON (PassUsage.id)")
            .where(period + "(:date) = " + period + "(createdAt)", {period, date})
            .andWhere("YEAR(:year) = YEAR(createdAt)", {year})
            .getCount();
    }

    public async getAreaAttendance(date: Date, period: "WEEK" | "DATE" | "MONTH", areaId: string): Promise<number> {
        return await this.areaAccessRepository.createQueryBuilder()
            .where(period + "(:date) = " + period + "(createdAt)", {date})
            .andWhere("YEAR(:date) = YEAR(createdAt)", {date})
            .andWhere("areaId = :areaId", {areaId})
            .withDeleted()
            .getCount();
    }
}
