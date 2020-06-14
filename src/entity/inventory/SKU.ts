import { Entity, Generated, Column, PrimaryColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity } from "typeorm";
import { Product } from "../catalogue/Product";
import { ProductInventory } from "./ProductInventory";

@Entity()
export class SKU extends BaseEntity{
    @Column()
    @Generated('increment')
    id: number

    @PrimaryColumn()
    sku: string

    @ManyToOne(()=>Product, product=>product.skus)
    product: Product

    @OneToMany(()=>ProductInventory, inventory=>inventory.sku)
    inventories: ProductInventory[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
    
}