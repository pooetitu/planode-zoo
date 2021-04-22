import {PassUsage} from "./pass_usage.model";
import {Area} from "./area.model";
import {Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

export class AreaAccess {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    useDate!: Date;

    @ManyToOne(()=> Area, area => area.areaAccesses)
    area!: Area;

    @ManyToOne(()=> PassUsage, passUsage => passUsage.areaAccesses)
    passUsage!: PassUsage;
}
