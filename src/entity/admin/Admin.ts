import {
    Entity,
    Column,
    Generated,
    PrimaryColumn,
    OneToOne,
    BaseEntity,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Employee, EmployeeJSON } from "./Employee";
import { MinLength, isNotEmpty } from "class-validator";
import { CAE, TOG } from "../../utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CONFIG from "../../config/config";
import { Policy, PolicyJSON } from "./Policy";
import { Role, RoleJSON } from "./Role";
import ApiError from "../../core/errors";

export interface AdminJSON {
    id: number;
    auid: string;
    alias: string;
    employee: EmployeeJSON | undefined;
    roles: RoleJSON[];
    policies: PolicyJSON[];
    created_at: Date;
    updated_at: Date;
}

@Entity()
export class Admin extends BaseEntity {
    @Generated("increment")
    @Column()
    id: number;

    @PrimaryColumn({ type: "uuid" })
    @Generated("uuid")
    auid: string;

    @Column({ unique: true })
    @MinLength(3)
    alias: string;

    @OneToOne(() => Employee, (emp) => emp.admin)
    @JoinColumn()
    employee: Employee;

    @Column()
    @MinLength(6)
    password: string;

    @ManyToMany((_) => Policy)
    @JoinTable()
    policies: Policy[];

    @ManyToMany((_) => Role)
    @JoinTable()
    roles: Role[];

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    comparePassword = async (pw: string): Promise<Admin | ApiError> => {
        if (!this.password) return CAE("password not set");

        let pass = await TOG<boolean>(bcrypt.compare(pw, this.password));
        if (pass instanceof ApiError) return pass;

        if (!pass) return CAE("invalid password");

        return this;
    };

    getJWT = (): string => {
        let expiration_time = CONFIG.jwt_admin_expiration;
        return jwt.sign({ auid: this.auid }, CONFIG.jwt_encryption, {
            expiresIn: expiration_time,
        });
    };

    toJSON = (): AdminJSON => {
        let emp = this.employee ? this.employee.toJSON() : undefined;
        let roles: RoleJSON[] = [];
        let policies: PolicyJSON[] = [];
        if (isNotEmpty(this.roles)) {
            this.roles.forEach((role) => roles.push(role.toJSON()));
        }
        if (isNotEmpty(this.policies)) {
            this.policies.forEach((policy) => policies.push(policy.toJSON()));
        }
        return {
            id: this.id,
            auid: this.auid,
            alias: this.alias,
            employee: emp,
            roles: roles,
            policies: policies,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    };
}
