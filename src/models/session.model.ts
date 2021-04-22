import {User} from "./user.model";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Session{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    token!: string;

    @ManyToOne(()=> User, user => user.sessions)
    user!: User;
}
