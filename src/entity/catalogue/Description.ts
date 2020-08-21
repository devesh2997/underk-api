import { CAE, VE } from './../../utils/index';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import DescriptionAsset, { DescriptionAssetJSON } from "./DescriptionAsset";
import { IsValidDescriptionStyle } from "../../utils/custom-decorators/IsValidDescriptionStyle";
import { IsNotEmpty, isEmpty } from "class-validator";
import ApiError from "../../core/errors";

export type DescriptionJSON = {
    id?: number,
    order: number,
    style: string,
    heading?: string,
    body?: string,
    assets: DescriptionAssetJSON[],
    linkButtonText?: string,
    linkButtonHyperlink?: string,
    primaryButtonText?: string,
    primaryButtonHyperlink?: string
}

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
    heading?: string

    @Column({ nullable: true })
    body?: string

    @OneToMany(() => DescriptionAsset, asset => asset.description)
    assets?: DescriptionAsset[]

    @Column({ nullable: true })
    linkButtonText?: string

    @Column({ nullable: true })
    linkButtonHyperlink?: string

    @Column({ nullable: true })
    primaryButtonText?: string

    @Column({ nullable: true })
    primaryButtonHyperlink?: string

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    toJSON = (): DescriptionJSON => {
        let assetsJSON: DescriptionAssetJSON[] = []
        if (this.assets) {
            assetsJSON = this.assets.map(a => a.toJSON())
        }
        return {
            id: this.id,
            order: this.order,
            style: this.style,
            heading: this.heading,
            body: this.body,
            assets: assetsJSON,
            linkButtonText: this.linkButtonText,
            linkButtonHyperlink: this.linkButtonHyperlink,
            primaryButtonText: this.primaryButtonText,
            primaryButtonHyperlink: this.primaryButtonHyperlink
        }
    }

    static fromJSON = async (descriptionJSON: DescriptionJSON): Promise<Description | ApiError> => {

        if (isEmpty(descriptionJSON)) {
            return CAE("Description json cannot be empty")
        }

        if (isEmpty(descriptionJSON.order)) {
            return CAE("Description order not provided")
        }

        if (isEmpty(descriptionJSON.style)) {
            return CAE("Description style not provided")
        }


        const description = new Description(descriptionJSON.order, descriptionJSON.style)

        let validationResult = await VE(description);
        if (validationResult instanceof ApiError) return validationResult


        if (typeof descriptionJSON.id !== 'undefined') {
            description.id = descriptionJSON.id
        }

        description.heading = descriptionJSON.heading
        description.body = descriptionJSON.body
        if (typeof descriptionJSON.assets !== 'undefined') {
            const assets: DescriptionAsset[] = []
            for (let i = 0; i < descriptionJSON.assets.length; i++) {
                const a = DescriptionAsset.fromJSON(descriptionJSON.assets[i])
                if (a instanceof ApiError) return a
                assets.push(a)
            }
            description.assets = assets
        }

        description.linkButtonText = descriptionJSON.linkButtonText
        description.linkButtonHyperlink = descriptionJSON.linkButtonHyperlink
        description.primaryButtonText = descriptionJSON.primaryButtonText
        description.primaryButtonHyperlink = descriptionJSON.primaryButtonHyperlink

        return description

    }
}