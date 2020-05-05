import { Request, Response } from "express";
import { TO, ReE, ReS } from "../../utils";
import { AttributeValueJSON } from "../../entity/catalogue/AttributeValue";
import { AttributeValueService } from "../../services/catalogue/attibute-value.service";

export class AttributeValueController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, attributeValue: AttributeValueJSON

        [err, attributeValue] = await TO(AttributeValueService.get(query))

        if (err) ReE(res, err, 422)

        return ReS(res, { message: 'AttributeValue Found', attributeValue: attributeValue }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, attributeValue: AttributeValueJSON

        [err, attributeValue] = await TO(AttributeValueService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'AttributeValue deleted', attributeValue: attributeValue }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, attributeValue: AttributeValueJSON

        [err, attributeValue] = await TO(AttributeValueService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'AttributeValue created', attributeValue: attributeValue }, 201)
    }


}