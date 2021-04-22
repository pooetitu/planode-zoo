import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models/index.model";
import {AnimalCreationProps, AnimalInstance} from "../models/animal.model";

export class AnimalController {

    private static instance: AnimalController;
    Animal: ModelCtor<AnimalInstance>;

    private constructor(Animal: ModelCtor<AnimalInstance>) {
        this.Animal = Animal;
    }

    public static async getInstance(): Promise<AnimalController> {
        if (AnimalController.instance === undefined) {
            const {Animal} = await SequelizeManager.getInstance();
            AnimalController.instance = new AnimalController(Animal);
        }
        return AnimalController.instance;
    }

    public async getAnimal(id: string): Promise<AnimalInstance | null> {
        return this.Animal.findOne({where: {id}});
    }

    public async createAnimal(props: AnimalCreationProps): Promise<AnimalInstance | null> {
        return await this.Animal.create({...props});
    }

    public async getAllAnimals(): Promise<AnimalInstance[]> {
        return this.Animal.findAll();
    }

    public async updateAnimal(animal: AnimalInstance, props: AnimalCreationProps) {
        await animal.update({...props});
    }

    public async deleteAnimal(id: string) {
        return await this.Animal.destroy({where: {id}});
    }
}
