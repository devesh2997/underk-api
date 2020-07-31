import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn, OneToOne } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { isValidCurrency } from "../../utils/custom-decorators/IsValidCurrency";
import { SKU } from "../../entity/inventory/SKU";
import { CAE } from "../../utils";

export interface PriceJSON {
    id: number
    currency: string
    listPrice: number
    salePrice: number
    taxPercent: number
    isInclusiveTax: boolean
}

@Entity()
export class Price extends BaseEntity {
    constructor(currency: string, listPrice: number, salePrice: number, taxPercent: number, isInclusiveTax: boolean) {
        super()
        this.currency = currency
        this.listPrice = listPrice
        this.salePrice = salePrice
        this.taxPercent = taxPercent
        this.isInclusiveTax = isInclusiveTax
    }
    @PrimaryGeneratedColumn('increment')
    id: number

    @OneToOne(() => SKU, sku => sku.price)
    sku: SKU

    @Column()
    currency: string

    @Column()
    @IsNotEmpty()
    listPrice: number

    @Column()
    @IsNotEmpty()
    salePrice: number

    @Column()
    @IsNotEmpty()
    taxPercent: number

    @Column()
    @IsNotEmpty()
    isInclusiveTax: boolean

    @BeforeInsert()
    beforeInsert = () => {
        if (!isValidCurrency(this.currency)) CAE("Invalid currency")
    }

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    toJSON = (): PriceJSON => {
        return {
            id: this.id,
            currency: this.currency,
            listPrice: this.listPrice,
            salePrice: this.salePrice,
            taxPercent: this.taxPercent,
            isInclusiveTax: this.isInclusiveTax
        }
    }
}