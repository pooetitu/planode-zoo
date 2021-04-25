import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Pass} from "./pass.model";
import {Area} from "./area.model";

export interface PassAreasProps {
    pass: Pass;
    area: Area;
    order: number;
}

@Entity()
export class PassAreas implements PassAreasProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Pass, pass => pass.areas)
    pass!: Pass;

    @ManyToOne(() => Area, area => area.passes)
    area!: Area;

    @Column()
    order!: number;
}
