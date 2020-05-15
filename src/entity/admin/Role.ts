import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { IsUppercase, isNotEmpty } from "class-validator";
import { Policy, PolicyJSON } from "./Policy";

export interface RoleJSON {
    id: number
    name: string
    description: string
    policies: PolicyJSON[]
}

export interface RoleJSONWithPolicyStrings {
    id: number
    name: string
    description: string
    policies: string[]
}

@Entity()
export class Role extends BaseEntity {

    constructor(name: string, description: string) {
        super()
        this.name = name
        this.description = description
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    @IsUppercase()
    name: string

    @Column("text")
    description: string

    @ManyToMany(() => Policy)
    @JoinTable()
    policies: Policy[]

    toJSON = (): RoleJSON => {
        let policies: PolicyJSON[] = []
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            policies: policies
        }
    }

    toJSONWithPolicyNames = (): RoleJSONWithPolicyStrings => {
        let policies: string[] = []
        if (isNotEmpty(this.policies) && this.policies.length > 0)
            policies = this.policies.map(policy => policy.name)
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            policies: policies
        }
    }
}