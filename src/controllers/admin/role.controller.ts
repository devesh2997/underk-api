import { Request, Response } from "express";
import { Role } from "../../entity/admin/Role";
import { TOG, ReE, ReS } from "../../utils";
import { RoleService } from "../../services/admin/role.service";
import ApiError from "../../core/errors";

export class RoleController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Role | ApiError>(RoleService.get(query));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            { message: "Role found", result: result.toJSON() },
            201
        );
    };

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let result = await TOG<Role[] | ApiError>(RoleService.getAll());
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Roles found: " + result.length,
                result: result.map((role) => role.toJSON()),
            },
            201
        );
    };

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Role | ApiError>(RoleService.delete(query));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            { message: "Role deleted", result: result.toJSON() },
            201
        );
    };

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;

        let result = await TOG<Role | ApiError>(RoleService.create(body));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            { message: "Role created", result: result.toJSON() },
            201
        );
    };

    static addPolicies = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;

        let result = await TOG<Role | ApiError>(RoleService.addPolicies(body));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            { message: "Policies added", result: result.toJSON() },
            201
        );
    };

    static deletePolicies = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;

        let result = await TOG<Role | ApiError>(
            RoleService.deletePolicies(body)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            { message: "Policies deleted", result: result.toJSON() },
            201
        );
    };
}
