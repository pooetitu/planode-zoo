import {Animal} from "./animal.model";
import {AreaAccess} from "./area_access.model";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import {PassAreas} from "./pass_areas.model";
import {Maintenance} from "./maintenance.model";

@Entity()
export class Area {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    name!: string;

    @Column({nullable:false})
    type!: string;

    @Column({type:"multilinestring"})
    description!: string;

    @Column({nullable: false})
    duration!: number;

    @Column({nullable: false, type:"time"})
    openingTime!: Timestamp;

    @Column({default: false, type:"boolean"})
    disabledAccess!: boolean;

    @OneToMany(() => PassAreas, passArea => passArea.area)
    passes!: PassAreas[];

    @OneToMany(() => Animal, animal=> animal.area)
    animals!: Animal[]

    @OneToMany(() => AreaAccess, areaAccess => areaAccess.area)
    areaAccesses!: AreaAccess[];

    @OneToMany(() => Maintenance, maintenance => maintenance.area)
    maintenances!: Maintenance[];
}
