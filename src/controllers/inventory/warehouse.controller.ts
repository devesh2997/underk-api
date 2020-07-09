import { Request, Response } from "express";
import { TOG, ReE, ReS } from "../../utils";
import { WarehouseService } from "../../services/inventory/warehouse.service";

export class WarehouseController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let result = await TOG(WarehouseService.get(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Warehouse found', result: result.toJSON() }, 201)
    }

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let result = await TOG(WarehouseService.getAll())

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Warehouses found', result: result.map(war => war.toJSON()) }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let result = await TOG(WarehouseService.delete(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Warehouse deleted', result: result.toJSON() }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let result = await TOG(WarehouseService.create(body))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, { message: 'Warehouse created', result: result.toJSON() }, 201)
    }


}