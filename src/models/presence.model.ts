
import {Employee} from "./employee.model";
import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Presence{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    presenceDate!: Date;

    @ManyToOne(() => Employee, employee => employee.presences)
    employee!: Employee;
}
