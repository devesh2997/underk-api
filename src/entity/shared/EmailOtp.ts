import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean } from "class-validator";

@Entity()
export class EmailOtp extends BaseEntity {

    constructor(email: string, otp: string, expiry: Date, verified?: boolean) {
        super()
        this.email = email
        this.otp = otp
        this.expiry = expiry
        this.verified = !!verified
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

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
