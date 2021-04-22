import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Treatment} from "./treatment.model";
import {Area} from "./area.model";

export interface AnimalProps {
    name:string;
}

@Entity()
export class Animal implements AnimalProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    name!: string;

    @ManyToOne(() => Area, area => area.animals, {cascade:["insert", "update"]})
    area!: Area;

    @OneToMany(() => Treatment, treatment => treatment.animal, {cascade: true})
    treatments!: Treatment;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
