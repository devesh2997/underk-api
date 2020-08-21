import { BaseEntity, Column, ManyToOne, OneToMany, Entity, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Subtype } from "./Subtype";
import { AttributeValue, AttributeValueJSON } from "./AttributeValue";
import { isNotEmpty, IsNotEmpty } from "class-validator";


export interface AttributeJSON {
    id: number,
    name: string,
    isMultiValued: boolean,
    isCompulsory: boolean,
    isFilterable: boolean,
    isVisible: boolean,
    values: AttributeValueJSON[]
}

@Entity()
@Unique(["subtype", "name"])
export class Attribute extends BaseEntity {

    constructor(name: string, isMultiValued: boolean = false, isCompulsory: boolean = false, isFilterable: boolean = false, isVisible: boolean = false) {
        super()
        this.name = name
        this.isMultiValued = isMultiValued
        this.isCompulsory = isCompulsory
        this.isFilterable = isFilterable
        this.isVisible = isVisible
    }
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsNotEmpty()
    name: string

    @ManyToOne(() => Subtype, subtype => subtype.attributes)
    subtype: Subtype

    @OneToMany(() => AttributeValue, value => value.attribute, { cascade: true })
    values: AttributeValue[]

    @Column("bool", { default: false })
    @IsNotEmpty()
    isVisible: boolean

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
            isMultiValued: this.isMultiValued,
            isCompulsory: this.isCompulsory,
            isFilterable: this.isFilterable,
            isVisible: this.isVisible,
            values: values
        }
    }
}