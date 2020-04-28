import { Column } from "typeorm";
import { IsInt } from "class-validator";

export class Mobile {
    @Column({ nullable: true })
    countryCode: string

    @Column({ nullable: true })
    @IsInt()
    number: number
}