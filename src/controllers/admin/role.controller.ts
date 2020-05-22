import { Request, Response } from "express";
import { RoleJSON } from "../../entity/admin/Role";
import { TO, ReE, ReS } from "../../utils";
import { RoleService } from "../../services/admin/role.service";

export class RoleController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, role: RoleJSON

        [err, role] = await TO(RoleService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Role found', result: role }, 201)
    }

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let err: string, roles: RoleJSON[]

        [err, roles] = await TO(RoleService.getAll())

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Roles found: ' + roles.length, result: roles }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, role: RoleJSON

        [err, role] = await TO(RoleService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Role deleted', result: role }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, role: RoleJSON

        [err, role] = await TO(RoleService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Role created', result: role }, 201)
    }

    static addPolicies = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, role: RoleJSON

        [err, role] = await TO(RoleService.addPolicies(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Policies added', result: role }, 201)
    }

    static deletePolicies = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, role: RoleJSON

        [err, role] = await TO(RoleService.deletePolicies(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Policies deleted', result: role }, 201)
    }


}