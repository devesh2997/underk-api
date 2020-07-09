import { TOG } from './../../utils';
import { Request, Response } from "express";
import { ReE, ReS } from "../../utils";
import { TypeService } from "../../services/catalogue/type.service";

export class TypeController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let result = await TOG(TypeService.get(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Type found', result: result.toJSON() }, 201)
    }

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let result = await TOG(TypeService.getAll())

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Types found', result: result.map(type => type.toJSON()) }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let result = await TOG(TypeService.delete(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Type deleted', result: result.toJSON() }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let result = await TOG(TypeService.create(body))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Type created', result: result.toJSON() }, 201)
    }


}