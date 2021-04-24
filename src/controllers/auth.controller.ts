import {User, UserProps} from "../models/user.model";
import {Session} from "../models/session.model";
import {compare, hash} from "bcrypt";
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

    public async subscribe(props: UserProps):Promise<User> {
        const passwordHashed = await hash(props.password, 5);
        const user = this.userRepository.create({
            ...props,
            password: passwordHashed
        });
        await this.userRepository.save(user);
        return user;
    }

    public async login(username: string, password: string): Promise<Session | null> {
        const user = await this.userRepository.findOne({where: {username}});
        if (user === undefined) {
            return null;
        }
        const isSamePassword = await compare(password, user.password);
        if (!isSamePassword) {
            return null;
        }
        const token = await hash(Date.now() + username, 5);
        const session = this.sessionRepository.create({token});
        session.user = user;
        await this.sessionRepository.save(session);
        return session;
    }

    public async logout(token: string) {
        await this.sessionRepository.softDelete({token}).catch(err => console.log(err + "a"));
    }

    public async getSession(token: string): Promise<Session> {
        return this.sessionRepository.createQueryBuilder()
            .where("token = :token",{token})
            .leftJoinAndMapOne("Session.user", "Session.user", "User")
            .leftJoinAndMapOne("User.employee", "User.employee","Employee")
            .getOneOrFail();
    }

    public async getUserById(id: string): Promise<User> {
        return this.userRepository.findOneOrFail(id);
    }
}
