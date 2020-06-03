import { Request, Response } from "express";
import { SupplierJSON } from "../../entity/inventory/Supplier";
import { TO, ReE, ReS } from "../../utils";
import { SupplierService } from "../../services/inventory/supplier.service";

export class SupplierController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, supplier: SupplierJSON

        [err, supplier] = await TO(SupplierService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Supplier found', result: supplier }, 201)
    }

    static getAll = async (_:Request, res: Response): Promise<Response> => {
        let err: string, suppliers: SupplierJSON[]

        [err, suppliers] = await TO(SupplierService.getAll())

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Suppliers found', result: suppliers }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, supplier: SupplierJSON

        [err, supplier] = await TO(SupplierService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Supplier deleted', result: supplier }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, supplier: SupplierJSON

        [err, supplier] = await TO(SupplierService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Supplier created', result: supplier }, 201)
    }


}