import { BaseEntity, Generated, PrimaryColumn, Column, OneToMany, Entity } from "typeorm";
import { Subtype } from "./Subtype";

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
}