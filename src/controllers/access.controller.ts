import Sequelize, {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models/index.model";
import {EmployeeInstance, EmployeeType} from "../models/employee.model";
import {PresenceInstance} from "../models/presence.model";
import {PassUsageInstance} from "../models/pass_usage.model";
import {PassInstance, PassType} from "../models/pass.model";
import {AreaInstance} from "../models/area.model";
import {AreaAccessInstance} from "../models/area_access.model";

export class AccessController {
    private static instance: AccessController;
    Employee: ModelCtor<EmployeeInstance>;
    Presence: ModelCtor<PresenceInstance>;
    PassUsage: ModelCtor<PassUsageInstance>;
    AreaAccess: ModelCtor<AreaAccessInstance>;

    private constructor(Employee: ModelCtor<EmployeeInstance>, Presence: ModelCtor<PresenceInstance>, PassUsage: ModelCtor<PassUsageInstance>, AreaAccess: ModelCtor<AreaAccessInstance>) {
        this.Employee = Employee;
        this.Presence = Presence;
        this.PassUsage = PassUsage;
        this.AreaAccess = AreaAccess;
    }

    public static async getInstance(): Promise<AccessController> {
        if (AccessController.instance === undefined) {
            const {Employee, Presence, PassUsage, AreaAccess} = await SequelizeManager.getInstance();
            AccessController.instance = new AccessController(Employee, Presence, PassUsage, AreaAccess);
        }
        return AccessController.instance;
    }

    public async usePass(pass: PassInstance): Promise<PassUsageInstance | null> {
        const currentDate = new Date();
        const passUsages = await pass.getPassUsages({
            where: {
                [Sequelize.Op.and]: [Sequelize.where(Sequelize.fn('DATE', currentDate), Sequelize.fn('DATE', Sequelize.col('use_date')))]
            }
        });
        if (passUsages.length > 0 && passUsages[0] !== null) {
            return passUsages[0];
        } else {
            const passUsage = await this.PassUsage.create({useDate: new Date()});
            await passUsage.setPass(pass);
            await pass.addPassUsage(passUsage);
            return passUsage;
        }
    }

    public async zooCanOpen(date: Date): Promise<Boolean> {
        const presentEmployees = await this.Employee.findAll({
            include: [{model: this.Presence}],
            where: {
                [Sequelize.Op.and]: [Sequelize.where(Sequelize.fn('WEEK', date), Sequelize.fn('WEEK', Sequelize.col('Presences.presence_date')))]
            }
        });
        return (this.containsType(presentEmployees, EmployeeType.RECEPTION) !== undefined ||
            this.containsType(presentEmployees, EmployeeType.VETERINARY) !== undefined ||
            this.containsType(presentEmployees, EmployeeType.SELLER) !== undefined ||
            this.containsType(presentEmployees, EmployeeType.SERVICE_AGENT) !== undefined);
    }

    public async canAccessZoo(pass: PassInstance): Promise<Boolean> {
        const currentDate = new Date();
        if (pass.endDate === undefined || pass.startDate <= currentDate && pass.endDate <= currentDate) {
            return false;
        }
        if (pass.type === PassType.ONCE_MONTHLY) {
            const passUsage = (await pass.getPassUsages({
                limit:1,
                where: {
                    [Sequelize.Op.and]: [Sequelize.where(Sequelize.fn('MONTH', currentDate), Sequelize.fn('MONTH', Sequelize.col('use_date')))]
                }
            }))[0];
            if (passUsage.useDate !== currentDate) {
                return false;
            }
        }
        return true;
    }

    private containsType(presentEmployees: EmployeeInstance[], type: EmployeeType): EmployeeInstance | undefined {
        return presentEmployees.find(e => e.getDataValue("type") === type);
    }

    public async canAccessArea(pass: PassInstance, area: AreaInstance): Promise<Boolean> {
        const passAreas = (pass.get("orderedAreaIds") as unknown as number[]);
        if(passAreas.includes(area.id) !== undefined){
            if(pass.isEscapeGame){
                const currentDate = new Date();
                const areasVisited = (await (await pass.getPassUsages({
                    where:{
                        [Sequelize.Op.and]: [Sequelize.where(Sequelize.fn('DATE', currentDate), Sequelize.fn('DATE', Sequelize.col('use_date')))]
                    }
                }))[0].getAreaAccesses()).length;
                return passAreas[areasVisited] === area.id;
            }
            return true;
        }
        return false;
    }

    public async accessArea(pass: PassInstance, area: AreaInstance): Promise<AreaAccessInstance | null> {
        if(await this.canAccessArea(pass, area)) {
            const currentDate = new Date();
            const passUsage = (await pass.getPassUsages({
                limit: 1,
                where: {
                    [Sequelize.Op.and]: [Sequelize.where(Sequelize.fn('DATE', currentDate), Sequelize.fn('DATE', Sequelize.col('use_date')))]
                }
            }))[0];
            const areaAccess = await this.AreaAccess.create({
                useDate: currentDate
            });
            if (areaAccess !== null) {
                await passUsage.addAreaAccess(areaAccess);
                await areaAccess.setPassUsage(passUsage);
                await areaAccess.setArea(area);
            }
            return areaAccess;
        }
        return null;
    }

}
