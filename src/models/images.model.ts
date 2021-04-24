import {Column, PrimaryGeneratedColumn} from "typeorm";

export class Images {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    link!: string;
}
