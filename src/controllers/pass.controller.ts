import {Pass, passMap, PassProps, PassType} from "../models/pass.model";
import {User} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {PassAreas} from "../models/pass_areas.model";
import {AreaController} from "./area.controller";
import {EmployeeType} from "../models/employee.model";

export class PassController {
    private static instance: PassController;

    private passRepository: Repository<Pass>;
    private passAreasRepository: Repository<PassAreas>;

    private constructor() {
        this.passRepository = getRepository(Pass);
        this.passAreasRepository = getRepository(PassAreas);
    }

    public static async getInstance(): Promise<PassController> {
        if (PassController.instance === undefined) {
            PassController.instance = new PassController();
        }
        return PassController.instance;
    }

    public async getAllPass(userId: string): Promise<Pass[]> {
        return await this.passRepository.createQueryBuilder()
            .leftJoin("Pass.user", "User")
            .where("User.id = :userId", {userId})
            .getMany();
    }

    public async getPassById(id: string): Promise<Pass> {
        return await this.passRepository.findOneOrFail(id);
    }

    public async getPassByIdForUser(id: string, userId: string): Promise<Pass> {
        return await this.passRepository.createQueryBuilder()
            .leftJoin("Pass.user", "User")
            .where("Pass.id = :id", {id})
            .andWhere("User.id = :userId", {userId})
            .getOneOrFail();
    }

    public async createPass(props: PassProps, user: User): Promise<Pass> {
        if (props.type === PassType.NIGHT && (!user.employee || user.employee.type !== EmployeeType.ADMIN)) {
            throw {error: "To buy a night pass you must be an administrator"};
        }
        const startDate = new Date(props.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + passMap[props.type])
        const pass = this.passRepository.save(this.passRepository.create({
            ...props,
            endDate,
            startDate,
            user
        }));
        let order = 0;
        const areaController = await AreaController.getInstance();
        for (const areaId of props.areaIds) {
            const area = await areaController.getAreaById(areaId);
            const passArea = getRepository(PassAreas).create({pass, area, order});
            await this.passAreasRepository.save(passArea);
            order++;
        }
        return pass;
    }

    public async deletePassById(id: string): Promise<boolean> {
        const result = await this.passRepository.softDelete(id);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async updatePass(id: string, props: PassProps) {
        const result = await this.passRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }
}
