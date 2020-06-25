import { BaseEntity, Column, OneToMany, Entity, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Subtype } from "./Subtype";
import { OptionAttributeValue, OptionAttributeValueJSON } from "./OptionAttributeValue";
import { isNotEmpty, IsNotEmpty } from "class-validator";


export interface OptionAttributeJSON {
    id: number,
    name: string,
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
    @IsNotEmpty()
    name: string

    @OneToOne(() => Subtype, subtype => subtype.optionAttribute)
    @JoinColumn()
    subtype: Subtype

    @OneToMany(() => OptionAttributeValue, value => value.optionAttribute, { cascade: true })
    values: OptionAttributeValue[]

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): OptionAttributeJSON => {
        let values: OptionAttributeValueJSON[] = []
        if (isNotEmpty(this.values)) {
            values = this.values.map(v => v.toJSON())
        }
        return {
            id: this.id,
            name: this.name,
            values: values
        }
    }
}