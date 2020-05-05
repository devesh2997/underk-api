import { BaseEntity, Generated, PrimaryColumn, Column,  ManyToOne, Entity } from "typeorm";
import { Attribute } from "./Attribute";

@Entity()
export class AttributeValue extends BaseEntity {
    @Generated('increment')
    id: number

    @PrimaryColumn()
    sku: string

    @Column()
    name: string

    @ManyToOne(() => Attribute, attribute => attribute.values)
    attribute: Attribute

    @Column({ default: 'none' })
    valueType: string

    @Column({ nullable: true })
    value: string
}