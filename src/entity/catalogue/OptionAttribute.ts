import { BaseEntity, Column, ManyToOne, OneToMany, Entity, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Subtype, SubtypeJSON } from "./Subtype";
import { OptionAttributeValue, OptionAttributeValueJSON } from "./OptionAttributeValue";
import { IsLowercase, isNotEmpty } from "class-validator";


export interface OptionAttributeJSON {
    id: number,
    name: string,
    subtype: SubtypeJSON,
    values: OptionAttributeValueJSON[]
}


@Entity()
@Unique(["subtype", "name"])
export class OptionAttribute extends BaseEntity {

    constructor(name: string) {
        super()
        this.name = name
    }
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsLowercase()
    name: string

    @ManyToOne(() => Subtype, subtype => subtype.optionAttributes)
    subtype: Subtype

    @OneToMany(() => OptionAttributeValue, value => value.optionAttribute)
    values: OptionAttributeValue[]

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): OptionAttributeJSON => {
        let subtype: SubtypeJSON | undefined
        if (isNotEmpty(this.subtype)) {
            subtype = this.subtype.toJSON()
        }
        let values: OptionAttributeValueJSON[] | undefined
        if (isNotEmpty(this.values)) {
            values = this.values.map(v => v.toJSON())
        }
        return {
            id: this.id,
            name: this.name,
            subtype: this.subtype.toJSON(),
            values: this.values.map(v => v.toJSON())
        }
    }
}