import { BaseEntity, Generated, PrimaryColumn, Column, ManyToOne, OneToMany, Entity } from "typeorm";
import { Type } from "./Type";
import { Attribute } from "./Attribute";

@Entity()
export class Subtype extends BaseEntity {
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
}