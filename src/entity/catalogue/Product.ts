import { BaseEntity, Entity, Column, Generated, PrimaryColumn, ManyToOne, ManyToMany, OneToMany } from "typeorm";
import { Type } from "./Type";
import { Subtype } from "./Subtype";
import { AttributeValue } from "./AttributeValue";
import { Category } from "./category";
import { Collection } from "./collection";
import { ProductAsset } from "./ProductAsset";

@Entity()
export class Product extends BaseEntity {
    @Generated('increment')
    id: number

    @PrimaryColumn({ unique: true })
    slug: string

    @Column()
    title: string

    @Column()
    listPrice: number

    @Column()
    discount: number

    @Column()
    taxPercent: number

    @Column()
    isInclusiveTax: boolean

    @Column()
    isActive: boolean

    @Column()
    isAvailable: boolean

    @OneToMany(() => ProductAsset, asset => asset.product)
    assets: ProductAsset[]

    @ManyToOne(() => Type, type => type.products)
    type: Type

    @ManyToOne(() => Subtype, subtype => subtype.products)
    subtype: Subtype

    @ManyToOne(() => Category, category => category.products)
    category: Category

    @ManyToOne(() => Collection, collection => collection.products)
    collection: Collection

    @ManyToMany(() => AttributeValue, attributeValue => attributeValue.products)
    attributes: []




}