import { Entity, BaseEntity, Generated, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Warehouse extends BaseEntity {
    @Generated('increment')
    @Column()
    id: number

    @PrimaryColumn()
    code: string

    @Column()
    name: string


}