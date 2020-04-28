import { Entity, ManyToOne } from "typeorm"
import { Address } from "../shared/Address";
import { Employee } from "./Employee";

@Entity()
export class EmployeeAddress extends Address {
    @ManyToOne(() => Employee, employee => employee.addresses)
    employee: Employee
}