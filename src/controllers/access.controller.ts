import Sequelize, {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models/index.model";
import {EmployeeInstance, EmployeeType} from "../models/employee.model";
import {PresenceInstance} from "../models/presence.model";
import {PassUsageInstance} from "../models/pass_usage.model";
import {PassInstance, PassType} from "../models/pass.model";

export class AccessController {
    private static instance: AccessController;
    Employee: ModelCtor<EmployeeInstance>;
    Presence: ModelCtor<PresenceInstance>;
    PassUsage: ModelCtor<PassUsageInstance>;

    private constructor(Employee: ModelCtor<EmployeeInstance>, Presence: ModelCtor<PresenceInstance>, PassUsage: ModelCtor<PassUsageInstance>) {
        this.Employee = Employee;
        this.Presence = Presence;
        this.PassUsage = PassUsage;
    }

    public static async getInstance(): Promise<AccessController> {
        if (AccessController.instance === undefined) {
            const {Employee, Presence, PassUsage} = await SequelizeManager.getInstance();
            AccessController.instance = new AccessController(Employee, Presence, PassUsage);
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
        if(passUsages.length > 0 && passUsages[0] !== null){
            return passUsages[0];
        }else{
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

    private containsType(presentEmployees: EmployeeInstance[], type: EmployeeType): EmployeeInstance | undefined {
        return presentEmployees.find(e => e.getDataValue("type") === type);
    }

    public async canAccessZoo(pass: PassInstance): Promise<Boolean>{
        const currentDate = new Date();
        if(!(pass.startDate <= currentDate && pass.endDate !== undefined && pass.endDate <= currentDate)){
            return false;
        }
        if(pass.type === PassType.ONCE_MONTHLY){
            const passUsage = await pass.getPassUsages({
                where: {
                    [Sequelize.Op.and]: [Sequelize.where(Sequelize.fn('MONTH', currentDate), Sequelize.fn('MONTH', Sequelize.col('use_date')))]
                }
            });
            if(passUsage[0].useDate !== currentDate && passUsage !== null ) {
                return false;
            }
        }
        return true;
    }

}
