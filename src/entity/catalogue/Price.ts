import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { isValidCurrency } from "../../utils/custom-decorators/IsValidCurrency";
import { TE } from "../../utils";
import { Product } from "./Product";

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
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(()=>Product, product=>product.prices)
    product: Product

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
        if (!isValidCurrency(this.currency)) TE("Invalid currency")
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