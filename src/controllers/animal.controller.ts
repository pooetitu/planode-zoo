import {getRepository, Repository} from "typeorm";
import {Animal, AnimalProps} from "../models/animal.model";

export class AnimalController {

    private static instance: AnimalController;
    private animalRepository: Repository<Animal>;

    private constructor() {
        this.animalRepository = getRepository(Animal);
    }

    public static async getInstance(): Promise<AnimalController> {
        if (AnimalController.instance === undefined) {
            AnimalController.instance = new AnimalController();
        }
        return AnimalController.instance;
    }

    public async getAnimal(id: string): Promise<Animal> {
        return await this.animalRepository.findOneOrFail(id);
    }

    public async createAnimal(props: AnimalProps): Promise<Animal> {
        const animal = this.animalRepository.create(props);
        return await this.animalRepository.save(animal);
    }

    public async getAllAnimals(): Promise<Animal[]> {
        return this.animalRepository.find();
    }

    public async updateAnimal(id: string, props: AnimalProps) {
        const result = await this.animalRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async deleteAnimal(id: string) {
        const result = await this.animalRepository.softDelete(id);
        return !(result.affected === undefined || result.affected <= 0);
    }
}
