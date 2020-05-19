import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn } from "typeorm";
import { isNotEmpty } from "class-validator";

@Entity()
export class Sms extends BaseEntity {

    constructor(numbers: string[], message: string, status: string, cost: number | undefined, errors: string[]) {
        super()
        this.numbers = numbers
        this.message = message
        this.status = status
        if (isNotEmpty(cost))
            this.cost = cost as number
        else
            this.cost = 0
        this.errors = errors
    }
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: 'text-local' })
    provider: string

    @Column("simple-array")
    numbers: string[]

    @Column()
    message: string

    @Column()
    cost: number

    @Column()
    status: string

    @Column("simple-array", { nullable: true })
    errors: string[]

    @CreateDateColumn()
    created_at: Date
}