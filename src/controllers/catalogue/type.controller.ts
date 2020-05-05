import { Request, Response } from "express";
import { Type, TypeJSON } from "../../entity/catalogue/Type";
import { TO, ReE, ReS } from "../../utils";
import { TypeService } from "../../services/catalogue/type.service";

export class TypeController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, type: TypeJSON

        [err, type] = await TO(TypeService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Type found', type: type }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, type: TypeJSON

        [err, type] = await TO(TypeService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Type deleted', type: type }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, type: TypeJSON

        [err, type] = await TO(TypeService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Type created', type: type }, 201)
    }


}