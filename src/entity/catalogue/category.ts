import { Entity, Tree, Column, TreeChildren, TreeParent, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Generated, PrimaryColumn, ManyToOne, OneToMany } from "typeorm"
import { Product } from "./Product"

export interface CategoryJSON {
    id: number,
    slug: string,
    sku: string,
    name: string,
    children: Category[],
    parent: Category,
    ancestors: Category[]
}

@Entity()
@Tree("materialized-path")
export class Category extends BaseEntity {

    constructor(slug: string, sku: string, name: string) {
        super()
        this.slug = slug
        this.sku = sku
        this.name = name
    }

    @Generated('increment')
    id: number;

    @PrimaryColumn({ unique: true })
    slug: string

    @Column({ unique: true })
    sku: string

    @Column()
    name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[]


    @TreeChildren()
    children: Category[];

    @TreeParent()
    parent: Category;

    ancestors: Category[]

    toJSON = (): CategoryJSON => {
        return {
            id: this.id,
            slug: this.slug,
            sku: this.sku,
            children: this.children,
            parent: this.parent,
            name: this.name,
            ancestors: this.ancestors
        }
    }

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}