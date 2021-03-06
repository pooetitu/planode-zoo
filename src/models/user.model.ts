import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Employee} from "./employee.model";
import {Pass} from "./pass.model";

export interface UserProps {
    username: string;
    password: string;
    email: string;
}

@Entity()
export class User implements UserProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({unique: true, nullable: false})
    username!: string;

    @Column({nullable: false})
    password!: string;

    @Column({unique: true, nullable: false})
    email!: string;

    @OneToMany(() => Pass, pass => pass.user)
    passes!: Pass[];

    @OneToOne(() => Employee, employee => employee.user, {cascade: ["update", "soft-remove"], eager: true})
    employee!: Employee;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
