import {
    BaseEntity,
    Entity,
    Generated,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { User } from "../../entity/user/User";
import { CartItem, CartItemJSON } from "./CartItem";
import { isNotEmpty } from "class-validator";

export interface CartJSON {
    cid: string;
    items: CartItemJSON[];
}

@Entity()
export class Cart extends BaseEntity {
    @Generated("increment")
    @Column()
    id: number;

    @PrimaryGeneratedColumn("uuid")
    cid: string;

    @OneToOne(() => User, { nullable: true })
    @JoinColumn()
    user: User;

    @OneToMany(() => CartItem, (it) => it.cart, { cascade: true })
    items: CartItem[];

    toJSON = (): CartJSON => {
        let items: CartItemJSON[] = [];
        if (isNotEmpty(this.items)) {
            items = this.items.map((it) => it.toJSON());
        }

        return {
            cid: this.cid,
            items,
        };
    };
}
