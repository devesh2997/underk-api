import { Entity, Column, Generated, PrimaryColumn, OneToOne, BaseEntity, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm"
import { Employee, EmployeeJSON } from "./Employee"
import { MinLength, isNotEmpty } from "class-validator"
import { TE, TO } from "../../utils"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CONFIG from "../../config/config";
import { Policy, PolicyJSON } from "./Policy";
import { Role, RoleJSON, RoleJSONWithPolicyStrings } from "./Role";

export interface AdminJSON {
    id: number
    auid: string
    alias: string
    employee: EmployeeJSON | undefined,
    roles: RoleJSONWithPolicyStrings[],
    policies: string[]
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

    @ManyToMany(_ => Policy)
    @JoinTable()
    policies: Policy[];

    @ManyToMany(_ => Role)
    @JoinTable()
    roles: Role[];

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

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
        let roles: RoleJSONWithPolicyStrings[] = []
        let policies: string[] = []
        if (isNotEmpty(this.roles)) {
            this.roles.forEach(role => roles.push(role.toJSONWithPolicyNames()))
        }
        if (isNotEmpty(this.policies)) {
            this.policies.forEach(policy => policies.push(policy.name))
        }
        return {
            id: this.id,
            auid: this.auid,
            alias: this.alias,
            employee: emp,
            roles: roles,
            policies: policies
        }
    }

}