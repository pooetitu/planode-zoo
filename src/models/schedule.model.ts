import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Area} from "./area.model";

export interface ScheduleProps {
    openTime: string | Date;
    closeTime: string | Date;
}

@Entity()
export class Schedule implements ScheduleProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    openTime!: Date;

    @Column({nullable: false})
    closeTime!: Date;

    @ManyToOne(() => Area, area => area.schedules)
    area!: Area;
}
