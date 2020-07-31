import { Chart } from './Chart';
import { BaseEntity, Entity, Column, Generated, ManyToOne, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable, } from "typeorm";
import { Type, TypeJSON } from "./Type";
import { Subtype, SubtypeJSON } from "./Subtype";
import { AttributeValue, AttributeValueJSON } from "./AttributeValue";
import { Category, CategoryJSON } from "./category";
import { Collection, CollectionJSON } from "./collection";
import { ProductAsset } from "./ProductAsset";
import { IsNotEmpty, isNotEmpty } from "class-validator";
import { IsValidProductStatus } from "../../utils/custom-decorators/IsValidProductStatus";
import { SKU } from "../../entity/inventory/SKU";
import { OptionAttributeValue, OptionAttributeValueJSON } from "./OptionAttributeValue";
import { SKUAttributeValue, SKUAttributeValueJSON } from "./SKUAttributeValue";

export interface ProductJSON {
    id: number,
    pid: string,
    slug: string,
    title: string,
    status: string,
    type: TypeJSON,
    subtype: SubtypeJSON,
    attributes: AttributeValueJSON[],
    skuAttributes: SKUAttributeValueJSON[],
    optionAttributes: OptionAttributeValueJSON[],
    category: CategoryJSON,
    collections: CollectionJSON[],
    variants: ProductJSON[]
}

@Entity()
export class Product extends BaseEntity {

    constructor(title: string, slug: string, status: string, type: Type, subtype: Subtype, category: Category) {
        super()
        this.title = title
        this.slug = slug
        this.status = status
        this.type = type
        this.subtype = subtype
        this.category = category
    }
    @Generated('increment')
    @Column()
    id: number

    @PrimaryGeneratedColumn('uuid')
    pid: string

    @Column({ unique: true, nullable: false })
    @IsNotEmpty({ message: "Product slug cannot be empty" })
    slug: string

    @Column()
    @IsNotEmpty({ message: "Product title cannot be empty" })
    title: string

    @Column()
    @IsNotEmpty()
    @IsValidProductStatus({ message: "Invalid product status" })
    status: string

    //return period of the product after delivery in minutes.
    @Column()
    @IsNotEmpty()
    returnPeriod: number

    @Column({ nullable: true })
    chart: Chart

    @Column({ nullable: true })
    helpText: string

    @Column()
    @IsNotEmpty({ message: "Base SKU cannot be empty" })
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
        let skuAttributes: SKUAttributeValueJSON[] = []
        if (isNotEmpty(this.skuAttributes)) {
            skuAttributes = this.skuAttributes.map(a => a.toJSON())
        }
        let optionAttributes: OptionAttributeValueJSON[] = []
        if (isNotEmpty(this.optionAttributes)) {
            optionAttributes = this.optionAttributes.map(a => a.toJSON())
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
            skuAttributes: skuAttributes,
            optionAttributes: optionAttributes,
            variants: variants
        }
    }

}