import { BaseEntity, Column, ManyToOne, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { OptionAttribute } from "./OptionAttribute";
import { IsValidAttributeValueType } from "../../utils/custom-decorators/IsValidAttributeValueType";
import { IsNotEmpty } from "class-validator";

export interface OptionAttributeValueJSON {
    id: number,
    sku: string,
    name: string,
    order: number,
    valueType: string,
    value: string
}

@Entity()
@Unique(["optionAttribute", "sku"])
@Unique(["optionAttribute", "name"])
export class OptionAttributeValue extends BaseEntity {

    constructor(sku: string, name: string, order: number, valueType: string, value: string) {
        super()
        this.sku = sku
        this.name = name
        this.order = order
        this.valueType = valueType
        this.value = value
    }

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    @IsNotEmpty()
    sku: string

    @Column()
    @IsNotEmpty()
    name: string

    @Column()
    @IsNotEmpty()
    order: number

    @Column({ nullable: true })
    helpText: string

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
            order: this.order,
            valueType: this.valueType,
            value: this.value,
        }
    }
}