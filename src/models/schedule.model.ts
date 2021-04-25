import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Area} from "./area.model";

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: true, type: "time"})
    openTime!: Date;

    @Column({nullable: true, type: "time"})
    closeTime!: Date;

    @ManyToOne(() => Area, area => area.schedules)
    area!: Area;
}
