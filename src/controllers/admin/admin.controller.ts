import AdminService, {
    AdminLoginSuccess,
} from "../../services/admin/admin.service";
import { Admin } from "../../entity/admin/Admin";
import { Request, Response } from "express";
import { TOG, ReS, ReE } from "../../utils";

export class AdminController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Admin | ApiError>(AdminService.get(query));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Admin found",
                result: result.toJSON(),
            },
            201
        );
    };

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let result = await TOG<Admin[] | ApiError>(AdminService.getAll());
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Admins found :" + result.length,
                result: result.map((admin) => admin.toJSON()),
            },
            201
        );
    };

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Admin | ApiError>(AdminService.delete(query));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Admin deleted",
                result: result.toJSON(),
            },
            201
        );
    };

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;

        let result = await TOG<Admin | ApiError>(AdminService.create(body));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Successfully created new admin.",
                result: result.toJSON(),
            },
            201
        );
    };

    static update = async (req: Request, res: Response): Promise<Response> => {
        const user: any = req.user;
        const body = req.body;

        let result = await TOG<Admin | ApiError>(
            AdminService.update(user.auid as string, body)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Successfully update admin.",
                result: result.toJSON(),
            },
            201
        );
    };

    static login = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;

        let result = await TOG<AdminLoginSuccess | ApiError>(
            AdminService.login(body)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Successfully logged in.",
                result: result,
            },
            201
        );
    };
}
