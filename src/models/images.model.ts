import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Area} from "./area.model";

export interface ImagesProps {
    link: string;
}

@Entity()
export class Images implements ImagesProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    link!: string;

    @ManyToOne(() => Area, area => area.images)
    area!: Area;
}
