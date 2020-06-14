import { WarehouseJSON, Warehouse } from "../../entity/inventory/Warehouse";
import { isEmpty } from "class-validator";
import { TE, TO, VE } from "../../utils";
import { Address } from "../../entity/shared/Address";

export class WarehouseService {
    static get = async (warehouseInfo: any): Promise<WarehouseJSON> | never => {
        let err, warehouse: Warehouse

        if (isEmpty(warehouseInfo.code)) {
            TE("Warehouse code not provided")
        }

        [err, warehouse] = await TO(Warehouse.findOne({ code: warehouseInfo.code }, { relations: ['address'] }))
        if (err) TE(err)

        if (typeof warehouse === 'undefined') {
            TE("Warehouse not found")
        }

        return warehouse.toJSON()
    }

    static getAll = async (): Promise<WarehouseJSON[]> | never => {
        let err, warehouses: Warehouse[]

        [err, warehouses] = await TO(Warehouse.find({ relations: ['address'] }))

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

        [err, warehouse] = await TO(Warehouse.findOne({ code: warehouseInfo.code }, { relations: ['address'] }))
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

        if (isEmpty(warehouseInfo.address)) {
            TE("Warehouse addresss not provided")
        }

        const address = new Address(warehouseInfo.address)

        await VE(address)

        warehouse = new Warehouse(warehouseInfo.code, warehouseInfo.name)

        await VE(warehouse)
        warehouse.address = address

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