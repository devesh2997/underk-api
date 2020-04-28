import { Request, Response } from "express";
import { Employee } from "../../entity/admin/Employee";
import { TO, ReE, ReS } from "../../utils";
import { EmployeeService } from "../../services/admin/employee.service";

export class EmployeeController {
    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, employee: Employee

        [err, employee] = await TO(EmployeeService.createEmployee(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Successfully created new employee.',
            employee: employee
        },
            201)

    }
}