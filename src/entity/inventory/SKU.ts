import { Entity, Generated, Column, PrimaryColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { Product } from "../catalogue/Product";
import { ProductInventory } from "./ProductInventory";
import { Dimensions } from "../catalogue/Dimensions";
import { Price } from "../catalogue/Price";

@Entity()
export class SKU extends BaseEntity{
    @Column()
    @Generated('increment')
    id: number

    @PrimaryColumn()
    sku: string
    
    @OneToOne(() => Price, price => price.sku)
    @JoinColumn()
    price: Price

    @OneToOne(() => Dimensions)
    @JoinColumn()
    dimensions: Dimensions

    @ManyToOne(()=>Product, product=>product.skus)
    product: Product

    @OneToMany(()=>ProductInventory, inventory=>inventory.sku)
    inventory: ProductInventory[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
    
}