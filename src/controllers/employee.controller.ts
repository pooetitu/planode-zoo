import {Employee,  EmployeeProps} from "../models/employee.model";
import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.model";

export class EmployeeController {

    private static instance: EmployeeController;

    private employeeRepository: Repository<Employee>;

    private constructor() {
        this.employeeRepository = getRepository(Employee);
    }

    public static async getInstance(): Promise<EmployeeController> {
        if (EmployeeController.instance === undefined) {
            EmployeeController.instance = new EmployeeController();
        }
        return EmployeeController.instance;
    }

    async createEmployee(props: EmployeeProps): Promise<Employee | null> {
        const employee = this.employeeRepository.create({...props});
        await this.employeeRepository.save(employee);
        return employee;
    }

    async deleteEmployee(user: User): Promise<boolean> {
        await this.employeeRepository.remove(user.employee);
        return true;
    }

    async getEmployeeByToken(token: string): Promise<Employee> {
        return await this.employeeRepository.createQueryBuilder()
            .innerJoin("employee.user","user")
            .innerJoin("user.session","session")
            .where("session.token = :token", {token})
            .getOneOrFail();
    }

    async getEmployeeById(id: string): Promise<Employee> {
        return await this.employeeRepository.findOneOrFail(id);
    }

    async getAllUser() {
        return await this.employeeRepository.find();
    }

    async getEmployeeByUserId(userId: string) {
        return await this.employeeRepository.createQueryBuilder()
            .innerJoin("employee.user", "user")
            .where("user.id = :userId",{userId})
            .getOne();
    }
}
