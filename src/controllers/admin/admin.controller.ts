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
            result: admin
        },
            201)

    }

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let err: string, admins: Admin[]

        [err, admins] = await TO(AdminService.getAll())

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Admins found :' + admins.length,
            result: admins
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
            result: admin
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
            result: admin
        },
            201)

    }

    static update = async (req: Request, res: Response): Promise<Response> => {
        const user: any = req.user
        const body = req.body
        let err: string, admin: Admin

        [err, admin] = await TO(AdminService.update(user.auid as string, body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Successfully update admin.',
            result: admin
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
            result: admin
        },
            201)

    }
}