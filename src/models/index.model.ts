import {ModelCtor, Sequelize} from "sequelize";
import userCreator, {UserInstance} from "./user.model";
import sessionCreator, {SessionInstance} from "./session.model";
import employeeCreator, {EmployeeInstance} from "./employee.model";
import presenceCreator, {PresenceInstance} from "./presence.model";
import passCreator, {PassInstance} from "./pass.model";
import maintenanceCreator, {MaintenanceInstance} from "./maintenance.model";
import animalCreator, {AnimalInstance} from "./animal.model";
import areaCreator, {AreaInstance} from "./area.model";
import treatmentCreator, {TreatmentInstance} from "./treatment.model";
import areaAccessCreator, {AreaAccessInstance} from "./area_access.model";
import passUsageCreator, {PassUsageInstance} from "./pass_usage.model";
import {Dialect} from "sequelize/types/lib/sequelize";

export interface SequelizeManagerProps {
    sequelize: Sequelize;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;
    Employee: ModelCtor<EmployeeInstance>;
    Presence: ModelCtor<PresenceInstance>;
    Pass: ModelCtor<PassInstance>;
    Maintenance: ModelCtor<MaintenanceInstance>;
    Animal: ModelCtor<AnimalInstance>;
    Area: ModelCtor<AreaInstance>;
    Treatment: ModelCtor<TreatmentInstance>;
    PassUsage: ModelCtor<PassUsageInstance>;
    AreaAccess: ModelCtor<AreaAccessInstance>;
}

export class SequelizeManager implements SequelizeManagerProps {

    private static instance?: SequelizeManager

    sequelize: Sequelize;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;
    Employee: ModelCtor<EmployeeInstance>;
    Presence: ModelCtor<PresenceInstance>;
    Pass: ModelCtor<PassInstance>;
    Maintenance: ModelCtor<MaintenanceInstance>;
    Animal: ModelCtor<AnimalInstance>;
    Area: ModelCtor<AreaInstance>;
    Treatment: ModelCtor<TreatmentInstance>;
    PassUsage: ModelCtor<PassUsageInstance>;
    AreaAccess: ModelCtor<AreaAccessInstance>;

    private constructor(props: SequelizeManagerProps) {
        this.sequelize = props.sequelize;
        this.User = props.User;
        this.Session = props.Session;
        this.Employee = props.Employee;
        this.Presence = props.Presence;
        this.Pass = props.Pass;
        this.Maintenance = props.Maintenance;
        this.Animal = props.Animal;
        this.Area = props.Area;
        this.Treatment = props.Treatment;
        this.PassUsage = props.PassUsage;
        this.AreaAccess = props.AreaAccess;
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
            Presence: presenceCreator(sequelize),
            Pass: passCreator(sequelize),
            Maintenance: maintenanceCreator(sequelize),
            Animal: animalCreator(sequelize),
            Area: areaCreator(sequelize),
            Treatment: treatmentCreator(sequelize),
            PassUsage: passUsageCreator(sequelize),
            AreaAccess: areaAccessCreator(sequelize)
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
        props.User.hasMany(props.Pass);
        props.Pass.belongsTo(props.User);
        props.Maintenance.belongsTo(props.Employee);
        props.Maintenance.belongsTo(props.Area);
        props.Employee.hasMany(props.Maintenance);
        props.Area.hasMany(props.Maintenance);
        props.Area.hasMany(props.Animal);
        props.Animal.belongsTo(props.Area);
        props.Animal.hasMany(props.Treatment);
        props.Employee.hasMany(props.Treatment);
        props.Treatment.belongsTo(props.Animal);
        props.Treatment.belongsTo(props.Employee);
        props.Area.hasMany(props.AreaAccess);
        props.AreaAccess.belongsTo(props.Area);
        props.AreaAccess.belongsTo(props.PassUsage);
        props.Pass.hasMany(props.PassUsage);
        props.PassUsage.belongsTo(props.Pass);
    }
}
