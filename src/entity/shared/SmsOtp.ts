import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean } from "class-validator";

@Entity()
export class SmsOtp extends BaseEntity {

    constructor(mobile: string, otp: string, expiry: Date, verified?: boolean) {
        super()
        this.mobile = mobile
        this.otp = otp
        this.expiry = expiry
        this.verified = !!verified
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    mobile: string

    @Column()
    otp: string

    @Column()
    expiry: Date

    @Column({ default: false })
    @IsBoolean()
    verified: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
