import {Employee} from "./employee.model";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Area} from "./area.model";

@Entity()
export class Maintenance{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    maintenanceDate!: Date;

    @ManyToOne(()=> Employee, employee => employee.maintenances)
    employee!: Employee;

    @ManyToOne(()=> Area, area => area.maintenances)
    area!: Area;
}
