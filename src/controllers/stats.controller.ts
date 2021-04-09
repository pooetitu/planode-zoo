import Sequelize, {fn, ModelCtor, Op} from "sequelize";
import {SequelizeManager} from "../models/index.model";
import {AreaInstance} from "../models/area.model";
import {AreaAccessInstance} from "../models/area_access.model";
import {PassUsageInstance} from "../models/pass_usage.model";

export enum StatsPeriods {
    DAY = "DATE",
    WEEK = "WEEK"
}

export class StatsController {
    private static instance: StatsController;
    Area: ModelCtor<AreaInstance>;
    AreaAccess: ModelCtor<AreaAccessInstance>;
    PassUsage: ModelCtor<PassUsageInstance>;

    private constructor(Area: ModelCtor<AreaInstance>, AreaAccess: ModelCtor<AreaAccessInstance>, PassUsage: ModelCtor<PassUsageInstance>) {
        this.Area = Area;
        this.AreaAccess = AreaAccess;
        this.PassUsage = PassUsage;
    }

    public static async getInstance(): Promise<StatsController> {
        if (StatsController.instance === undefined) {
            const {Area, AreaAccess, PassUsage} = await SequelizeManager.getInstance();
            StatsController.instance = new StatsController(Area, AreaAccess, PassUsage);
        }
        return StatsController.instance;
    }

    public async getZooRealtimeAttendance(): Promise<number> {
        const areaAccesses = await this.PassUsage.findAll({
            where: {
                [Op.and]: [Sequelize.fn('DATE', new Date()), Sequelize.fn('DATE', Sequelize.col('use_date')), {leave_date: null}]
            }
        });
        console.log(areaAccesses)
        return areaAccesses.length;
    }

    public async getAreaRealtimeAttendance(area: AreaInstance): Promise<number> {
        let startDate: Date = new Date();
        let endDate: Date = new Date(startDate);
        startDate.setMinutes(startDate.getMinutes() - area.duration);
        const areaAccesses = await area.getAreaAccesses({
            where: {
                use_date: {[Op.between]: [startDate, endDate]}
            }
        });
        return areaAccesses.length;
    }

    public async getZooAttendance(date: Date, period: StatsPeriods): Promise<number> {
        const areaAccesses = await this.PassUsage.findAndCountAll({
            where: {
                [Op.and]: [Sequelize.fn(period, date), Sequelize.fn(period, Sequelize.col('use_date')),{leave_date: null}]
            }
        });
        return areaAccesses.count;
    }

    public async getAreaAttendance(date: Date, period: StatsPeriods, area: AreaInstance): Promise<number> {
        const areaAccesses = await area.getAreaAccesses({
            where: {
                [Op.and]: [Sequelize.fn(period, date), Sequelize.fn(period, Sequelize.col('use_date'))]
            }
        });
        return areaAccesses.length;
    }
}