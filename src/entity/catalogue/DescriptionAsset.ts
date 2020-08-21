import { CAE } from './../../utils/index';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import Description from "./Description";
import { IsNotEmpty, isEmpty } from "class-validator";
import ApiError from '../../core/errors';

export type DescriptionAssetJSON = {
    id?: number,
    order: number,
    heading?: string,
    body?: string,
    fullScreenImageUrl: string,
    smallScreenImageUrl?: string,
    fullScreenImageWebpUrl?: string,
    smallScreenImageWebpUrl?: string
}

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

    @Column({ nullable: true })
    heading?: string

    @Column({ nullable: true })
    body?: string

    @Column()
    @IsNotEmpty()
    fullScreenImageUrl: string

    @Column({ nullable: true })
    fullScreenImageWebpUrl?: string

    @Column({ nullable: true })
    smallScreenImageUrl?: string

    @Column({ nullable: true })
    smallScreenImageWebpUrl?: string

    @ManyToMany(() => Description, description => description.assets)
    description: Description

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): DescriptionAssetJSON => {
        return {
            id: this.id,
            order: this.order,
            heading: this.heading,
            body: this.body,
            fullScreenImageUrl: this.fullScreenImageUrl,
            fullScreenImageWebpUrl: this.fullScreenImageWebpUrl,
            smallScreenImageUrl: this.smallScreenImageUrl,
            smallScreenImageWebpUrl: this.smallScreenImageWebpUrl
        }
    }

    static fromJSON = (descriptionAssetJSON: DescriptionAssetJSON): DescriptionAsset | ApiError => {
        if (isEmpty(descriptionAssetJSON)) {
            return CAE("Description JSON provided is Empty");
        }
        if (isEmpty(descriptionAssetJSON.order)) {
            return CAE("Order not provided in Description JSON")
        }
        if (isEmpty(descriptionAssetJSON.fullScreenImageUrl)) {
            return CAE("Fullscreen Image url not provided in Description JSON")
        }
        const descriptionAsset = new DescriptionAsset(descriptionAssetJSON.order, descriptionAssetJSON.fullScreenImageUrl)

        if (typeof descriptionAssetJSON.id !== 'undefined') {
            descriptionAsset.id = descriptionAssetJSON.id
        }

        descriptionAsset.heading = descriptionAssetJSON.heading
        descriptionAsset.body = descriptionAssetJSON.body
        descriptionAsset.fullScreenImageWebpUrl = descriptionAssetJSON.fullScreenImageWebpUrl
        descriptionAsset.smallScreenImageUrl = descriptionAssetJSON.smallScreenImageUrl
        descriptionAsset.smallScreenImageWebpUrl = descriptionAssetJSON.smallScreenImageWebpUrl

        return descriptionAsset
    }
}