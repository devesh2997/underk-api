import { Request, Response } from "express";
import { Subtype, SubtypeJSON } from "../../entity/catalogue/Subtype";
import { TO, ReE, ReS } from "../../utils";
import { SubtypeService } from "../../services/catalogue/subtype.service";

export class SubtypeController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, subtype: SubtypeJSON

        [err, subtype] = await TO(SubtypeService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Subtype found', subtype: subtype }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, subtype: SubtypeJSON

        [err, subtype] = await TO(SubtypeService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Subtype deleted', subtype: subtype }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, subtype: SubtypeJSON

        [err, subtype] = await TO(SubtypeService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Subtype created', subtype: subtype }, 201)
    }


}