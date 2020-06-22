import { BaseEntity, Column, ManyToOne, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { SKUAttribute, SKUAttributeJSON } from "./SKUAttribute";

export interface SKUAttributeValueJSON {
    id: number,
    sku: string,
    name: string,
    skuAttribute: SKUAttributeJSON,
    valueType: string,
    value: string
}

@Entity()
@Unique(["skuAttribute", "sku"])
export class SKUAttributeValue extends BaseEntity {

    constructor(sku: string, name: string) {
        super()
        this.sku = sku
        this.name = name
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    sku: string

    @Column()
    name: string

    @ManyToOne(() => SKUAttribute, skuAttribute => skuAttribute.values)
    skuAttribute: SKUAttribute

    @Column({ default: 'none' })
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
            skuAttribute: this.skuAttribute.toJSON()
        }
    }
}