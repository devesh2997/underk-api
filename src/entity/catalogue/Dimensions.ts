import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";


export interface DimensionsJSON {
    id: number
    length: number
    breadth: number
    height: number
    weight: number
}

@Entity()
export class Dimensions extends BaseEntity {
    constructor(length: number, breadth: number, height: number, weight: number) {
        super()
        this.length = length
        this.breadth = breadth
        this.height = height
        this.weight = weight
    }
    @PrimaryGeneratedColumn('increment')
    id: number

    //length in cms
    @Column()
    length: number

    //breadth in cms
    @Column()
    breadth: number

    //height in cms
    @Column()
    height: number

    //weight in gms
    @Column()
    weight: number

    toJSON = (): DimensionsJSON => {
        return {
            id: this.id,
            length: this.length,
            breadth: this.breadth,
            height: this.height,
            weight: this.weight

        }
    }
}