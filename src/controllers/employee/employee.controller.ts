import { Request, Response } from "express";
import { Employee } from "../../entity/admin/Employee";
import { TOG, ReE, ReS } from "../../utils";
import { EmployeeService } from "../../services/admin/employee.service";
import ApiError from "../../core/errors";

export class EmployeeController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Employee | ApiError>(EmployeeService.get(query));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Employee found",
                result: result.toJSON(),
            },
            201
        );
    };

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let result = await TOG<Employee[] | ApiError>(EmployeeService.getAll());
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Employees found :" + result.length,
                result: result.map((emp) => emp.toJSON()),
            },
            201
        );
    };

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Employee | ApiError>(
            EmployeeService.delete(query)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Employee deleted",
                result: result.toJSON(),
            },
            201
        );
    };

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;

        let result = await TOG<Employee | ApiError>(
            EmployeeService.create(body)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Successfully created new employee.",
                result: result.toJSON(),
            },
            201
        );
    };

    static update = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;

        let result = await TOG<Employee | ApiError>(
            EmployeeService.update(body)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Successfully updated new employee.",
                result: result.toJSON(),
            },
            201
        );
    };
}
