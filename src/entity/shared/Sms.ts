import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { IsNumber } from "class-validator";

@Entity()
export class Sms extends BaseEntity {

    constructor(mobileCountryCode: string, mobileNumber: number, message: string) {
        super()
        this.mobileCountryCode = mobileCountryCode
        this.mobileNumber = mobileNumber
        this.message = message
    }
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: 'text-local' })
    provider: string

    @Column()
    mobileCountryCode: string

    @Column("bigint")
    @IsNumber()
    mobileNumber: number

    @Column()
    message: string

    @Column()
    charge: number

    @Column()
    status: string
}