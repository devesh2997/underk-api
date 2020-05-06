import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import { IsUppercase } from "class-validator";
import { Role } from "./Role";

@Entity()
export class Policy {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    @IsUppercase()
    name: string

    @Column("text")
    description: string

    @ManyToOne(()=>Role, role=>role.policies)
    role: Role
}