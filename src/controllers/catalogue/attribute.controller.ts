import { Request, Response } from "express";
import { AttributeJSON } from "../../entity/catalogue/Attribute";
import { TO, ReE, ReS } from "../../utils";
import { AttributeService } from "../../services/catalogue/attribute.service";

export class AttributeController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, attribute: AttributeJSON

        [err, attribute] = await TO(AttributeService.get(query))

        if (err) ReE(res, err, 422)

        return ReS(res, { message: 'Attribute Found', attribute: attribute }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, attribute: AttributeJSON

        [err, attribute] = await TO(AttributeService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Attribute deleted', attribute: attribute }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, attribute: AttributeJSON

        [err, attribute] = await TO(AttributeService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Attribute created', attribute: attribute }, 201)
    }


}