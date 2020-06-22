import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Warehouse } from "./Warehouse";

@Entity()
export class PackagingInventory extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(()=>Warehouse, warehouse=>warehouse.productsInventory)
    warehouse: Warehouse

    @Column()
    stock: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}