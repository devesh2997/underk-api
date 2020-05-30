import { Entity, BaseEntity, Generated, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";

export interface WarehouseJSON {
    id: number
    code: string
    name: string
    created_at: Date
    updated_at: Date
}

@Entity()
export class Warehouse extends BaseEntity {

    constructor(code: string, name: string) {
        super()
        this.code = code
        this.name = name
    }

    @Generated('increment')
    @Column()
    id: number

    @PrimaryColumn()
    @IsNotEmpty({ message: 'Warehouse code not provided' })
    code: string

    @Column({ unique: true })
    @IsNotEmpty({ message: 'Warehouse name nor provided' })
    name: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    toJSON = (): WarehouseJSON => {
        return {
            id: this.id,
            code: this.code,
            name: this.name,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }

}