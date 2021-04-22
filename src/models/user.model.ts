import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Session} from "./session.model";
import {Employee} from "./employee.model";
import {Pass} from "./pass.model";

@Entity()
export class User{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    username!: string;

    @Column({nullable: false})
    password!: string;

    @Column({nullable:false})
    email!: string;

    @OneToMany(() => Pass, pass => pass.user)
    passes!: Pass[];

    @OneToMany(() => Session, session => session.user, {cascade:["remove"]})
    sessions!: Session[];

    @OneToOne(()=> Employee, employee => employee.user,{cascade:["update", "soft-remove"]})
    employee!: Employee;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
