import { BaseEntity, Column, ManyToOne, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { OptionAttribute, OptionAttributeJSON } from "./OptionAttribute";

export interface OptionAttributeValueJSON {
    id: number,
    sku: string,
    name: string,
    optionAttribute: OptionAttributeJSON | undefined,
    valueType: string,
    value: string
}

@Entity()
@Unique(["optionAttribute", "sku"])
export class OptionAttributeValue extends BaseEntity {

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

    @ManyToOne(() => OptionAttribute, optionAttribute => optionAttribute.values)
    optionAttribute: OptionAttribute

    @Column({ default: 'none' })
    valueType: string

    @Column({ nullable: true })
    value: string

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): OptionAttributeValueJSON => {
        let optionAttribute: OptionAttributeJSON | undefined
        if (this.optionAttribute) {
            optionAttribute = this.optionAttribute.toJSON()
        }
        return {
            id: this.id,
            sku: this.sku,
            name: this.name,
            valueType: this.valueType,
            value: this.value,
            optionAttribute: optionAttribute
        }
    }
}