import { UKoinTransaction } from './UKoinTransaction';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity()
export class UKoinBlock extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    @IsNotEmpty()
    koins: number;

    @Column()
    @IsNotEmpty()
    koinsLeft: number;

    @Column({ default: false })
    expired: boolean

    @OneToMany(() => UKoinTransaction, uKoinTransaction => uKoinTransaction.uKoinBlock)
    transactions: UKoinTransaction[]

    @Column()
    @IsNotEmpty()
    expiring_on: Date

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_on: Date

}