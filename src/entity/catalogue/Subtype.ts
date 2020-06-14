import { BaseEntity, Column, ManyToOne, OneToMany, Entity, CreateDateColumn, UpdateDateColumn, Unique, PrimaryGeneratedColumn } from "typeorm";
import { Type, TypeJSON } from "./Type";
import { Attribute, AttributeJSON } from "./Attribute";
import { Product } from "./Product";
import { isNotEmpty } from "class-validator";

export interface SubtypeJSON {
    id: number,
    sku: string,
    name: string,
    type?: TypeJSON,
    attributes?: AttributeJSON[]
}

@Entity()
@Unique(["type", "sku"])
export class Subtype extends BaseEntity {

    constructor(sku: string, name: string) {
        super()
        this.sku = sku
        this.name = name
    }

    @PrimaryGeneratedColumn("increment")
    id: number

    @Column()
    sku: string

    @Column()
    name: string

    @ManyToOne(() => Type, type => type.subtypes)
    type: Type

    @OneToMany(() => Attribute, attribute => attribute.subtype)
    attributes: Attribute[]

    @OneToMany(() => Product, product => product.subtype)
    products: Product[]

    toJSON = (): SubtypeJSON => {
        let res: SubtypeJSON = {
            id: this.id,
            sku: this.sku,
            name: this.name,
        }
        let type: TypeJSON
        if (isNotEmpty(this.type)) {
            type = this.type.toJSON()
            res['type'] = type
        }
        let attributes: AttributeJSON[] = []
        if (isNotEmpty(this.attributes)) {
            attributes = this.attributes.map(a => a.toJSON())
            res['attributes'] = attributes
        }
        return res
    }

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}