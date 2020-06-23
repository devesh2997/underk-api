import { BaseEntity, Column, ManyToOne, Entity, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Attribute, } from "./Attribute";
import { IsValidAttributeValueType } from "../../utils/custom-decorators/IsValidAttributeValueType";

export interface AttributeValueJSON {
    id: number,
    name: string,
    valueType: string,
    value: string
}

@Entity()
@Unique(["attribute", "name"])
export class AttributeValue extends BaseEntity {

    constructor(name: string, valueType: string, value: string) {
        super()
        this.name = name
        this.valueType = valueType
        this.value = value
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(() => Attribute, attribute => attribute.values)
    attribute: Attribute

    @Column({ default: 'none' })
    @IsValidAttributeValueType()
    valueType: string

    @Column({ nullable: true })
    value: string

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): AttributeValueJSON => {
        return {
            id: this.id,
            name: this.name,
            valueType: this.valueType,
            value: this.value
        }
    }
}