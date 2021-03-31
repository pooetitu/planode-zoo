import {ModelCtor} from "sequelize";
import {UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models/index.model";
import {PassInstance} from "../models/pass.model";

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

    // public async create(props: PassCreationProps): Promise<PassInstance | null> {
    //     return this.Pass.create({
    //         ...props,
    //     });
    // }

}
