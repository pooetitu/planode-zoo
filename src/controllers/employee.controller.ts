import {ModelCtor} from "sequelize";
import {UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models/index.model";
import {EmployeeInstance} from "../models/employee.model";

export class EmployeeController {

    private static instance: EmployeeController;

    Session: ModelCtor<SessionInstance>;
    Employee: ModelCtor<EmployeeInstance>;
    User: ModelCtor<UserInstance>;

    private constructor(Session: ModelCtor<SessionInstance>, Employee: ModelCtor<EmployeeInstance>, User: ModelCtor<UserInstance>) {
        this.User = User;
        this.Session = Session;
        this.Employee = Employee;
    }

    public static async getInstance(): Promise<EmployeeController> {
        if (EmployeeController.instance === undefined) {
            const {Session, Employee, User} = await SequelizeManager.getInstance();
            EmployeeController.instance = new EmployeeController(Session, Employee, User);
        }
        return EmployeeController.instance;
    }

    async getEmployeeByToken(token: string): Promise<EmployeeInstance | null> {
        return await this.Employee.findOne({
            include: [{
                model: this.User,
                duplicating: false,
                required: true,
                include: [{
                    model: this.Session,
                    duplicating: false,
                    required: true,
                    where: {
                        token
                    }
                }]
            }]
        });
    }
}
