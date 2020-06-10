import { Employee, EmployeeJSON } from "../../entity/admin/Employee"
import { TO, TE, VE } from "../../utils/index"
import { isNotEmpty, isEmpty } from "class-validator"

export class EmployeeService {

    static get = async (employeeInfo: any): Promise<EmployeeJSON> | never => {
        let err: any, emp: Employee | undefined

        if (isNotEmpty(employeeInfo.euid)) {
            [err, emp] = await TO(Employee.findOne({ euid: employeeInfo.euid }))
        } else if (isNotEmpty(employeeInfo.email)) {
            [err, emp] = await TO(Employee.findOne({ email: employeeInfo.email }))
        } else if (isNotEmpty(employeeInfo.mobileNumber) && isNotEmpty(employeeInfo.mobileCountryCode)) {
            [err, emp] = await TO(Employee.findOne({ mobileNumber: employeeInfo.mobileNumber, mobileCountryCode: employeeInfo.mobileCountryCode }))
        } else {
            TE("Please provide euid, email or mobile number")
            emp = undefined
        }

        if (err) {
            TE(err)
        }

        if (typeof emp === 'undefined') {
            TE("Employee not found.")
        }
        emp = emp as Employee

        return emp.toJSON()
    }

    static getAll = async (): Promise<EmployeeJSON[]> | never => {
        let err: any, emps: Employee[]

        [err, emps] = await TO(Employee.find())

        if (err) {
            TE(err)
        }

        if (typeof emps === 'undefined') {
            TE("Employee not found.")
        }


        return emps.map(emp => emp.toJSON())
    }

    static delete = async (employeeInfo: any): Promise<EmployeeJSON> | never => {
        let err: any, emp: Employee | undefined

        if (isEmpty(employeeInfo.euid)) {
            TE("euid not provided")
        } else {
            [err, emp] = await TO(Employee.findOne({ euid: employeeInfo.euid }))
            if (err || isEmpty(emp)) {
                TE("Employee not found")
            }
            ;[err, emp] = await TO(Employee.remove(emp as Employee))
        }

        if (err) {
            TE(err)
        }
        emp = emp as Employee
        return emp.toJSON()
    }

    static create = async (employeeInfo: EmployeeJSON): Promise<EmployeeJSON> | never => {
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
        emp = new Employee(employeeInfo.firstName, employeeInfo.lastName, employeeInfo.email, employeeInfo.mobileCountryCode, employeeInfo.mobileNumber, employeeInfo.dob, employeeInfo.gender, employeeInfo.picUrl, employeeInfo.address, employeeInfo.mobileVerified, employeeInfo.emailVerified)

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
        ;[err] = await TO(Employee.insert(emp))
        if (err) {
            TE(err)
        }
        emp = emp as Employee
        return emp.toJSON()
    }

    static update = async (employeeInfo: EmployeeJSON): Promise<EmployeeJSON> | never => {
        let err: any, emp: Employee

        if (isEmpty(employeeInfo) || isEmpty(employeeInfo.euid)) {
            TE("euid not provided")
        }

        let existingEmployee: Employee
            //check if employee exists or not
            ;[err, existingEmployee] = await TO(Employee.findOne({ euid: employeeInfo.euid }));
        if (err || !existingEmployee) {
            TE("Employee does not exist")
        }

        const existingEmployeeJSON = existingEmployee.toJSON()

        Object.assign(existingEmployeeJSON, employeeInfo)

        //mobileNumber number must be number
        if (isNotEmpty(existingEmployeeJSON.mobileNumber)) {
            existingEmployeeJSON.mobileNumber = Number(existingEmployeeJSON.mobileNumber)
        }

        //dob must be number
        if (isNotEmpty(existingEmployeeJSON.dob)) {
            existingEmployeeJSON.dob = Number(existingEmployeeJSON.dob)
        }

        emp = Employee.fromJson(existingEmployeeJSON)
        emp.euid = existingEmployeeJSON.euid
        await VE(emp)

            //try to update employee
            ;[err] = await TO(Employee.update({ euid: emp.euid }, emp))
        if (err) {
            TE(err)
        }

        emp = emp as Employee
        return emp.toJSON()
    }
}