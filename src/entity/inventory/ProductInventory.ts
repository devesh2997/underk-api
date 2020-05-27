import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Supplier } from "../inventory/Supplier";

@Entity()
export class ProductInventory extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    pid: string

    @ManyToOne(()=>Supplier,supplier=>supplier.inventories)
    supplier: Supplier

    @Column()
    sku: string

    @Column()
    initialStock: number

    @Column()
    stock: number

    @Column()
    reserved: number

    @Column()
    costPricePerUnit: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}