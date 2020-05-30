import { Entity, Column, BaseEntity, Generated, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Length, IsEmail, IsInt, IsNotEmpty } from "class-validator";
import { ProductInventory } from "./ProductInventory";
import { IsGender } from "../../utils/custom-decorators/IsGender";

export interface SupplierJSON {
    id: number
    suid: string
    sku: string
    firstName: string
    middleName: string | undefined
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
    middleName: string

    @Column({ nullable: true })
    lastName: string

    get name(): string {
        return `${this.firstName} ${this.middleName} ${this.lastName}`
    }

    @Column("text")
    @IsEmail()
    email: string

    @Column()
    mobileCountryCode: string

    @Column()
    @IsInt()
    mobileNumber: number

    @Column()
    dob: Date

    @Column({ default: 'N' })
    @IsNotEmpty()
    @IsGender()
    gender: 'M' | 'F' | 'U' | 'N'

    @Column("text")
    picUrl: string

    @Column("text")
    address: string

    @OneToMany(() => ProductInventory, inventory => inventory.supplier)
    inventories: ProductInventory[]

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
            middleName: this.middleName,
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