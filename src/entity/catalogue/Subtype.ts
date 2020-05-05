import { BaseEntity, Generated, PrimaryColumn, Column, ManyToOne, OneToMany, Entity } from "typeorm";
import { Type, TypeJSON } from "./Type";
import { Attribute } from "./Attribute";

export interface SubtypeJSON {
    id: number,
    sku: string,
    name: string,
    type: TypeJSON
}

@Entity()
export class Subtype extends BaseEntity {

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

    @ManyToOne(() => Type, type => type.subtypes)
    type: Type

    @OneToMany(() => Attribute, attribute => attribute.subtype)
    attributes: Attribute[]

    toJSON = (): SubtypeJSON => {
        return {
            id: this.id,
            sku: this.sku,
            name: this.name,
            type: this.type.toJSON()
        }
    }
}