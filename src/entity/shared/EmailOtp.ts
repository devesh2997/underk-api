import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class EmailOtp extends BaseEntity {

    constructor(email: string, otp: string, expiry: Date) {
        super()
        this.email = email
        this.otp = otp
        this.expiry = expiry
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    otp: string

    @Column()
    expiry: Date

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}