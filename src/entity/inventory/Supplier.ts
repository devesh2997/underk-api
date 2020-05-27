import { Entity, Column, BaseEntity, Generated, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Length, IsEmail, IsInt } from "class-validator";
import { ProductInventory } from "./ProductInventory";

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

    @Column({ nullable: true })
    mobileCountryCode: string

    @Column({ nullable: true })
    @IsInt()
    mobileNumber: number

    @Column({ nullable: true })
    @IsInt()
    dob: number

    @Column({ default: 'N' })
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
}