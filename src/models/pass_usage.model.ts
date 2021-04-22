import {Pass} from "./pass.model";
import {AreaAccess} from "./area_access.model";
import {Column, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

export class PassUsage {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    useDate!: Date;

    @ManyToOne(() => Pass, pass => pass.passUsages)
    pass!: Pass;

    @OneToMany(() => AreaAccess, areaAccess => areaAccess.passUsage)
    areaAccesses!: AreaAccess[];
}
