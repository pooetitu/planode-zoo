import {Employee, EmployeeProps} from "../models/employee.model";
import {getRepository, Repository} from "typeorm";
import {Absence, AbsenceProps} from "../models/absence.model";

export class EmployeeController {

    private static instance: EmployeeController;

    private employeeRepository: Repository<Employee>;
    private absenceRepository: Repository<Absence>;

    private constructor() {
        this.employeeRepository = getRepository(Employee);
        this.absenceRepository = getRepository(Absence);
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

    async deleteEmployee(employee: string): Promise<boolean> {
        await this.employeeRepository.softDelete(employee);
        return true;
    }

    async getEmployeeById(id: string): Promise<Employee> {
        return await this.employeeRepository.findOneOrFail(id);
    }

    async getAllUser() {
        return await this.employeeRepository.find();
    }

    async getEmployeeByUserId(userId: string) {
        return await this.employeeRepository.createQueryBuilder()
            .innerJoin("Employee.user", "User")
            .where("User.id = :userId", {userId})
            .getOne();
    }

    async addWeekAbsence(employee: Employee, props: AbsenceProps): Promise<Absence> {
        const absence = getRepository(Absence).create(props);
        absence.employee = employee;
        return await this.absenceRepository.save(absence);
    }
}
