import {Pass} from "./pass.model";
import {AreaAccess} from "./area_access.model";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class PassUsage {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    useDate!: Date;

    @Column({nullable: true})
    leaveDate?: Date;

    @ManyToOne(() => Pass, pass => pass.passUsages)
    pass!: Pass;

    @OneToMany(() => AreaAccess, areaAccess => areaAccess.passUsage)
    areaAccesses!: AreaAccess[];
}
