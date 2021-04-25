import {Animal} from "./animal.model";
import {AreaAccess} from "./area_access.model";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {PassAreas} from "./pass_areas.model";
import {Maintenance} from "./maintenance.model";
import {Images} from "./images.model";
import {Schedule} from "./schedule.model";

export interface AreaProps {
    name: string;
    type: string;
    description: string;
    duration: number;
    openingTime: Date;
    disabledAccess: boolean;
    images?: Images[];
}

@Entity()
export class Area implements AreaProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    name!: string;

    @Column({nullable: false})
    type!: string;

    @Column({default: ""})
    description!: string;

    @Column({nullable: false})
    duration!: number;

    @Column({nullable: false, type: "time"})
    openingTime!: Date;

    @Column({default: false, type: "boolean"})
    disabledAccess!: boolean;

    @OneToMany(() => PassAreas, passArea => passArea.area, {cascade: true})
    passes!: PassAreas[];

    @OneToMany(() => Animal, animal => animal.area, {cascade: ["insert", "update"]})
    animals!: Animal[]

    @OneToMany(() => AreaAccess, areaAccess => areaAccess.area, {cascade: true})
    areaAccesses!: AreaAccess[];

    @OneToMany(() => Maintenance, maintenance => maintenance.area, {cascade: true})
    maintenances!: Maintenance[];

    @OneToMany(() => Images, images => images.area, {cascade:true, eager:true})
    images?: Images[];

    @OneToMany(() => Schedule, schedule => schedule.area, {cascade:true, eager:true})
    schedules!: Schedule[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
