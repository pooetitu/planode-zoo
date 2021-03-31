import {ModelCtor} from "sequelize";
import {UserCreationProps, UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models";
import {compare, hash} from "bcrypt";
import {AreaInstance} from "../models/area.model";
import {AreaAccessInstance} from "../models/area_access.model";

export class AreaController {

    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;

    private static instance: AreaController;

    public static async getInstance(): Promise<AreaController> {
        if(AreaController.instance === undefined) {
            const {User, Session} = await SequelizeManager.getInstance();
            AreaController.instance = new AreaController(User, Session);
        }
        return AreaController.instance;
    }

    private constructor(User: ModelCtor<UserInstance>, Session: ModelCtor<SessionInstance>) {
        this.User = User;
        this.Session = Session;
    }



}
