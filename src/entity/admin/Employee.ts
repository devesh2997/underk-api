import { Entity, Generated, PrimaryColumn, OneToOne, Column, BaseEntity } from "typeorm";
import { Admin } from "./Admin";
import { Length, IsEmail, IsInt, IsNotEmpty } from "class-validator";

export interface EmployeeJSON {

    euid: string
    firstName: string
    lastName: string
    email: string
    mobileCountryCode: string
    mobileNumber: number
    dob: number
    gender: 'M' | 'F' | 'U' | 'N'
    picUrl: string
    mobileVerified: boolean,
    emailVerified: boolean,
    address: string

}

@Entity()
export class Employee extends BaseEntity {

    constructor(firstName: string, lastName: string, email: string, mobileCountryCode: string, mobileNumber: number, dob: number, gender: 'M' | 'F' | 'U' | 'N', picUrl: string, address: string) {
        super()
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.mobileCountryCode = mobileCountryCode
        this.mobileNumber = mobileNumber
        this.dob = dob
        this.gender = gender
        this.picUrl = picUrl
        this.address = address
    }

    toJSON(): EmployeeJSON {
        return {
            euid: this.euid,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            mobileCountryCode: this.mobileCountryCode,
            mobileNumber: this.mobileNumber,
            dob: this.dob,
            gender: this.gender,
            picUrl: this.picUrl,
            mobileVerified: this.mobileVerified,
            emailVerified: this.emailVerified,
            address: this.address
        }
    }

    static fromJson(json: EmployeeJSON): Employee {
        return new Employee(json.firstName, json.lastName, json.email, json.mobileCountryCode, json.mobileNumber, json.dob, json.gender, json.picUrl, json.address)
    }

    @Generated("increment")
    id: number

    @PrimaryColumn({ type: "uuid" })
    @Generated("uuid")
    euid: string

    @OneToOne(() => Admin, adm => adm.employee)
    admin: Admin

    @Column()
    @Length(1, 100)
    @IsNotEmpty()
    firstName: string

    @Column({ nullable: true })
    lastName: string

    get name(): string {
        return `${this.firstName} ${this.lastName}`
    }

    @Column({ unique: true })
    @IsEmail()
    @IsNotEmpty({ message: "Email not provided." })
    email: string

    @Column()
    @IsNotEmpty()
    mobileCountryCode: string

    @Column({ default: false })
    emailVerified: boolean

    @Column({ default: false })
    mobileVerified: boolean

    @Column()
    @IsInt()
    @IsNotEmpty()
    mobileNumber: number

    @Column()
    @IsInt()
    @IsNotEmpty()
    dob: number

    @Column()
    @IsNotEmpty()
    gender: 'M' | 'F' | 'U' | 'N'

    @Column("text", { nullable: true })
    picUrl: string


    @Column("text")
    @IsNotEmpty()
    address: string
}