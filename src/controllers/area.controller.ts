import {Area, AreaProps} from "../models/area.model";
import {getRepository} from "typeorm";
import {Animal} from "../models/animal.model";

export class AreaController {
    private static instance: AreaController;

    private constructor() {
    }

    public static async getInstance(): Promise<AreaController> {
        if (AreaController.instance === undefined) {
            AreaController.instance = new AreaController();
        }
        return AreaController.instance;
    }

    public async createArea(props: AreaProps): Promise<Area | null> {
        const areaRepository = getRepository(Area);
        const area = areaRepository.create(props);
        return await areaRepository.save(area);
    }

    public async getAreaById(id: string): Promise<Area> {
        return await getRepository(Area).findOneOrFail(id);
    }

    public async getAll(): Promise<Area[]> {
        return await getRepository(Area).find();
    }

    public async deleteAreaById(id: string): Promise<boolean> {
        const result = await getRepository(Area).softDelete(id)
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async updateArea(id: string, props: AreaProps) {
        const result = await getRepository(Area).update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async addAnimal(area: Area, animal: Animal) {
        area.animals.push(animal);
        await getRepository(Area).save(area);
    }
}
