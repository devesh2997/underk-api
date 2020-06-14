import { BaseEntity, Entity, Column, Generated, ManyToOne, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Type, TypeJSON } from "./Type";
import { Subtype, SubtypeJSON } from "./Subtype";
import { AttributeValue, AttributeValueJSON } from "./AttributeValue";
import { Category, CategoryJSON } from "./category";
import { Collection, CollectionJSON } from "./collection";
import { ProductAsset } from "./ProductAsset";
import { IsNotEmpty, isNotEmpty } from "class-validator";
import { IsValidProductStatus } from "../../utils/custom-decorators/IsValidProductStatus";
import { SKU } from "../../entity/inventory/SKU";

export interface ProductJSON {
    id: number,
    pid: string,
    slug: string,
    title: string,
    listPrice: number,
    discount: number,
    taxPercent: number,
    isInclusiveTax: boolean,
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
    listPrice: number

    @Column()
    @IsNotEmpty()
    discount: number

    @Column()
    @IsNotEmpty()
    taxPercent: number

    @Column()
    @IsNotEmpty()
    isInclusiveTax: boolean

    @Column()
    @IsNotEmpty()
    @IsValidProductStatus()
    status: string

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
            listPrice: this.listPrice,
            discount: this.discount,
            taxPercent: this.taxPercent,
            isInclusiveTax: this.isInclusiveTax,
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