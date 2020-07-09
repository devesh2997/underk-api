import { PrimaryGeneratedColumn, Column, BaseEntity, Entity } from "typeorm"
import { IsNotEmpty } from "class-validator"
import { IsValidPincode } from "../../utils/custom-decorators/IsValidPinCode"

export interface AddressJSON {
    id: number
    building: string
    locality: string
    landmark: string
    city: string
    state: string
    pincode: number
}

interface AddressCreateInfo {
    building: string
    locality: string
    landmark: string
    city: string
    state: string
    pincode: number
}

@Entity()
export class Address extends BaseEntity {
    constructor(address: AddressCreateInfo) {
        super()
        if (typeof address !== 'undefined') {
            this.building = address.building
            this.locality = address.locality
            this.landmark = address.landmark
            this.city = address.city
            this.state = address.state
            this.pincode = address.pincode
        }

    }
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsNotEmpty()
    building: string

    @Column()
    @IsNotEmpty()
    locality: string

    @Column()
    @IsNotEmpty()
    landmark: string

    @Column()
    @IsNotEmpty()
    city: string

    @Column()
    @IsNotEmpty()
    state: string

    @Column()
    @IsNotEmpty()
    @IsValidPincode()
    pincode: number

    toJSON = (): AddressJSON => {
        return {
            id: this.id,
            building: this.building,
            locality: this.locality,
            landmark: this.landmark,
            city: this.city,
            state: this.state,
            pincode: this.pincode
        }
    }

}