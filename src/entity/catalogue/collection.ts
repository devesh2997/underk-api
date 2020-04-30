import { Entity, Column, Generated, PrimaryColumn, BaseEntity } from "typeorm"

export interface CollectionJSON {
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

    @Generated("increment")
    id: number;

    @PrimaryColumn()
    slug: string

    @Column()
    name: string;

    toJSON = (): CollectionJSON => {
        return {
            slug: this.slug,
            name: this.name
        }
    }

    static fromJson = (json: CollectionJSON): Collection => {
        return new Collection(json.slug, json.name)
    }
}