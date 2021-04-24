import {Employee} from "./employee.model";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Absence {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    absenceDate!: Date;

    @ManyToOne(() => Employee, employee => employee.absences)
    employee!: Employee;
}
