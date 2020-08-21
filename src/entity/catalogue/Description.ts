import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";
import DescriptionAsset from "./DescriptionAsset";
import { IsValidDescriptionStyle } from "../../utils/custom-decorators/IsValidDescriptionStyle";
import { IsNotEmpty } from "class-validator";

@Entity()
export default class Description extends BaseEntity {

    constructor(order: number, style: string) {
        super()
        this.order = order
        this.style = style
    }

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    @IsNotEmpty()
    order: number

    @Column()
    @IsNotEmpty()
    @IsValidDescriptionStyle()
    style: string

    @Column({ nullable: true })
    heading: string

    @Column({ nullable: true })
    body: string

    @OneToMany(() => DescriptionAsset, asset => asset.description)
    assets: DescriptionAsset[]

    @Column({ nullable: true })
    linkButtonText: string

    @Column({ nullable: true })
    linkButtonHyperlink: string

    @Column({ nullable: true })
    primaryButtonText: string

    @Column({ nullable: true })
    primaryButtonHyperLink: string
}