import {ModelCtor} from "sequelize";
import {UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models/index.model";
import {AreaCreationProps, AreaInstance} from "../models/area.model";
import {AreaAccessInstance} from "../models/area_access.model";

export class AreaController {


    private static instance: AreaController;
    Area: ModelCtor<AreaInstance>;
    AreaAccess: ModelCtor<AreaAccessInstance>;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;

    private constructor(User: ModelCtor<UserInstance>, Session: ModelCtor<SessionInstance>, Area: ModelCtor<AreaInstance>, AreaAccess: ModelCtor<AreaAccessInstance>) {
        this.User = User;
        this.Session = Session;
        this.Area = Area;
        this.AreaAccess = AreaAccess;
    }

    public static async getInstance(): Promise<AreaController> {
        if (AreaController.instance === undefined) {
            const {User, Session, Area, AreaAccess} = await SequelizeManager.getInstance();
            AreaController.instance = new AreaController(User, Session, Area, AreaAccess);
        }
        return AreaController.instance;
    }

    public async createArea(props: AreaCreationProps): Promise<AreaInstance | null> {
        return await this.Area.create({
            ...props
        });
    }

    public async getAreaById(id: string): Promise<AreaInstance | null> {
        return await this.Area.findOne({
            where: {
                id
            }
        });
    }

    public async deleteAreaByName(name: string) {
        await this.Area.destroy({
            where: {
                name
            }
        });
    }

    public async deleteAreaById(id: string) {
        await this.Area.destroy({
            where: {
                id
            }
        })
    }
    public async updateAreaById(id: string, props:AreaCreationProps): Promise<boolean> {
        const area = await this.Area.findOne({
            where: {
                id
            }
        });
        if(area !== null){
           await area.update({
               ...props
           })
            return true;
        }
        else{
            return false;
        }
    }

    public async updateAreaByName(name: string, props:AreaCreationProps): Promise<boolean> {
        const area = await this.Area.findOne({
            where: {
                name
            }
        });
        if(area !== null){
            await area.update({
                ...props
            })
            return true;
        }
        else{
            return false;
        }
    }

}
