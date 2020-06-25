import { BaseEntity, Column, ManyToOne, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { OptionAttribute } from "./OptionAttribute";
import { IsValidAttributeValueType } from "../../utils/custom-decorators/IsValidAttributeValueType";

export interface OptionAttributeValueJSON {
    id: number,
    sku: string,
    name: string,
    valueType: string,
    value: string
}

@Entity()
@Unique(["optionAttribute", "sku"])
@Unique(["optionAttribute", "name"])
export class OptionAttributeValue extends BaseEntity {

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

    @ManyToOne(() => OptionAttribute, optionAttribute => optionAttribute.values)
    optionAttribute: OptionAttribute

    @Column({ default: 'none' })
    @IsValidAttributeValueType()
    valueType: string

    @Column({ nullable: true })
    value: string

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): OptionAttributeValueJSON => {
        return {
            id: this.id,
            sku: this.sku,
            name: this.name,
            valueType: this.valueType,
            value: this.value,
        }
    }
}