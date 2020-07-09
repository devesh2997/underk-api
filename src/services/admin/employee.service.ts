import { Employee, EmployeeJSON } from "../../entity/admin/Employee";
import { TOG, CAE, VE } from "../../utils/index";
import { isNotEmpty, isEmpty } from "class-validator";

export class EmployeeService {
    static get = async (employeeInfo: any): Promise<Employee | ApiError> => {
        let emp: Employee;

        let res: Employee | ApiError | undefined;
        if (isNotEmpty(employeeInfo.euid)) {
            res = await TOG<Employee | undefined>(
                Employee.findOne({ euid: employeeInfo.euid })
            );
        } else if (isNotEmpty(employeeInfo.email)) {
            res = await TOG<Employee | undefined>(
                Employee.findOne({ email: employeeInfo.email })
            );
        } else if (
            isNotEmpty(employeeInfo.mobileNumber) &&
            isNotEmpty(employeeInfo.mobileCountryCode)
        ) {
            res = await TOG<Employee | undefined>(
                Employee.findOne({
                    mobileNumber: employeeInfo.mobileNumber,
                    mobileCountryCode: employeeInfo.mobileCountryCode,
                })
            );
        } else {
            return CAE("Please provide euid, email or mobile number");
        }

        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Employee not found");
        }

        emp = res;

        return emp;
    };

    static getAll = async (): Promise<Employee[] | ApiError> => {
        let emps: Employee[];

        let res = await TOG<Employee[]>(Employee.find());
        if (res instanceof ApiError) {
            return res;
        }

        emps = res;

        return emps;
    };

    static delete = async (employeeInfo: any): Promise<Employee | ApiError> => {
        let emp: Employee;

        if (isEmpty(employeeInfo.euid)) {
            return CAE("euid not provided");
        }

        let res = await TOG<Employee | undefined>(
            Employee.findOne({ euid: employeeInfo.euid })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Employee not found");
        }

        emp = res;

        res = await TOG<Employee>(Employee.remove(emp));
        if (res instanceof ApiError) {
            return res;
        }

        emp = res;

        return emp;
    };

    static create = async (
        employeeInfo: EmployeeJSON
    ): Promise<Employee | ApiError> => {
        let emp: Employee;

        //mobileNumber number must be number
        if (isNotEmpty(employeeInfo.mobileNumber)) {
            employeeInfo.mobileNumber = Number(employeeInfo.mobileNumber);
        }

        //dob must be number
        if (isNotEmpty(employeeInfo.dob)) {
            employeeInfo.dob = Number(employeeInfo.dob);
        }

        //create employee object
        emp = new Employee(
            employeeInfo.firstName,
            employeeInfo.lastName,
            employeeInfo.email,
            employeeInfo.mobileCountryCode,
            employeeInfo.mobileNumber,
            employeeInfo.dob,
            employeeInfo.gender,
            employeeInfo.picUrl,
            employeeInfo.address,
            employeeInfo.mobileVerified,
            employeeInfo.emailVerified
        );

        //validate employee object
        const validationResult = await VE(emp);
        if (validationResult instanceof ApiError) return validationResult;

        //check if email is in use
        let res = await TOG<Employee | undefined>(
            Employee.findOne({ email: employeeInfo.email })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res !== "undefined") {
            return CAE("Email already in use");
        }

        //check if mobile is in use
        res = await TOG<Employee | undefined>(
            Employee.findOne({
                mobileCountryCode: employeeInfo.mobileCountryCode,
                mobileNumber: employeeInfo.mobileNumber,
            })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res !== "undefined") {
            return CAE("Mobile number already in use");
        }

        //try to insert new employee
        res = await TOG<Employee>(Employee.save(emp));
        if (res instanceof ApiError) {
            return res;
        }

        emp = res;

        return emp;
    };

    static update = async (
        employeeInfo: EmployeeJSON
    ): Promise<Employee | ApiError> => {
        let emp: Employee;

        if (isEmpty(employeeInfo) || isEmpty(employeeInfo.euid)) {
            return CAE("euid not provided");
        }

        let existingEmployee: Employee;
        //check if employee exists or not
        let res = await TOG<Employee | undefined>(
            Employee.findOne({ euid: employeeInfo.euid })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Employee does not exist");
        }

        existingEmployee = res;

        const existingEmployeeJSON = existingEmployee.toJSON();

        Object.assign(existingEmployeeJSON, employeeInfo);

        //mobileNumber number must be number
        if (isNotEmpty(existingEmployeeJSON.mobileNumber)) {
            existingEmployeeJSON.mobileNumber = Number(
                existingEmployeeJSON.mobileNumber
            );
        }

        //dob must be number
        if (isNotEmpty(existingEmployeeJSON.dob)) {
            existingEmployeeJSON.dob = Number(existingEmployeeJSON.dob);
        }

        emp = Employee.fromJson(existingEmployeeJSON);
        emp.euid = existingEmployeeJSON.euid;

        const validationResult = await VE(emp);
        if (validationResult instanceof ApiError) return validationResult;

        //try to update employee
        res = await TOG<Employee>(Employee.save(emp));
        if (res instanceof ApiError) {
            return res;
        }

        emp = res;

        return emp;
    };
}
