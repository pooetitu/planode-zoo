import {ModelCtor} from "sequelize";
import {UserCreationProps, UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models/index.model";
import {compare, hash} from "bcrypt";

export class AuthController {

    private static instance: AuthController;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;

    private constructor(User: ModelCtor<UserInstance>, Session: ModelCtor<SessionInstance>) {
        this.User = User;
        this.Session = Session;
    }

    public static async getInstance(): Promise<AuthController> {
        if (AuthController.instance === undefined) {
            const {User, Session} = await SequelizeManager.getInstance();
            AuthController.instance = new AuthController(User, Session);
        }
        return AuthController.instance;
    }

    public async subscribe(props: UserCreationProps):
        Promise<UserInstance | null> {
        const passwordHashed = await hash(props.password, 5);
        return this.User.create({
            ...props,
            password: passwordHashed
        });
    }

    public async login(login: string, password: string): Promise<SessionInstance | null> {
        const user = await this.User.findOne({
            where: {
                login
            }
        });
        if (user === null) {
            return null;
        }
        const isSamePassword = await compare(password, user.password);
        if (!isSamePassword) {
            return null;
        }
        const token = await hash(Date.now() + login, 5);
        const session = await this.Session.create({
            token
        });
        await session.setUser(user);
        return session;
    }


    public async logout(token: string) {
        await this.Session.destroy({
            where: {
                token
            }
        });
    }

    public async getSession(token: string): Promise<SessionInstance | null> {
        return this.Session.findOne({
            where: {
                token
            }
        });
    }

    public async getUserById(id: number): Promise<UserInstance | null> {
        return this.User.findOne({
            include: [{
                model: this.Session,
                where: {
                    id
                }
            }]
        });
    }

    public async getUserByToken(token: string): Promise<UserInstance | null> {
        return this.User.findOne({
            include: [{
                model: this.Session,
                where: {
                    token
                }
            }]
        });
    }
}
