import { Request, Response } from "express";
import { Policy } from "../../entity/admin/Policy";
import { TOG, ReE, ReS } from "../../utils";
import { PolicyService } from "../../services/admin/policy.service";

export class PolicyController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Policy | ApiError>(PolicyService.get(query));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            { message: "Policy found", result: result.toJSON() },
            201
        );
    };

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let result = await TOG<Policy[] | ApiError>(PolicyService.getAll());
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Policies found: " + result.length,
                result: result.map((policy) => policy.toJSON()),
            },
            201
        );
    };

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Policy | ApiError>(PolicyService.delete(query));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            { message: "Policy deleted", result: result.toJSON() },
            201
        );
    };

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;

        let result = await TOG<Policy | ApiError>(PolicyService.create(body));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            { message: "Policy created", result: result.toJSON() },
            201
        );
    };
}
