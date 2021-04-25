import {Area, AreaProps} from "../models/area.model";
import {getRepository, Repository} from "typeorm";
import {Animal} from "../models/animal.model";
import {Schedule} from "../models/schedule.model";

export class AreaController {
    private static instance: AreaController;
    private areaRepository: Repository<Area>;
    private scheduleRepository: Repository<Schedule>;

    private constructor() {
        this.areaRepository = getRepository(Area);
        this.scheduleRepository = getRepository(Schedule);
    }

    public static async getInstance(): Promise<AreaController> {
        if (AreaController.instance === undefined) {
            AreaController.instance = new AreaController();
        }
        return AreaController.instance;
    }

    public async createArea(props: AreaProps): Promise<Area | null> {
        if (props.schedules.length <= 0) {
            throw {message: "You must add at least one schedule to the area"};
        }
        const area = this.areaRepository.create({...props});
        return await this.areaRepository.save(area);
    }

    public async getAreaById(id: string): Promise<Area> {
        return await this.areaRepository.findOneOrFail(id);
    }

    public async getAll(): Promise<Area[]> {
        return await this.areaRepository.find();
    }

    public async deleteAreaById(id: string): Promise<boolean> {
        const result = await this.areaRepository.softDelete(id);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async updateArea(id: string, props: AreaProps) {
        const result = await this.areaRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async addAnimal(area: Area, animal: Animal) {
        animal.area = area;
        await getRepository(Animal).save(animal);
    }
}
