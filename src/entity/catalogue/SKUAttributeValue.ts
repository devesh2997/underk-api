import { BaseEntity, Column, ManyToOne, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { SKUAttribute } from "./SKUAttribute";
import { IsValidAttributeValueType } from "../../utils/custom-decorators/IsValidAttributeValueType";

export interface SKUAttributeValueJSON {
    id: number,
    sku: string,
    name: string,
    valueType: string,
    value: string
}

@Entity()
@Unique(["skuAttribute", "sku"])
@Unique(["skuAttribute", "name"])
export class SKUAttributeValue extends BaseEntity {

    constructor(sku: string, name: string, valueType: string, value: string) {
        super()
        this.sku = sku
        this.name = name
        this.valueType = valueType
        this.value = value
    }

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ nullable: true })
    sku: string

    @Column()
    name: string

    @ManyToOne(() => SKUAttribute, skuAttribute => skuAttribute.values)
    skuAttribute: SKUAttribute

    @Column({ default: 'none' })
    @IsValidAttributeValueType()
    valueType: string

    @Column({ nullable: true })
    value: string

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): SKUAttributeValueJSON => {
        return {
            id: this.id,
            sku: this.sku,
            name: this.name,
            valueType: this.valueType,
            value: this.value,
        }
    }
}