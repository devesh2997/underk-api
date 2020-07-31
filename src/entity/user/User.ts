import {
    Entity,
    Column,
    OneToMany,
    Generated,
    PrimaryColumn,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
} from "typeorm";
import { UserAddress } from "./UserAddress";
import {
    IsEmail,
    IsNumber,
    IsBoolean,
    MinLength,
} from "class-validator";
import CONFIG from "../../config/config";
import jwt from "jsonwebtoken";
import { CAE, TOG } from "../../utils";
import bcrypt from "bcryptjs";
import { Wishlist } from "./Wishlist";
import { Cart } from "./Cart";
import ApiError from "../../core/errors";

export interface UserJSON {
    id: number;
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileCountryCode: string;
    mobileNumber: number;
    dob: Date;
    gender: string;
    picUrl: string;
    emailVerified: boolean;
    mobileVerified: boolean;
    created_at: Date;
    updated_at: Date;
}

@Entity()
export class User extends BaseEntity {
    @Column()
    @Generated("increment")
    id: number;

    @PrimaryColumn({ type: "uuid" })
    @Generated("uuid")
    uuid: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column()
    @MinLength(6)
    password: string;

    @Column({ unique: true, nullable: true })
    @IsEmail()
    email: string;

    @Column({ nullable: true })
    mobileCountryCode: string;

    @Column("bigint", { nullable: true })
    @IsNumber()
    mobileNumber: number;

    @Column({ nullable: true })
    // @IsDate()
    dob: Date;

    @Column({ default: "N" })
    // @IsNotEmpty()
    // @IsGender()
    gender: string;

    @Column("text", { nullable: true })
    picUrl: string;

    @Column({ default: false })
    @IsBoolean()
    emailVerified: boolean;

    @Column({ default: false })
    @IsBoolean()
    mobileVerified: boolean;

    @OneToMany(() => UserAddress, (UserAddress) => UserAddress.user)
    addresses: UserAddress[];

    @OneToOne(() => Wishlist, (wishlist) => wishlist.user)
    wishlist: Wishlist;

    @OneToOne(() => Cart, (cart) => cart.user)
    cart: Cart;

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    comparePassword = async (pw: string): Promise<User | ApiError> => {
        if (!this.password) return CAE("password not set");

        let pass = await TOG<boolean>(bcrypt.compare(pw, this.password));
        if (pass instanceof ApiError) return pass;

        if (!pass) return CAE("invalid password");

        return this;
    };

    getJWT = (): string => {
        let expiration_time = parseInt(CONFIG.jwt_user_expiration);
        return jwt.sign({ uuid: this.uuid }, CONFIG.jwt_encryption, {
            expiresIn: expiration_time,
        });
    };

    toJSON = (): UserJSON => {
        return {
            id: this.id,
            uuid: this.uuid,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            mobileCountryCode: this.mobileCountryCode,
            mobileNumber: this.mobileNumber,
            dob: this.dob,
            gender: this.gender,
            picUrl: this.picUrl,
            emailVerified: this.emailVerified,
            mobileVerified: this.mobileVerified,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    };

    static insertMockData = async () => {
        let users = await TOG<User[]>(User.find());
        if (users instanceof ApiError) {
            console.log(users);
            return;
        }
        if (users.length > 0) {
            return;
        }

        let user = new User();
        let result = await TOG<User>(user.save());
        if (result instanceof ApiError) {
            console.log(result);
        }
    };
}
