import { Entity, Column, Generated, PrimaryColumn, OneToOne, BaseEntity } from "typeorm"
import { Employee, EmployeeJSON } from "./Employee"

export interface AdminJSON {
    id: number
    auid: string
    password: string
    employee: EmployeeJSON | undefined
}

@Entity()
export class Admin extends BaseEntity{
    @Generated('increment')
    id: number

    @PrimaryColumn({ type: "uuid" })
    @Generated("uuid")
    auid: string

    @OneToOne(() => Employee)
    employee: Employee

    @Column()
    password: string

    toJSON(): AdminJSON {
        return {
            id: this.id,
            auid: this.auid,
            password: this.password,
            employee: this.employee.toJSON()
        }
    }


}