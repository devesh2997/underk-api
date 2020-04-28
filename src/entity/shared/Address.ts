import { PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import { Mobile } from "./Mobile"

export abstract class Address extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    building: string

    @Column()
    locality: string

    @Column()
    landmark: string

    @Column()
    city: string

    @Column()
    state: string

    @Column()
    pincode: number

    @Column(()=>Mobile)
    mobile: Mobile

}