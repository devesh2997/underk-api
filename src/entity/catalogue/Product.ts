import { BaseEntity, Entity, Column, Generated, ManyToOne, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable, OneToOne, JoinColumn, } from "typeorm";
import { Type, TypeJSON } from "./Type";
import { Subtype, SubtypeJSON } from "./Subtype";
import { AttributeValue, AttributeValueJSON } from "./AttributeValue";
import { Category, CategoryJSON } from "./category";
import { Collection, CollectionJSON } from "./collection";
import { ProductAsset } from "./ProductAsset";
import { IsNotEmpty, isNotEmpty } from "class-validator";
import { IsValidProductStatus } from "../../utils/custom-decorators/IsValidProductStatus";
import { SKU } from "../../entity/inventory/SKU";
import { OptionAttributeValue } from "./OptionAttributeValue";
import { SKUAttributeValue } from "./SKUAttributeValue";
import { Price } from "./Price";
import { Dimensions } from "./Dimensions";

export interface ProductJSON {
    id: number,
    pid: string,
    slug: string,
    title: string,
    status: string,
    type: TypeJSON,
    subtype: SubtypeJSON,
    attributes: AttributeValueJSON[],
    category: CategoryJSON,
    collections: CollectionJSON[],
    variants: ProductJSON[]
}

@Entity()
export class Product extends BaseEntity {
    @Generated('increment')
    @Column()
    id: number

    @PrimaryGeneratedColumn('uuid')
    pid: string

    @Column({ unique: true, nullable: false })
    @IsNotEmpty()
    slug: string

    @Column()
    @IsNotEmpty()
    title: string

    @Column()
    @IsNotEmpty()
    @IsValidProductStatus()
    status: string

    @Column()
    baseSKU: string

    @OneToMany(() => ProductAsset, asset => asset.product)
    assets: ProductAsset[]

    @ManyToOne(() => Type, type => type.products)
    @IsNotEmpty()
    type: Type

    @ManyToOne(() => Subtype, subtype => subtype.products)
    @IsNotEmpty()
    subtype: Subtype

    @ManyToOne(() => Category, category => category.products)
    @IsNotEmpty()
    category: Category

    @ManyToMany(_ => Collection)
    @JoinTable()
    collections: Collection[]

    @OneToMany(() => SKU, sku => sku.product)
    skus: SKU[]

    @OneToMany(() => Price, price => price.product)
    prices: Price[]

    @OneToOne(() => Dimensions)
    @JoinColumn()
    dimensions: Dimensions

    @ManyToMany(() => AttributeValue)
    @JoinTable()
    attributes: AttributeValue[]

    @ManyToMany(() => SKUAttributeValue)
    @JoinTable()
    skuAttributes: SKUAttributeValue[]

    @ManyToMany(() => OptionAttributeValue)
    @JoinTable()
    optionAttributes: OptionAttributeValue[]

    @ManyToMany(() => Product)
    @JoinTable()
    variants: Product[]

    toJSON = (): ProductJSON => {
        let collections: CollectionJSON[] = []
        if (isNotEmpty(this.collections)) {
            collections = this.collections.map(c => c.toJSON())
        }
        let attributes: AttributeValueJSON[] = []
        if (isNotEmpty(this.attributes)) {
            attributes = this.attributes.map(a => a.toJSON())
        }
        let variants: ProductJSON[] = []
        if (isNotEmpty(this.variants)) {
            variants = this.variants.map(p => p.toJSON())
        }
        return {
            id: this.id,
            pid: this.pid,
            slug: this.slug,
            title: this.title,
            status: this.status,
            type: this.type.toJSON(),
            subtype: this.subtype.toJSON(),
            category: this.category.toJSON(),
            collections: collections,
            attributes: attributes,
            variants: variants
        }
    }

}