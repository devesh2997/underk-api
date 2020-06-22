import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Dimensions } from "../../entity/catalogue/Dimensions";

@Entity()
export class Packaging extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    name: string

    @OneToOne(() => Dimensions)
    @JoinColumn()
    dimensions: Dimensions

}