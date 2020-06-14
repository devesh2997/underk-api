import { Entity, Column, BaseEntity, Generated, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Length, IsEmail, IsInt, IsNotEmpty } from "class-validator";
import { IsGender } from "../../utils/custom-decorators/IsGender";

export interface SupplierJSON {
    id: number
    suid: string
    sku: string
    firstName: string
    lastName: string | undefined
    email: string
    mobileCountryCode: string
    mobileNumber: number
    dob: Date
    gender: string
    picUrl: string
    address: string
    created_at: Date
    updated_at: Date
}

@Entity()
export class Supplier extends BaseEntity {

    constructor(sku: string, firstName: string, lastName: string, email: string, mobileCountryCode: string, mobileNumber: number, dob: Date, gender: string, picUrl: string, address: string) {
        super()
        this.sku = sku
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.mobileCountryCode = mobileCountryCode
        this.mobileNumber = mobileNumber
        this.dob = dob
        this.gender = gender
        this.picUrl = picUrl
        this.address = address
    }

    @Generated("increment")
    @Column()
    id: number

    @PrimaryGeneratedColumn("uuid")
    suid: string

    @Column({ unique: true })
    @IsNotEmpty()
    sku: string

    @Column()
    @IsNotEmpty()
    @Length(1, 100)
    firstName: string

    @Column({ nullable: true })
    lastName: string

    get name(): string {
        return `${this.firstName} ${this.lastName}`
    }

    @Column("text")
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Column()
    @IsNotEmpty()
    mobileCountryCode: string

    @Column("bigint")
    @IsNotEmpty()
    @IsInt()
    mobileNumber: number

    @Column()
    @IsNotEmpty()
    dob: Date

    @Column({ default: 'N' })
    @IsNotEmpty()
    @IsGender()
    gender: string

    @Column("text", { nullable: true })
    picUrl: string

    @Column("text")
    @IsNotEmpty()
    address: string

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): SupplierJSON => {
        return {
            id: this.id,
            suid: this.suid,
            sku: this.sku,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            mobileCountryCode: this.mobileCountryCode,
            mobileNumber: this.mobileNumber,
            dob: this.dob,
            gender: this.gender,
            picUrl: this.picUrl,
            address: this.address,
            created_at: this.created_at,
            updated_at: this.updated_at,
        }
    }
}