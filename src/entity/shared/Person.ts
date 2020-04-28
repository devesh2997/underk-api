import { Column, BaseEntity } from "typeorm"
import { Mobile } from "./Mobile"
import { IsInt, Length, IsEmail, } from "class-validator"

export class Person extends BaseEntity {

    @Column()
    @Length(1, 100)
    firstName: string

    @Column({ nullable: true })
    lastName: string

    get name(): string {
        return `${this.firstName} ${this.lastName}`
    }

    @Column("text", { nullable: true })
    @IsEmail()
    email: string

    @Column(() => Mobile)
    mobile: string

    @Column({ nullable: true })
    @IsInt()
    dob: number

    @Column({ default: 'N' })
    gender: 'M' | 'F' | 'U' | 'N'

    @Column("text", { nullable: true })
    picUrl: string
}