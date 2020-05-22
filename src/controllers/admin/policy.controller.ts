import { Request, Response } from "express";
import { PolicyJSON } from "../../entity/admin/Policy";
import { TO, ReE, ReS } from "../../utils";
import { PolicyService } from "../../services/admin/policy.service";

export class PolicyController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, policy: PolicyJSON

        [err, policy] = await TO(PolicyService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Policy found', result: policy }, 201)
    }

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let err: string, policies: PolicyJSON[]

        [err, policies] = await TO(PolicyService.getAll())

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Policies found: ' + policies.length, result: policies }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, policy: PolicyJSON

        [err, policy] = await TO(PolicyService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Policy deleted', result: policy }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, policy: PolicyJSON

        [err, policy] = await TO(PolicyService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Policy created', result: policy }, 201)
    }


}