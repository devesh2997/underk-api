import { Request, Response } from "express";
import { TOG, ReE, ReS } from "../../utils";
import { SupplierService } from "../../services/inventory/supplier.service";

export class SupplierController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let result = await TOG(SupplierService.get(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Supplier found', result: result.toJSON() }, 201)
    }

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let result = await TOG(SupplierService.getAll())

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Suppliers found', result: result.map(sup => sup.toJSON()) }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let result = await TOG(SupplierService.delete(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Supplier deleted', result: result.toJSON() }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let result = await TOG(SupplierService.create(body))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Supplier created', result: result.toJSON() }, 201)
    }


}