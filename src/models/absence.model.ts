import {Employee} from "./employee.model";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

export interface AbsenceProps{
    absenceDate: Date
}
@Entity()
export class Absence implements AbsenceProps{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    absenceDate!: Date;

    @ManyToOne(() => Employee, employee => employee.absences)
    employee!: Employee;
}
