import {ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Pass} from "./pass.model";
import {Area} from "./area.model";

export class PassAreas {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
    @ManyToOne(() => Pass, pass => pass.areas)
    pass!: Pass;
    @ManyToOne(() => Area, area => area.passes)
    area!: Area;

}
