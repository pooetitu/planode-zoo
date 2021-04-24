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
        //todo ajout condition date sortie du passusage
        return await this.passUsageRepository.createQueryBuilder()
            .where("DATE(NOW()) = DATE(useDate)")
            .where("leaveDate = NULL")
            .getCount();
    }

    public async getAreaRealtimeAttendance(area: Area): Promise<number> {
        let startDate: Date = new Date();
        let endDate: Date = new Date(startDate);
        startDate.setMinutes(startDate.getMinutes() - area.duration);
        return await this.areaAccessRepository.createQueryBuilder()
            .where("useDate BETWEEN :startDate AND :endDate", {startDate, endDate})
            .getCount();

    }

    public async getZooAttendance(date: Date, period: "WEEK" | "DATE"): Promise<number> {
        return await this.passUsageRepository.createQueryBuilder()
            .where(":period(:date) = :period(useDate)", {period, date})
            .getCount();
    }

    public async getAreaAttendance(date: Date, period: "WEEK" | "DATE", areaId: string): Promise<number> {
        return await this.areaAccessRepository.createQueryBuilder()
            .where(":period(:date) = :period(useDate)", {period, date})
            .where("area = :id", {areaId})
            .getCount();

    }
}
