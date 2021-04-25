import {User} from "./user.model";
import {Maintenance} from "./maintenance.model";
import {Treatment} from "./treatment.model";
import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Absence} from "./absence.model";

export enum EmployeeType {
    ADMIN = "ADMIN",
    VETERINARY = "VETERINARY",
    SELLER = "SELLER",
    RECEPTION = "RECEPTION",
    SERVICE_AGENT = "SERVICE_AGENT"
}

export interface EmployeeProps {
    firstname: string;
    lastname: string;
    type: EmployeeType;
    user: User;
}

@Entity()
export class Employee {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    firstname!: string;

    @Column({nullable: false})
    lastname!: string;

    @Column({
        type: "enum",
        enum: EmployeeType,
        nullable: false
    })
    type!: EmployeeType;

    @OneToOne(() => User, user => user.employee)
    @JoinColumn()
    user!: User;

    @OneToMany(() => Maintenance, maintenance => maintenance.employee)
    maintenances!: Maintenance[];

    @OneToMany(() => Treatment, treatment => treatment.employee)
    treatments!: Treatment[];

    @OneToMany(() => Absence, absence => absence.employee)
    absences!: Absence[];

}
