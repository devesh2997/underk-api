import { PackagingInventory } from './PackagingInventory';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Dimensions } from "../../entity/catalogue/Dimensions";

@Entity()
export class Packaging extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    name: string

    @Column({ nullable: true })
    description: string

    @OneToOne(() => Dimensions)
    @JoinColumn()
    dimensions: Dimensions

    @OneToMany(() => PackagingInventory, inventory => inventory.packaging)
    inventory: PackagingInventory[]

}