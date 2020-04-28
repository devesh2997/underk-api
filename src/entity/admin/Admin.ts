import { Entity, Column, Generated, PrimaryColumn, OneToOne } from "typeorm"
import { Employee } from "./Employee"

@Entity()
export class Admin {
    @Generated('increment')
    id: number

    @PrimaryColumn({ type: "uuid" })
    @Generated("uuid")
    auid: string

    @OneToOne(() => Employee)
    employee: Employee

    @Column()
    password: string


}