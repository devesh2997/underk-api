import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Product } from "./Product";

export interface CollectionJSON {
    id: number,
    slug: string,
    name: string,
}

@Entity()
export class Collection extends BaseEntity {

    constructor(slug: string, name: string) {
        super()
        this.slug = slug
        this.name = name
    }

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ unique: true })
    slug: string

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[]

    toJSON = (): CollectionJSON => {
        return {
            id: this.id,
            slug: this.slug,
            name: this.name
        }
    }

    static fromJson = (json: CollectionJSON): Collection => {
        return new Collection(json.slug, json.name)
    }

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}