import { Generated, Column,PrimaryColumn, Entity, BaseEntity } from "typeorm";
import { IsUppercase } from "class-validator";

export interface PolicyJSON {
    id?: number
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

    @Generated('increment')
    id: number

    @PrimaryColumn()
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