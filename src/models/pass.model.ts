import {User} from "./user.model";
import {PassUsage} from "./pass_usage.model";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {PassAreas} from "./pass_areas.model";

export const passMap = {"DAILY": 0, "WEEK_END": 1, "YEARLY": 365, "ONCE_MONTHLY": 365, "NIGHT": 0};

export enum PassType {
    DAILY = "DAILY",
    WEEK_END = "WEEK_END",
    YEARLY = "YEARLY",
    ONCE_MONTHLY = "ONCE_MONTHLY",
    //TODO gestion du night
    NIGHT= "NIGHT"
}

export interface PassProps {
    isEscapeGame: boolean;
    startDate: Date;
    type: PassType;
    areaIds: string[];
}

@Entity()
export class Pass {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    isEscapeGame!: boolean;

    @Column({nullable: false})
    startDate!: Date;

    @Column({nullable: false})
    endDate!: Date;

    @Column({nullable: false, type: "enum", enum: PassType})
    type!: PassType;

    @OneToMany(() => PassAreas, passArea => passArea.pass)
    areas!: PassAreas[];

    @ManyToOne(()=> User, user => user.passes)
    user!: User;

    @OneToMany(()=> PassUsage, passUsage => passUsage.pass)
    passUsages!: PassUsage[];
}
