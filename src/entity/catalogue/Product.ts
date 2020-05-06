import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    


}