import { UserJSON } from "../../entity/user/User"
import { TO, ReE, ReS } from "../../utils"
import UserService from "../../services/user/user.service"
import { Request, Response } from "express";

export class UserController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, user: UserJSON

        [err, user] = await TO(UserService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'User found.',
            result: user
        },
            201)
    }
    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let err: string, users: UserJSON[]

        [err, users] = await TO(UserService.getAll())

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Users found',
            result: users
        },
            201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, user: UserJSON

        [err, user] = await TO(UserService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'User created.',
            result: user
        },
            201)
    }
}