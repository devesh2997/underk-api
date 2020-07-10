import { User } from "../../entity/user/User"
import { TOG, ReE, ReS } from "../../utils"
import UserService from "../../services/user/user.service"
import { Request, Response } from "express";
import ApiError from "../../core/errors";

export class UserController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let result = await TOG<User | ApiError>(UserService.get(query))
        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: 'User found.',
            result: result.toJSON()
        },
            201)
    }
    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let result = await TOG(UserService.getAll())
        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: 'Users found',
            result: result.map(user => user.toJSON())
        },
            201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body

        let result = await TOG<User | ApiError>(UserService.create(body))
        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: 'User created.',
            result: result.toJSON()
        },
            201)
    }
}
