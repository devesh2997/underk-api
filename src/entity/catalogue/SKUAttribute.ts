import { BaseEntity, Column, ManyToOne, OneToMany, Entity, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Subtype, SubtypeJSON } from "./Subtype";
import { SKUAttributeValue, SKUAttributeValueJSON } from "./SKUAttributeValue";
import { IsLowercase, isNotEmpty, IsNotEmpty } from "class-validator";


export interface SKUAttributeJSON {
    id: number,
    name: string,
    subtype: SubtypeJSON,
    skuOrdering: number,
    variantsBasis: boolean,
    isFilterable: boolean,
    values: SKUAttributeValueJSON[]
}


@Entity()
@Unique(["subtype", "name"])
@Unique(["subtype", "skuOrdering"])
export class SKUAttribute extends BaseEntity {

    constructor(name: string, skuOrdering: number, variantsBasis: boolean, isFilterable: boolean) {
        super()
        this.name = name
        this.skuOrdering = skuOrdering
        this.variantsBasis = variantsBasis
        this.isFilterable = isFilterable
    }
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsLowercase()
    name: string

    @ManyToOne(() => Subtype, subtype => subtype.skuAttributes)
    @IsNotEmpty()
    subtype: Subtype

    @OneToMany(() => SKUAttributeValue, value => value.skuAttribute)
    values: SKUAttributeValue[]

    @Column()
    skuOrdering: number

    @Column("bool", { default: false })
    variantsBasis: boolean

    @Column("bool", { default: false })
    isFilterable: boolean

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): SKUAttributeJSON => {
        let values: SKUAttributeValueJSON[] = []
        if (isNotEmpty(this.values)) {
            values = this.values.map(v => v.toJSON())
        }
        return {
            id: this.id,
            name: this.name,
            subtype: this.subtype.toJSON(),
            skuOrdering: this.skuOrdering,
            variantsBasis: this.variantsBasis,
            isFilterable: this.isFilterable,
            values: values
        }
    }
}