import { UKoinBlock } from './UKoinBlock';
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty } from 'class-validator';

@Entity()
export class UKoinTransaction extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(() => UKoinBlock, uKoinBlock => uKoinBlock.transactions)
    @IsNotEmpty()
    uKoinBlock: UKoinBlock

    @Column()
    @IsNotEmpty()
    amount: number

    @Column()
    @IsNotEmpty()
    reason: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}