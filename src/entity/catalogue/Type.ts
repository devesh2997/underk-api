import { BaseEntity, Generated, PrimaryColumn, Column, OneToMany, Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Subtype, SubtypeJSON } from "./Subtype";
import { Product } from "./Product";
import { isNotEmpty, IsNotEmpty } from "class-validator";

export interface TypeJSON {
    id: number,
    sku: string,
    name: string,
    subtypes?: SubtypeJSON[]
}

@Entity()
export class Type extends BaseEntity {

    constructor(sku: string, name: string) {
        super()
        this.sku = sku
        this.name = name
    }

    @Column()
    @Generated("increment")
    id: number

    @PrimaryColumn()
    sku: string

    @Column({ unique: true })
    @IsNotEmpty()
    name: string

    @OneToMany(() => Subtype, subtype => subtype.type)
    subtypes: Subtype[];

    @OneToMany(() => Product, product => product.type)
    products: Product[]

    toJSON = (): TypeJSON => {
        let subtypes: SubtypeJSON[] = []
        if (isNotEmpty(this.subtypes)) {
            subtypes = this.subtypes.map(s => s.toJSON())
        }
        return {
            id: this.id,
            sku: this.sku,
            name: this.name,
            subtypes: subtypes
        }
    }

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}