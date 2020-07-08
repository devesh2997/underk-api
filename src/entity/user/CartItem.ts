import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { SKU } from "../inventory/SKU";
import { Cart } from "./Cart";

export interface CartItemJSON {
    sku: SKU;
    quantity: number;
}

@Entity()
export class CartItem extends BaseEntity {
    constructor(sku: SKU, quantity: number) {
        super();

        this.sku = sku;
        this.quantity = quantity;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, (c) => c.items)
    cart: Cart;

    @ManyToOne(() => SKU)
    sku: SKU;

    @Column()
    quantity: number;

    toJSON = (): CartItemJSON => {
        return {
            sku: this.sku,
            quantity: this.quantity,
        };
    };
}
