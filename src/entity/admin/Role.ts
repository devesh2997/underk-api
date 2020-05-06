import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsUppercase } from "class-validator";
import { Policy } from "./Policy";

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    @IsUppercase()
    name: string

    @Column("text")
    description: string

    @OneToMany(() => Policy, policy => policy.role)
    policies: Policy[]
}