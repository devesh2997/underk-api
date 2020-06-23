import { Type, TypeJSON } from "../../entity/catalogue/Type";
import { TE, TO } from "../../utils";
import { isEmpty } from "class-validator";

export class TypeService {
    static get = async (typeInfo: any): Promise<TypeJSON> | never => {
        let err, type: Type

        if (isEmpty(typeInfo.sku)) {
            TE("Type sku not provided")
        }

        [err, type] = await TO(Type.findOne({ sku: typeInfo.sku }, { relations: ['subtypes', 'subtypes.attributes', 'subtypes.skuAttributes', 'subtypes.optionAttributes'] }))
        if (err) {
            TE(err)
        }

        if (typeof type === 'undefined') {
            TE("Type not found")
        }

        return type.toJSON()
    }

    static getAll = async (): Promise<TypeJSON[]> | never => {
        let err, types: Type[]

        [err, types] = await TO(Type.find({ relations: ['subtypes', 'subtypes.attributes', 'subtypes.attributes.values', 'subtypes.skuAttributes', 'subtypes.skuAttributes.values', 'subtypes.optionAttributes', 'subtypes.optionAttributes.values'] }))
        if (err) {
            TE(err)
        }

        if (typeof types === 'undefined') {
            TE("Type not found")
        }

        return types.map(t => t.toJSON())
    }

    static delete = async (typeInfo: any): Promise<TypeJSON> | never => {
        let err, type: Type | undefined

        if (isEmpty(typeInfo.sku)) {
            TE("Type sku not provided")
        }
        [err, type] = await TO(Type.findOne({ sku: typeInfo.sku }))
        if (err) {
            TE(err)
        }
        if (isEmpty(type)) {
            TE("Type not found")
        }
        [err, type] = await TO(Type.remove(type as Type))
        if (err) {
            TE(err)
        }

        return type?.toJSON() as TypeJSON


    }

    static create = async (typeInfo: any): Promise<TypeJSON> | never => {
        let err: any, type: Type

        if (isEmpty(typeInfo.sku)) {
            TE("Type sku not provided")
        }

        if (isEmpty(typeInfo.name)) {
            TE("Type name not provided")
        }

        type = new Type(typeInfo.sku, typeInfo.name)

        let existingType: Type

        [err, existingType] = await TO(Type.findOne({ sku: typeInfo.sku }))
        if (existingType) {
            TE("Type with given sku already exists")
        }

        [err] = await TO(Type.insert(type))
        if (err) {
            TE(err)
        }

        return type.toJSON()
    }


}