import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { IsInt, IsNotEmpty } from "class-validator";
import { IsValidAssetType } from "../../utils/custom-decorators/IsValidAssetType";
import { IsValidContentType } from "../../utils/custom-decorators/IsValidContentType";
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
    @IsNotEmpty()
    downloadUrl: string

    @Column({ nullable: true })
    placeholderUrl: string

    @Column({ nullable: true })
    shortUrl: string

    @Column()
    @IsNotEmpty()
    @IsValidAssetType()
    assetType: string

    @Column()
    @IsValidContentType()
    @IsNotEmpty()
    contentType: string

    @ManyToOne(() => Product, product => product.assets)
    @IsNotEmpty()
    product: Product

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}