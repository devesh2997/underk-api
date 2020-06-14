import { Entity, BaseEntity, Column, Generated, PrimaryColumn } from "typeorm";

@Entity()
export class ProductOption extends BaseEntity {
    @Column()
    @Generated('increment')
    id: number

    @PrimaryColumn()
}