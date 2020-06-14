import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { SKU } from "./SKU";
import { Warehouse } from "./Warehouse";

@Entity()
export class ProductInventory extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(()=>Warehouse, warehouse=>warehouse.productsInventory)
    warehouse: Warehouse

    @ManyToOne(()=>SKU, sku=>sku.inventories)
    sku: SKU

    @Column()
    stock: number

    @Column()
    reserved: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
    
}