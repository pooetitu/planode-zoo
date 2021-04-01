import {ModelCtor} from "sequelize";
import {UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models/index.model";
import {EmployeeCreationProps, EmployeeInstance} from "../models/employee.model";

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

    async createEmployee(props: EmployeeCreationProps, user: UserInstance): Promise<EmployeeInstance | null> {
        const employee = await this.Employee.create({...props});
        await employee.setUser(user);
        await user.setEmployee(employee);
        return employee;
    }

    async getEmployeeByToken(token: string): Promise<EmployeeInstance | null> {
        return await this.Session.findOne({
            where: {token}
        }).then(session => session!.getUser().then(user => user!.getEmployee()));
    }
}
