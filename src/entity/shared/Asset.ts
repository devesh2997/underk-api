import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Asset extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: number

    @Column()
    downloadUrl: string

    @Column({ nullable: true })
    shortUrl: string

    @Column({ nullable: true })
    videoThumbnailUrl: string

    @Column({ nullable: true })
    videoThumbnailShortUrl: string

    @Column()
    contentType: string

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

}