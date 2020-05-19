import { Entity, Column, OneToMany, Generated, PrimaryColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { UserAddress } from "./UserAddress"
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator"
import { IsGender } from "../../utils/custom-decorators/IsGender"
import CONFIG from "../../config/config"
import jwt from "jsonwebtoken";

export interface UserJSON {
    id: number,
    uuid: string,
    firstName: string,
    lastName: string,
    email: string,
    mobileCountryCode: string,
    mobileNumber: number,
    dob: number,
    gender: string,
    picUrl: string,
    emailVerified: boolean,
    mobileVerified: boolean
}

@Entity()
export class User extends BaseEntity{
    @Generated('increment')
    id: number

    @PrimaryColumn({ type: "uuid" })
    @Generated("uuid")
    uuid: string

    @Column({ nullable: true })
    firstName: string

    @Column({ nullable: true })
    lastName: string

    @Column({ unique: true, nullable: true })
    @IsEmail()
    email: string

    @Column({ nullable: true })
    mobileCountryCode: string

    @Column("bigint", { nullable: true })
    @IsNumber()
    mobileNumber: number

    @Column("bigint", { nullable: true })
    @IsNumber()
    dob: number

    @Column({ default: 'N' })
    @IsNotEmpty()
    @IsGender()
    gender: string

    @Column("text", { nullable: true })
    picUrl: string

    @Column({ default: false })
    emailVerified: boolean

    @Column({ default: false })
    mobileVerified: boolean

    @OneToMany(() => UserAddress, UserAddress => UserAddress.user)
    addresses: UserAddress[]

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    getJWT = (): string => {
        let expiration_time = parseInt(CONFIG.jwt_user_expiration);
        return jwt.sign({ uuid: this.uuid }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
    }

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
            mobileVerified: this.mobileVerified
        }
    }

}