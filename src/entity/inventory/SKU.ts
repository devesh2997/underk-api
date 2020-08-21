import { Entity, Generated, Column, PrimaryColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { Product } from "../catalogue/Product";
import { ProductInventory } from "./ProductInventory";
import { Dimensions } from "../catalogue/Dimensions";
import { Price } from "../catalogue/Price";
import { IsNotEmpty } from "class-validator";
import { OrderItem } from "../order/OrderItem";

@Entity()
export class SKU extends BaseEntity {
    constructor(sku: string) {
        super()
        this.sku = sku
    }
    @Column()
    @Generated('increment')
    id: number

    @PrimaryColumn()
    @IsNotEmpty()
    sku: string

    @OneToOne(() => Price, price => price.sku)
    @IsNotEmpty()
    @JoinColumn()
    price: Price

    @OneToOne(() => Dimensions)
    @IsNotEmpty()
    @JoinColumn()
    dimensions: Dimensions

    @ManyToOne(() => Product, product => product.skus)
    @IsNotEmpty()
    product: Product

    @OneToMany(() => OrderItem, orderItem => orderItem.sku)
    orderItems: OrderItem[]

    @OneToMany(() => ProductInventory, inventory => inventory.sku)
    inventory: ProductInventory[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}