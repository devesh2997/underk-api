import { Request, Response } from "express";
import { WarehouseJSON } from "../../entity/inventory/Warehouse";
import { TO, ReE, ReS } from "../../utils";
import { WarehouseService } from "../../services/inventory/warehouse.service";

export class WarehouseController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, warehouse: WarehouseJSON

        [err, warehouse] = await TO(WarehouseService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Warehouse found', result: warehouse }, 201)
    }

    static getAll = async (_:Request, res: Response): Promise<Response> => {
        let err: string, warehouses: WarehouseJSON[]

        [err, warehouses] = await TO(WarehouseService.getAll())

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Warehouses found', result: warehouses }, 201)
    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query
        let err: string, warehouse: WarehouseJSON

        [err, warehouse] = await TO(WarehouseService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Warehouse deleted', result: warehouse }, 201)
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, warehouse: WarehouseJSON

        [err, warehouse] = await TO(WarehouseService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, { message: 'Warehouse created', result: warehouse }, 201)
    }


}