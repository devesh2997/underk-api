import { Entity, Tree, Column, TreeChildren, TreeParent, Generated, PrimaryColumn, BaseEntity } from "typeorm"

export interface CategoryJSON {
    id: number,
    slug: string,
    sku: string,
    name: string,
    children: Category[],
    parent: Category,
}

@Entity()
@Tree("closure-table")
export class Category extends BaseEntity {

    constructor(slug: string, sku: string, name: string) {
        super()
        this.slug = slug
        this.sku = sku
        this.name = name
    }

    @Generated("increment")
    id: number;

    @PrimaryColumn()
    slug: string

    @Column({ unique: true })
    sku: string

    @Column()
    name: string;


    @TreeChildren()
    children: Category[];

    @TreeParent()
    parent: Category;

    toJSON = (): CategoryJSON => {
        return {
            id: this.id,
            slug: this.slug,
            sku: this.sku,
            children: this.children,
            parent: this.parent,
            name: this.name
        }
    }
}