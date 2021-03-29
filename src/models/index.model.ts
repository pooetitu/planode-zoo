import {ModelCtor, Sequelize} from "sequelize";
import userCreator, {UserInstance} from "./user.model";
import sessionCreator, {SessionInstance} from "./session.model";
import employeeCreator, {EmployeeInstance} from "./employee.model";
import presenceCreator, {PresenceInstance} from "./presence.model";
import {Dialect} from "sequelize/types/lib/sequelize";

export interface SequelizeManagerProps {
    sequelize: Sequelize;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;
    Employee: ModelCtor<EmployeeInstance>;
    Presence: ModelCtor<PresenceInstance>;
}

export class SequelizeManager implements SequelizeManagerProps {

    private static instance?: SequelizeManager

    sequelize: Sequelize;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;
    Employee: ModelCtor<EmployeeInstance>;
    Presence: ModelCtor<PresenceInstance>;

    private constructor(props: SequelizeManagerProps) {
        this.sequelize = props.sequelize;
        this.User = props.User;
        this.Session = props.Session;
        this.Employee = props.Employee;
        this.Presence = props.Presence;
    }

    public static async getInstance(): Promise<SequelizeManager> {
        if (SequelizeManager.instance === undefined) {
            SequelizeManager.instance = await SequelizeManager.initialize();
        }
        return SequelizeManager.instance;
    }

    private static async initialize(): Promise<SequelizeManager> {
        const sequelize = new Sequelize({
            dialect: process.env.DB_DRIVER as Dialect,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number.parseInt(process.env.DB_PORT as string)
        });
        await sequelize.authenticate();
        const managerProps: SequelizeManagerProps = {
            sequelize,
            User: userCreator(sequelize),
            Session: sessionCreator(sequelize),
            Employee: employeeCreator(sequelize),
            Presence: presenceCreator(sequelize)
        }
        SequelizeManager.associate(managerProps);
        await sequelize.sync();
        return new SequelizeManager(managerProps);
    }

    private static associate(props: SequelizeManagerProps): void {
        props.User.hasMany(props.Session);
        props.User.hasOne(props.Employee);
        props.Session.belongsTo(props.User);
        props.Employee.belongsTo(props.User);
        props.Employee.hasMany(props.Presence);
        props.Presence.belongsTo(props.Employee);
    }
}
