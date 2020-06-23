import { BaseEntity, Column, ManyToOne, OneToMany, Entity, CreateDateColumn, UpdateDateColumn, Unique, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./Type";
import { Attribute, AttributeJSON } from "./Attribute";
import { SKUAttribute, SKUAttributeJSON } from "./SKUAttribute";
import { Product } from "./Product";
import { isNotEmpty } from "class-validator";
import { OptionAttribute, OptionAttributeJSON } from "./OptionAttribute";

export interface SubtypeJSON {
    id: number,
    sku: string,
    name: string,
    attributes: AttributeJSON[],
    skuAttributes: SKUAttributeJSON[],
    optionAttributes: OptionAttributeJSON[]
}

@Entity()
@Unique(["type", "sku"])
export class Subtype extends BaseEntity {

    constructor(sku: string, name: string) {
        super()
        this.sku = sku
        this.name = name
    }

    @PrimaryGeneratedColumn("increment")
    id: number

    @Column()
    sku: string

    @Column()
    name: string

    @ManyToOne(() => Type, type => type.subtypes)
    type: Type

    @OneToMany(() => Attribute, attribute => attribute.subtype, { cascade: true })
    attributes: Attribute[]

    @OneToMany(() => SKUAttribute, skuAttribute => skuAttribute.subtype, { cascade: true })
    skuAttributes: SKUAttribute[]

    @OneToMany(() => OptionAttribute, optionAttribute => optionAttribute.subtype, { cascade: true })
    optionAttributes: OptionAttribute[]

    @OneToMany(() => Product, product => product.subtype)
    products: Product[]

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): SubtypeJSON => {
        let res: SubtypeJSON = {
            id: this.id,
            sku: this.sku,
            name: this.name,
            attributes: [],
            skuAttributes: [],
            optionAttributes: []
        }
        let attributes: AttributeJSON[] = []
        let skuAttributes: SKUAttributeJSON[] = []
        let optionAttributes: OptionAttributeJSON[] = []
        if (isNotEmpty(this.attributes)) {
            attributes = this.attributes.map(a => a.toJSON())
            res['attributes'] = attributes
        }
        if (isNotEmpty(this.skuAttributes)) {
            skuAttributes = this.skuAttributes.map(a => a.toJSON())
            res['skuAttributes'] = skuAttributes
        }
        if (isNotEmpty(this.optionAttributes)) {
            optionAttributes = this.optionAttributes.map(a => a.toJSON())
            res['optionAttributes'] = optionAttributes
        }
        return res
    }
}