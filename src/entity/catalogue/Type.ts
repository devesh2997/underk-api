import { BaseEntity, Generated, PrimaryColumn, Column, OneToMany, Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Subtype } from "./Subtype";

export interface TypeJSON {
    id: number,
    sku: string,
    name: string
}

@Entity()
export class Type extends BaseEntity {

    constructor(sku: string, name: string) {
        super()
        this.sku = sku
        this.name = name
    }

    @Generated("increment")
    id: number

    @PrimaryColumn()
    sku: string

    @Column()
    name: string

    @OneToMany(() => Subtype, subtype => subtype.type)
    subtypes: Subtype[];

    toJSON = (): TypeJSON => {
        return {
            id: this.id,
            sku: this.sku,
            name: this.name
        }
    }

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}