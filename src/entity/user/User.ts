import { Entity, Column, OneToMany, Generated, PrimaryColumn } from "typeorm"
import { Person } from "../shared/Person"
import { UserAddress } from "./UserAddress"

@Entity()
export class User extends Person {
    @Generated('increment')
    id: number

    @PrimaryColumn({ type: "uuid" })
    @Generated("uuid")
    uuid: string

    @Column({ default: false })
    emailVerified: boolean

    @Column({ default: false })
    mobileVerified: boolean

    @OneToMany(() => UserAddress, UserAddress => UserAddress.user)
    addresses: UserAddress[]

}