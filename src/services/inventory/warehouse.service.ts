import { CAE, TOG } from './../../utils/index';
import { Warehouse } from "../../entity/inventory/Warehouse";
import { isEmpty } from "class-validator";
import { VE } from "../../utils";
import { Address } from "../../entity/shared/Address";
import ApiError from '../../core/errors';

export class WarehouseService {
    static get = async (warehouseInfo: any): Promise<Warehouse | ApiError> => {
        if (isEmpty(warehouseInfo.code)) {
            return CAE("Warehouse code not provided")
        }

        let res = await TOG<Warehouse | undefined>(Warehouse.findOne({ code: warehouseInfo.code }, { relations: ['address'] }))
        if (res instanceof ApiError) return res

        if (typeof res === 'undefined') {
            return CAE("Warehouse not found")
        }

        return res
    }

    static getAll = async (): Promise<Warehouse[] | ApiError> => {

        let res = await TOG<Warehouse[]>(Warehouse.find({ relations: ['address'] }))

        if (res instanceof ApiError) return res

        return res
    }

    static delete = async (warehouseInfo: any): Promise<Warehouse | ApiError> => {
        if (isEmpty(warehouseInfo.code)) {
            return CAE("Warehouse code not provided")
        }

        let res = await TOG<Warehouse | undefined>(Warehouse.findOne({ code: warehouseInfo.code }, { relations: ['address'] }))
        if (res instanceof ApiError) return res

        if (typeof res === 'undefined') {
            return CAE("Warehouse not found")
        }

        res = await TOG<Warehouse>(res.remove())
        if (res instanceof ApiError) return res

        return res
    }

    static create = async (warehouseInfo: any): Promise<Warehouse | ApiError> => {
        let warehouse: Warehouse

        if (isEmpty(warehouseInfo.address)) {
            return CAE("Warehouse addresss not provided")
        }

        const address = new Address(warehouseInfo.address)

        let validationResult = await VE(address)
        if (validationResult instanceof ApiError) return validationResult

        warehouse = new Warehouse(warehouseInfo.code, warehouseInfo.name)
        warehouse.address = address

        validationResult = await VE(warehouse)
        if (validationResult instanceof ApiError) return validationResult

        let existingWarehouse = await TOG<Warehouse | undefined>(Warehouse.findOne({ code: warehouseInfo.code }))
        if (existingWarehouse instanceof ApiError) return existingWarehouse
        if (typeof existingWarehouse !== 'undefined') {
            return CAE("Warehouse with given code already exists")
        }

        let res = await TOG<Warehouse>(warehouse.save())

        if (res instanceof ApiError) return res

        return res
    }


}