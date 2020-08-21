import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from "typeorm";
import Order from "./Order";
import { OrderItem } from "./OrderItem";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Shipment extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column()
    trackingId: string

    @ManyToOne(() => Order, order => order.shipments)
    @IsNotEmpty()
    order: Order

    @OneToMany(() => OrderItem, orderItem => orderItem.shipment)
    @IsNotEmpty()
    orderItems: OrderItem[]

}