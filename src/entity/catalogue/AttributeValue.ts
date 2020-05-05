import { BaseEntity, Column, ManyToOne, Entity, Unique, PrimaryGeneratedColumn } from "typeorm";
import { Attribute, AttributeJSON } from "./Attribute";

export interface AttributeValueJSON {
    id: number,
    sku: string,
    name: string,
    attribute: AttributeJSON | undefined,
    valueType: string,
    value: string
}

@Entity()
@Unique(["attribute", "sku"])
export class AttributeValue extends BaseEntity {

    constructor(sku: string, name: string) {
        super()
        this.sku = sku
        this.name = name
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    sku: string

    @Column()
    name: string

    @ManyToOne(() => Attribute, attribute => attribute.values)
    attribute: Attribute

    @Column({ default: 'none' })
    valueType: string

    @Column({ nullable: true })
    value: string

    toJSON = (): AttributeValueJSON => {
        let attribute: AttributeJSON | undefined
        if(this.attribute){
            attribute = this.attribute.toJSON()
        }
        return {
            id: this.id,
            sku: this.sku,
            name: this.name,
            valueType: this.valueType,
            value: this.value,
            attribute: attribute
        }
    }
}