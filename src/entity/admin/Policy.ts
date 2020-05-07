import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, BaseEntity } from "typeorm";
import { IsUppercase, IsNotEmpty } from "class-validator";
import { Role } from "./Role";

export interface PolicyJSON {
    id: number
    name: string
    description: string
}

@Entity()
export class Policy extends BaseEntity {

    constructor(name: string, description: string) {
        super()
        this.name = name
        this.description = description
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    @IsNotEmpty()
    @IsUppercase()
    name: string

    @Column("text")
    description: string

    toJSON = (): PolicyJSON => {
        return {
            id: this.id,
            name: this.name,
            description: this.description
        }
    }
}