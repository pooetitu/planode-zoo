import {PassUsage} from "./pass_usage.model";
import {Area} from "./area.model";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
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
