import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { IsInt } from "class-validator";
import { IsValidAssetType } from "../../utils/custom-decorators/IsValidAssetType";
import { IsValidContentType } from "../../utils/custom-decorators/IsValidContentType";
import { IsValidContentFormat } from "../../utils/custom-decorators/IsValidContentFormat";
import { Product } from "./Product";

@Entity()
export class ProductAsset extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsInt()
    position: number

    @Column()
    name: number

    @Column()
    downloadUrl: string

    @Column({ nullable: true })
    placeholderUrl: string

    @Column({ nullable: true })
    shortUrl: string

    @Column()
    @IsValidAssetType()
    assetType: string

    @Column()
    @IsValidContentType()
    contentType: string

    @Column()
    @IsValidContentFormat()
    contentFormat: string

    @ManyToOne(()=>Product,product=>product.assets)
    product: Product

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}