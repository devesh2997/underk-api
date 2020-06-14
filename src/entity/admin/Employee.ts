import { Entity, Generated, PrimaryColumn, OneToOne, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Admin } from "./Admin";
import { Length, IsEmail, IsNotEmpty, IsNumber } from "class-validator";
import { IsGender } from "../../utils/custom-decorators/IsGender";

export interface EmployeeJSON {

    euid: string
    firstName: string
    lastName: string
    email: string
    mobileCountryCode: string
    mobileNumber: number
    dob: number
    gender: string
    picUrl: string
    mobileVerified: boolean,
    emailVerified: boolean,
    address: string

}

@Entity()
export class Employee extends BaseEntity {

    constructor(firstName: string, lastName: string, email: string, mobileCountryCode: string, mobileNumber: number, dob: number, gender: string, picUrl: string, address: string, mobileVerified: boolean, emailVerified: boolean) {
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
        this.mobileVerified = mobileVerified
        this.emailVerified = emailVerified
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
        return new Employee(json.firstName, json.lastName, json.email, json.mobileCountryCode, json.mobileNumber, json.dob, json.gender, json.picUrl, json.address, json.mobileVerified, json.emailVerified)
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

    @Column("bigint")
    @IsNumber()
    @IsNotEmpty()
    mobileNumber: number

    @Column("bigint")
    @IsNumber()
    @IsNotEmpty()
    dob: number

    @Column()
    @IsNotEmpty()
    @IsGender()
    gender: string

    @Column("text", { nullable: true })
    picUrl: string


    @Column("text")
    @IsNotEmpty()
    address: string

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}