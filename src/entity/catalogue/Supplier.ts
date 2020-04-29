import { Entity, Column, BaseEntity, Generated, PrimaryGeneratedColumn } from "typeorm";
import { Length, IsEmail, IsInt } from "class-validator";

@Entity()
export class Supplier extends BaseEntity {

    @Generated("increment")
    id: number

    @PrimaryGeneratedColumn("uuid")
    suid: string

    @Column({ unique: true })
    sku: string

    @Column()
    @Length(1, 100)
    firstName: string

    @Column({ nullable: true })
    lastName: string

    get name(): string {
        return `${this.firstName} ${this.lastName}`
    }

    @Column("text")
    @IsEmail()
    email: string

    @Column({ nullable: true })
    countryCode: string

    @Column({ nullable: true })
    @IsInt()
    number: number

    @Column({ nullable: true })
    @IsInt()
    dob: number

    @Column({ default: 'N' })
    gender: 'M' | 'F' | 'U' | 'N'

    @Column("text")
    picUrl: string

    @Column("text")
    address: string
}