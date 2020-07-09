import { Request, Response } from "express";
import { ReE, ReS, TOG } from "../../utils";
import { SubtypeService } from "../../services/catalogue/subtype.service";

export class SubtypeController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let result = await TOG(SubtypeService.get(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Subtype found', result: result.toJSON() }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let result = await TOG(SubtypeService.delete(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Subtype deleted', result: result.toJSON() }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let result = await TOG(SubtypeService.create(body))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Subtype created', result: result.toJSON() }, 201)
    }


}