import { AdminService } from "src/services/admin/admin.service"
import { Admin } from "src/entity/admin/Admin"
import { Request, Response } from "express";
import { TO, ReS, ReE } from "src/utils";

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
}