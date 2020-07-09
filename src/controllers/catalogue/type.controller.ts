import { TOG } from './../../utils';
import { Request, Response } from "express";
import { TypeJSON, Type } from "../../entity/catalogue/Type";
import { TO, ReE, ReS } from "../../utils";
import { TypeService } from "../../services/catalogue/type.service";

export class TypeController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, type: TypeJSON

        [err, type] = await TO(TypeService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Type found', result: type }, 201)
    }

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let err: Error | undefined, types: Type[] | undefined

        [err, types] = await TOG<Type[]>(TypeService.getAll())

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Types found', result: types?.map(type => type.toJSON()) }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, type: TypeJSON

        [err, type] = await TO(TypeService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Type deleted', result: type }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, type: TypeJSON

        [err, type] = await TO(TypeService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Type created', result: type }, 201)
    }


}