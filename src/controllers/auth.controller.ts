import {User, UserProps} from "../models/user.model";
import {Session} from "../models/session.model";
import {hash} from "bcrypt";
import {getRepository, Repository} from "typeorm";

export class AuthController {

    private static instance: AuthController;
    private userRepository: Repository<User>;
    private sessionRepository: Repository<Session>;

    private constructor() {
        this.userRepository = getRepository(User);
        this.sessionRepository = getRepository(Session);
    }

    public static async getInstance(): Promise<AuthController> {
        if (AuthController.instance === undefined) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    public async subscribe(props: UserProps): Promise<User> {
        const passwordHashed = await hash(props.password, 5);
        const user = this.userRepository.create({
            ...props,
            password: passwordHashed
        });
        await this.userRepository.save(user);
        return user;
    }

    public async getUserById(id: string): Promise<User> {
        return this.userRepository.findOneOrFail(id);
    }
}
