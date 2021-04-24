import {PassUsage} from "./pass_usage.model";
import {Area} from "./area.model";
import {CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class AreaAccess {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Area, area => area.areaAccesses)
    area!: Area;

    @ManyToOne(() => PassUsage, passUsage => passUsage.areaAccesses)
    passUsage!: PassUsage;

    @DeleteDateColumn()
    deletedAt?: Date;
}
