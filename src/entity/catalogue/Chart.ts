import { Entity, BaseEntity, Column, PrimaryColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Chart extends BaseEntity {
    @PrimaryColumn()
    name: string

    @Column()
    @IsNotEmpty()
    displayName: string

    @Column()
    @IsNotEmpty()
    chartUrl: string
}