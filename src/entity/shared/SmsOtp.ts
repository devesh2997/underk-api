import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class SmsOtp extends BaseEntity {

    constructor(mobile: string, otp: string, expiry: Date) {
        super()
        this.mobile = mobile
        this.otp = otp
        this.expiry = expiry
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    mobile: string

    @Column()
    otp: string

    @Column()
    expiry: Date

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}