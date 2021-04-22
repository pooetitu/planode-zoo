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

@Entity()
export class Animal{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    name!: string;

    @ManyToOne(() => Area, area => area.animals)
    area!: Area;

    @OneToMany(() => Treatment, treatment => treatment.animal)
    treatments!: Treatment;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
