import { WarehouseJSON, Warehouse } from "../../entity/inventory/Warehouse";
import { isEmpty } from "class-validator";
import { TE, TO, VE } from "../../utils";

export class WarehouseService {
    static get = async (warehouseInfo: any): Promise<WarehouseJSON> | never => {
        let err, warehouse: Warehouse

        if (isEmpty(warehouseInfo.code)) {
            TE("Warehouse code not provided")
        }

        [err, warehouse] = await TO(Warehouse.findOne({ code: warehouseInfo.code }))
        if (err) TE(err)

        if (typeof warehouse === 'undefined') {
            TE("Warehouse not found")
        }

        return warehouse.toJSON()
    }

    static getAll = async (): Promise<WarehouseJSON[]> | never => {
        let err, warehouses: Warehouse[]

        [err, warehouses] = await TO(Warehouse.find())

        if (err) TE(err)

        if (typeof warehouses === 'undefined') {
            TE("Warehouses not found")
        }

        return warehouses.map(w => w.toJSON())
    }

    static delete = async (warehouseInfo: any): Promise<WarehouseJSON> | never => {
        let err, warehouse: Warehouse

        if (isEmpty(warehouseInfo.code)) {
            TE("Warehouse code not provided")
        }

        [err, warehouse] = await TO(Warehouse.findOne({ code: warehouseInfo.code }))
        if (err) TE(err)

        if (typeof warehouse === 'undefined') {
            TE("Warehouse not found")
        }

        [err, warehouse] = await TO(warehouse.remove())
        if (err) TE(err)

        return warehouse.toJSON()
    }

    static create = async (warehouseInfo: any): Promise<WarehouseJSON> | never => {
        let err: any, warehouse: Warehouse

        warehouse = new Warehouse(warehouseInfo.code, warehouseInfo.name)

        await VE(warehouse)

        let existingWarehouse: Warehouse

        [err, existingWarehouse] = await TO(Warehouse.findOne({ code: warehouseInfo.code }))
        if (err) TE(err)
        if (existingWarehouse) {
            TE("Warehouse with given code already exists")
        }

        [err, warehouse] = await TO(warehouse.save())

        if (err) TE(err)

        return warehouse.toJSON()
    }


}