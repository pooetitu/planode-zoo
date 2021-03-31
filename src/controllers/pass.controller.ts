import {ModelCtor} from "sequelize";
import {UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models/index.model";
import {PassCreationProps, PassInstance, passMap} from "../models/pass.model";

export class PassController {

    private static instance: PassController;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;
    Pass: ModelCtor<PassInstance>;

    private constructor(User: ModelCtor<UserInstance>, Session: ModelCtor<SessionInstance>, Pass: ModelCtor<PassInstance>) {
        this.User = User;
        this.Session = Session;
        this.Pass = Pass;
    }

    public static async getInstance(): Promise<PassController> {
        if (PassController.instance === undefined) {
            const {User, Session, Pass} = await SequelizeManager.getInstance();
            PassController.instance = new PassController(User, Session, Pass);
        }
        return PassController.instance;
    }

    public async getAllPass(): Promise<PassInstance[] | null> {
        return await this.Pass.findAll();
    }

    public async getPassById(id: string): Promise<PassInstance | null> {
        return await this.Pass.findOne({
            where: {
                id
            }
        });
    }

    public async createPass(props: PassCreationProps, user: UserInstance): Promise<PassInstance | null> {
        const endDate = new Date(props.startDate);
        endDate.setDate(props.startDate.getDate() + passMap[props.type])
        const pass = await this.Pass.create({
            ...props,
            endDate: new Date(endDate)
        });
        pass.setUser(user);
        return pass;
    }
}
