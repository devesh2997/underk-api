import { BaseEntity, Column, ManyToOne, OneToMany, Entity, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Subtype, SubtypeJSON } from "./Subtype";
import { AttributeValue, AttributeValueJSON } from "./AttributeValue";
import { IsLowercase, isNotEmpty, IsNotEmpty } from "class-validator";


export interface AttributeJSON {
    id: number,
    name: string,
    subtype: SubtypeJSON,
    variantsBasis: boolean,
    isMultiValued: boolean,
    isCompulsory: boolean,
    isFilterable: boolean,
    values: AttributeValueJSON[]
}

@Entity()
@Unique(["subtype", "name"])
export class Attribute extends BaseEntity {

    constructor(name: string, variantsBasis: boolean, isMultiValued: boolean, isCompulsory: boolean, isFilterable: boolean) {
        super()
        this.name = name
        this.variantsBasis = variantsBasis
        this.isMultiValued = isMultiValued
        this.isCompulsory = isCompulsory
        this.isFilterable = isFilterable
    }
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsLowercase()
    @IsNotEmpty()
    name: string

    @ManyToOne(() => Subtype, subtype => subtype.attributes)
    subtype: Subtype

    @OneToMany(() => AttributeValue, value => value.attribute)
    values: AttributeValue[]

    @Column("bool", { default: false })
    @IsNotEmpty()
    variantsBasis: boolean

    @Column("bool", { default: false })
    @IsNotEmpty()
    isMultiValued: boolean

    @Column("bool", { default: false })
    @IsNotEmpty()
    isCompulsory: boolean

    @Column("bool", { default: false })
    @IsNotEmpty()
    isFilterable: boolean

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): AttributeJSON => {
        let values: AttributeValueJSON[] | undefined = []
        if (isNotEmpty(this.values)) {
            values = this.values.map(v => v.toJSON())
        }
        return {
            id: this.id,
            name: this.name,
            subtype: this.subtype.toJSON(),
            variantsBasis: this.variantsBasis,
            isMultiValued: this.isMultiValued,
            isCompulsory: this.isCompulsory,
            isFilterable: this.isFilterable,
            values: values
        }
    }
}