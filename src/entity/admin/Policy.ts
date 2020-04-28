import { PrimaryGeneratedColumn, Column } from "typeorm";
import { IsUppercase } from "class-validator";

export class Policy {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    @IsUppercase()
    name: string

    @Column("text")
    description: string
}