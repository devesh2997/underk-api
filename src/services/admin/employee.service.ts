import { Employee } from "../../entity/admin/Employee"
import { TO, TE, VE } from "../../utils/index"
import { isNotEmpty } from "class-validator"

export class EmployeeService {
    static createEmployee = async (employeeInfo: any): Promise<Employee> | never => {
        let err: any, emp: Employee

        //mobileNumber number must be number
        if (isNotEmpty(employeeInfo.mobileNumber)) {
            employeeInfo.mobileNumber = Number(employeeInfo.mobileNumber)
        }

        //dob must be number
        if (isNotEmpty(employeeInfo.dob)) {
            employeeInfo.dob = Number(employeeInfo.dob)
        }

        //create employee object
        emp = new Employee(employeeInfo.firstName, employeeInfo.lastName, employeeInfo.email, employeeInfo.mobileCountryCode, employeeInfo.mobileNumber, employeeInfo.dob, employeeInfo.gender, employeeInfo.picUrl)

        //validate employee object
        await VE(emp)

        let existingEmployee
            //check if email is in use
            ;[err, existingEmployee] = await TO(Employee.findOne({ email: employeeInfo.email }));
        if (existingEmployee) {
            TE("Email already in use")
        }

        //check if mobile is in use
        [err, existingEmployee] = await TO(Employee.findOne({ mobileCountryCode: employeeInfo.mobileCountryCode, mobileNumber: employeeInfo.mobileNumber, }));
        if (existingEmployee) {
            TE("Mobile number already in use")
        }

        //try to insert new employee
        ;[err, emp] = await TO(Employee.insert(emp))
        if (err) {
            TE(err)
        }

        //get created employee object
        const newEmp = await Employee.findOne({ email: employeeInfo.email })

        if (typeof newEmp === 'undefined') {
            TE("Some error occurred")
        }


        return newEmp as Employee
    }
}