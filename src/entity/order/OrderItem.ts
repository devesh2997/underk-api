import { Shipment } from './Shipment';
import { SKU } from './../inventory/SKU';
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import Order from "./Order";
import { IsNotEmpty } from "class-validator";

@Entity()
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(() => Order, order => order.items)
    @IsNotEmpty()
    order: Order

    @ManyToOne(() => Shipment, shipment => shipment.orderItems)
    shipment: Shipment

    @Column()
    @IsNotEmpty()
    pid: string

    @Column()
    @IsNotEmpty({ message: "Order Item title cannot be empty" })
    title: string

    //return period of the item after delivery in minutes.
    @Column()
    @IsNotEmpty()
    returnPeriod: number

    @ManyToOne(() => SKU, sku => sku.orderItems)
    @IsNotEmpty()
    sku: SKU

    @Column()
    @IsNotEmpty()
    quantity: number

    @Column()
    currency: string

    @Column()
    @IsNotEmpty()
    listPrice: number

    @Column()
    @IsNotEmpty()
    salePrice: number

    @Column()
    @IsNotEmpty()
    taxPercent: number

    @Column()
    @IsNotEmpty()
    isInclusiveTax: boolean


}