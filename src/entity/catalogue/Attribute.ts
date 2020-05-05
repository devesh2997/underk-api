import { BaseEntity, Generated, Column, ManyToOne, OneToMany, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Subtype } from "./Subtype";
import { AttributeValue } from "./AttributeValue";

@Entity()
export class Attribute extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(() => Subtype, subtype => subtype.attributes)
    subtype: Subtype

    @OneToMany(() => AttributeValue, value => value.attribute)
    values: AttributeValue[]

    @Column({ default: -1 })
    skuOrdering: number

    @Column("bool", { default: false })
    variantsBasis: boolean
}