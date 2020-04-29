import AdminService, { AdminLoginSuccess } from "../../services/admin/admin.service"
import { Admin } from "../../entity/admin/Admin"
import { Request, Response } from "express";
import { TO, ReS, ReE } from "../../utils";

export class AdminController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, admin: Admin

        [err, admin] = await TO(AdminService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Admin found',
            admin: admin
        },
            201)

    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, admin: Admin

        [err, admin] = await TO(AdminService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Admin deleted',
            admin: admin
        },
            201)

    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, admin: Admin

        [err, admin] = await TO(AdminService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Successfully created new admin.',
            admin: admin
        },
            201)

    }

    static login = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, admin: AdminLoginSuccess

        [err, admin] = await TO(AdminService.login(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Successfully logged in.',
            admin: admin
        },
            201)

    }
}