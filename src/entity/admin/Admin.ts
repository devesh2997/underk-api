import { Entity, Column, Generated, PrimaryColumn, OneToOne, BaseEntity, JoinColumn } from "typeorm"
import { Employee, EmployeeJSON } from "./Employee"
import { MinLength } from "class-validator"
import { TE, TO } from "../../utils"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CONFIG from "../../config/config";

export interface AdminJSON {
    id: number
    auid: string
    alias: string
    employee: EmployeeJSON | undefined
}

@Entity()
export class Admin extends BaseEntity {
    @Generated('increment')
    id: number

    @PrimaryColumn({ type: "uuid" })
    @Generated("uuid")
    auid: string

    @Column()
    @MinLength(3)
    alias: string

    @OneToOne(() => Employee, emp => emp.admin)
    @JoinColumn()
    employee: Employee

    @Column()
    @MinLength(6)
    password: string

    comparePassword = async (pw: string): Promise<Admin> | never => {
        let err, pass
        if (!this.password) TE('password not set');

        [err, pass] = await TO(bcrypt.compare(pw, this.password))
        if (err) TE(err)

        if (!pass) TE('invalid password')

        return this
    }

    getJWT = (): string => {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return jwt.sign({ admin_id: this.id }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
    }

    toJSON = (): AdminJSON => {
        let emp = this.employee ? this.employee.toJSON() : undefined
        return {
            id: this.id,
            auid: this.auid,
            alias: this.alias,
            employee: emp
        }
    }


}