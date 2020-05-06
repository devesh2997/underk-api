import { Entity, ManyToOne, Column } from "typeorm"
import { Address } from "../shared/Address";
import { User } from "./User";
import { IsNotEmpty, IsInt } from "class-validator";

@Entity()
export class UserAddress extends Address {

    @Column()
    @IsNotEmpty()
    mobileCountryCode: string

    @Column()
    @IsInt()
    @IsNotEmpty()
    mobileNumber: number

    @ManyToOne(() => User, user => user.addresses)
    user: User
}