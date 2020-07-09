import { InsertResult } from 'typeorm';
import { Type } from "../../entity/catalogue/Type";
import { VE, CAE, TOG } from "../../utils";
import { isEmpty } from "class-validator";

export class TypeService {
    static get = async (typeInfo: any): Promise<Type | ApiError> => {

        if (isEmpty(typeInfo.sku)) {
            return CAE("Type sku not provided")
        }

        let res = await TOG<Type | undefined>(Type.findOne({ sku: typeInfo.sku }, { relations: ['subtypes', 'subtypes.attributes', 'subtypes.skuAttributes', 'subtypes.optionAttribute'] }))
        if (res instanceof ApiError) return res

        if (typeof res === 'undefined') {
            return CAE("Type not found")
        }

        return res
    }

    static getAll = async (): Promise<Type[] | ApiError> => {

        let res = await TOG<Type[]>(Type.find({ relations: ['subtypes', 'subtypes.attributes', 'subtypes.attributes.values', 'subtypes.skuAttributes', 'subtypes.skuAttributes.values', 'subtypes.optionAttribute', 'subtypes.optionAttribute.values'] }))
        if (res instanceof ApiError) {
            return res
        }

        return res
    }

    static delete = async (typeInfo: any): Promise<Type | ApiError> => {
        if (isEmpty(typeInfo.sku)) {
            return CAE("Type sku not provided")
        }
        let res = await TOG<Type | undefined>(Type.findOne({ sku: typeInfo.sku }))
        if (res instanceof ApiError) return res
        if (typeof res === 'undefined') {
            return CAE("Type not found")
        }
        res = await TOG<Type>(res.remove())
        if (res instanceof ApiError) return res

        return res

    }

    static create = async (typeInfo: any): Promise<Type | ApiError> => {
        if (isEmpty(typeInfo.sku)) {
            return CAE("Type sku not provided")
        }

        if (isEmpty(typeInfo.name)) {
            return CAE("Type name not provided")
        }

        let type = new Type(typeInfo.sku, typeInfo.name)

        let validationResult = await VE(type)
        if (validationResult instanceof ApiError) return validationResult

        let existingType = await TOG<Type | undefined>(Type.findOne({ sku: typeInfo.sku }))
        if (existingType instanceof ApiError) return existingType
        if (typeof existingType !== 'undefined') {
            return CAE("Type with given sku already exists")
        }

        let res = await TOG<InsertResult>(Type.insert(type))
        if (res instanceof ApiError) return res

        return type
    }


}