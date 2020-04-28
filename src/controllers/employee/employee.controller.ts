import { Request, Response } from "express";
import { Employee } from "../../entity/admin/Employee";
import { TO, ReE, ReS } from "../../utils";
import { EmployeeService } from "../../services/admin/employee.service";

export class EmployeeController {

    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, employee: Employee

        [err, employee] = await TO(EmployeeService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Employee found',
            employee: employee
        },
            201)

    }
    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, employee: Employee

        [err, employee] = await TO(EmployeeService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Employee deleted',
            employee: employee
        },
            201)

    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, employee: Employee

        [err, employee] = await TO(EmployeeService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Successfully created new employee.',
            employee: employee
        },
            201)

    }

    static update = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, employee: Employee

        [err, employee] = await TO(EmployeeService.update(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Successfully updated new employee.',
            employee: employee
        },
            201)

    }


}