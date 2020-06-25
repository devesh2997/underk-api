import { Entity, Tree, Column, TreeChildren, TreeParent, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm"
import { Product } from "./Product"

export interface CategoryJSON {
    id: number,
    slug: string,
    name: string,
    children: Category[],
    parent: Category,
    ancestors: Category[]
}

@Entity()
@Unique(["parent", "name"])
@Tree("materialized-path")
export class Category extends BaseEntity {

    constructor(slug: string, name: string) {
        super()
        this.slug = slug
        this.name = name
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    slug: string

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