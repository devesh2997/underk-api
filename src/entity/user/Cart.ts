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
import { CartItem } from "./CartItem";

@Entity()
export class Cart extends BaseEntity {
    @Generated("increment")
    @Column()
    id: number;

    @PrimaryGeneratedColumn("uuid")
    cid: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @OneToMany(() => CartItem, (i) => i.cart)
    products: CartItem[];
}
