import { Packaging } from './Packaging';
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Warehouse } from "./Warehouse";

@Entity()
export class PackagingInventory extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(() => Packaging, packaging => packaging.inventory)
    packaging: Packaging

    @ManyToOne(() => Warehouse, warehouse => warehouse.packagingInventory)
    warehouse: Warehouse

    @Column()
    stock: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}