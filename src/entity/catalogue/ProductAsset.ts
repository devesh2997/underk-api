import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { IsInt } from "class-validator";
import { Asset } from "../shared/Asset";

// @Entity()
// export class ProductAsset extends BaseEntity {
//     @PrimaryGeneratedColumn()
//     id: number

//     @Column()
//     @IsInt()
//     position: number

//     @Column()
//     originalPreferred: Asset

//     @Column()
//     originalBackup: Asset

//     @Column()
//     previewPreferred: Asset

//     @Column()
//     previewBackup: Asset

//     @Column()
//     thumbnailPreferred: Asset

//     @Column()
//     thumbnailBackup: Asset

//     @Column()
//     placeholderPreferred: Asset

//     @Column()
//     placeholderBackup: Asset


// }