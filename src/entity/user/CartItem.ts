import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { SKU } from "../inventory/SKU";
import { Cart } from "./Cart";

@Entity()
export class CartItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, (c) => c.products)
    cart: Cart;

    @ManyToOne(() => SKU)
    sku: SKU;

    @Column()
    quantity: number;
}
