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
import { Product } from "./Product";
import { IsBoolean } from "class-validator";

@Entity()
export class Wishlist extends BaseEntity {
    @Generated("increment")
    @Column()
    id: number;

    @PrimaryGeneratedColumn("uuid")
    wid: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[];

    @Column({ default: false })
    @IsBoolean()
    isPublic: boolean;
}
