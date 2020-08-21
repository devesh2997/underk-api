import { OrderItem } from './OrderItem';
import { Entity, BaseEntity, Generated, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Shipment } from './Shipment';

@Entity()
export default class Order extends BaseEntity {
    @Generated('increment')
    id: number

    @PrimaryColumn()
    @IsNotEmpty()
    oid: string

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    items: OrderItem[]

    @OneToMany(() => Shipment, shipment => shipment.order)
    shipments: Shipment[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}