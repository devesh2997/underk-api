import { Entity, BaseEntity, Generated, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Address, AddressJSON } from "../../entity/shared/Address";
import { ProductInventory } from "./ProductInventory";

export interface WarehouseJSON {
    id: number
    code: string
    name: string
    created_at: Date
    updated_at: Date
    address: AddressJSON
}

@Entity()
export class Warehouse extends BaseEntity {

    constructor(code: string, name: string) {
        super()
        this.code = code
        this.name = name
    }

    @Generated('increment')
    @Column()
    id: number

    @PrimaryColumn()
    @IsNotEmpty({ message: 'Warehouse code not provided' })
    code: string

    @Column({ unique: true })
    @IsNotEmpty({ message: 'Warehouse name nor provided' })
    name: string

    @OneToOne(_ => Address, { cascade: true })
    @JoinColumn()
    address: Address;

    @OneToMany(()=>ProductInventory, productInventory=>productInventory.warehouse)
    productsInventory: ProductInventory[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    toJSON = (): WarehouseJSON => {
        return {
            id: this.id,
            code: this.code,
            name: this.name,
            created_at: this.created_at,
            updated_at: this.updated_at,
            address: this.address.toJSON()
        }
    }

}