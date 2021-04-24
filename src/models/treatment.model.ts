import {Animal} from "./animal.model";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Employee} from "./employee.model";

export interface TreatmentProps {
    name: string;
    description: string;
}

@Entity()
export class Treatment {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    name!: string;

    @Column()
    description!: string;

    @ManyToOne(() => Animal, animal => animal.treatments)
    animal!: Animal;

    @ManyToOne(() => Employee, employee => employee.treatments)
    employee!: Employee;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
