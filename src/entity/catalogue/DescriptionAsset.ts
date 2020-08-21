import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, BaseEntity } from "typeorm";
import Description from "./Description";
import { IsNotEmpty } from "class-validator";

@Entity()
export default class DescriptionAsset extends BaseEntity {
    constructor(order: number, fullScreenImageUrl: string) {
        super()
        this.order = order
        this.fullScreenImageUrl = fullScreenImageUrl
    }
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ default: 0 })
    @IsNotEmpty()
    order: number

    @Column()
    @IsNotEmpty()
    fullScreenImageUrl: string

    @Column({ nullable: true })
    fullScreenImageWebpUrl: string

    @Column({ nullable: true })
    smallScreenImageUrl: string

    @Column({ nullable: true })
    smallScreenImageWebpUrl: string

    @ManyToMany(() => Description, description => description.assets)
    description: Description
}