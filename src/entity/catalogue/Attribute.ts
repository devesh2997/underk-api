import { BaseEntity, Column, ManyToOne, OneToMany, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Subtype, SubtypeJSON } from "./Subtype";
import { AttributeValue } from "./AttributeValue";
import { IsLowercase, isNotEmpty } from "class-validator";


export interface AttributeJSON {
    id: number,
    name: string,
    subtype: SubtypeJSON | undefined,
    skuOrdering: number,
    variantsBasis: boolean
}


@Entity()
@Unique(["subtype", "name"])
export class Attribute extends BaseEntity {

    constructor(name: string) {
        super()
        this.name = name
    }
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsLowercase()
    name: string

    @ManyToOne(() => Subtype, subtype => subtype.attributes)
    subtype: Subtype

    @OneToMany(() => AttributeValue, value => value.attribute)
    values: AttributeValue[]

    @Column({ default: -1 })
    skuOrdering: number

    @Column("bool", { default: false })
    variantsBasis: boolean

    toJSON = (): AttributeJSON => {
        let subtype: SubtypeJSON | undefined
        if (isNotEmpty(this.subtype)) {
            subtype = this.subtype.toJSON()
        }
        return {
            id: this.id,
            name: this.name,
            subtype: subtype,
            skuOrdering: this.skuOrdering,
            variantsBasis: this.variantsBasis
        }
    }
}