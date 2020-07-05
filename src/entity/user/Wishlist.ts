import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    Generated,
    Column,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { User } from "../../entity/user/User";
import { Product, ProductJSON } from "../catalogue/Product";
import { IsBoolean, isNotEmpty } from "class-validator";

export interface WishlistJSON {
    wid: string;
    products: string[] | ProductJSON[];
    isPublic: boolean;
}

@Entity()
export class Wishlist extends BaseEntity {
    @Generated("increment")
    @Column()
    id: number;

    @PrimaryGeneratedColumn("uuid")
    wid: string;

    @OneToOne(() => User, (user) => user.wishlist)
    @JoinColumn()
    user: User;

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[];

    @Column({ default: false })
    @IsBoolean()
    isPublic: boolean;

    toJSON = (): WishlistJSON => {
        let products: ProductJSON[] = [];
        if (isNotEmpty(this.products)) {
            products = this.products.map((p) => p.toJSON());
        }

        return {
            wid: this.wid,
            products,
            isPublic: this.isPublic,
        };
    };

    // static insertMockData = async () => {};
}
