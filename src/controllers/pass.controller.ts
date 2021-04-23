import {Pass, passMap, PassProps} from "../models/pass.model";
import {User} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {PassAreas} from "../models/pass_areas.model";
import {AreaController} from "./area.controller";

export class PassController {

    private static instance: PassController;

    private passRepository: Repository<Pass>;
    private constructor() {
        this.passRepository = getRepository(Pass);
    }

    public static async getInstance(): Promise<PassController> {
        if (PassController.instance === undefined) {
            PassController.instance = new PassController();
        }
        return PassController.instance;
    }

    public async getAllPass(): Promise<Pass[]> {
        return await this.passRepository.find();
    }

    public async getPassById(id: string): Promise<Pass> {
        return await this.passRepository.findOneOrFail(id);
    }

    public async createPass(props: PassProps, user: User): Promise<Pass> {
        const startDate = new Date(props.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + passMap[props.type])
        const pass = this.passRepository.create({
            ...props,
            endDate,
            startDate
        });
        const areaController = await AreaController.getInstance();
        for (const areaId of props.areaIds) {
            const area = await areaController.getAreaById(areaId);
            if (area === null) {
                throw {error: "Area with id: " + areaId + "doesn't exist"};
            }
            const passArea = getRepository(PassAreas).create({pass,area});
            pass.areas.push(passArea);
        }
        pass.user = user;
        return await this.passRepository.save(pass);
    }

    public async deletePassById(id: string): Promise<boolean> {
        const result = await this.passRepository.softDelete(id);
        return !(result.affected === undefined || result.affected <= 0);
    }
}
