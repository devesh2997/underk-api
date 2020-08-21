import { UKoinBlock } from './UKoinBlock';
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty } from 'class-validator';
import { IsValidUKoinTransactionType } from '../../utils/custom-decorators/IsValidUKoinTransactionType';

@Entity()
export class UKoinTransaction extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(() => UKoinBlock, uKoinBlock => uKoinBlock.transactions)
    @IsNotEmpty()
    uKoinBlock: UKoinBlock

    @Column()
    @IsValidUKoinTransactionType()
    type: string

    @Column()
    @IsNotEmpty()
    amount: number

    @Column()
    @IsNotEmpty()
    reason: string

    @Column()
    details: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}