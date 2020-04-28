import { Entity, ManyToOne } from "typeorm"
import { Address } from "../shared/Address";
import { User } from "./User";

@Entity()
export class UserAddress extends Address {
    @ManyToOne(() => User, user => user.addresses)
    user: User
}