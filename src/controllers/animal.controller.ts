import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models/index.model";
import {AnimalInstance} from "../models/animal.model";

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

    public async getAnimal(id: number): Promise<AnimalInstance | null> {
        return this.Animal.findOne({
            where: {
                id
            }
        });
    }
}
