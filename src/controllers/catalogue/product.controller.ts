import { ProductService } from './../../services/catalogue/product.service';
import { TOG, ReE, ReS } from './../../utils/index';
import ApiError from '../../core/errors';
import { Request, Response } from "express";

export class ProductController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let result = await TOG(ProductService.get(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Product Found', result: result.toJSON() }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let result = await TOG(ProductService.delete(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Product Deleted', result: result.toJSON() }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body

        let result = await TOG(ProductService.create(body))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Product created', result: result.toJSON() }, 201)
    }

    static builCreate = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body

        let result = await TOG(ProductService.bulkCreate(body))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Products created', result: result }, 201)
    }


}