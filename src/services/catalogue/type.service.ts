import { Type, TypeJSON } from "../../entity/catalogue/Type";
import { isEmpty, TE, TO } from "../../utils";

export class TypeService {
    static get = async (typeInfo: any): Promise<TypeJSON> | never => {
        let err, type: Type

        if (isEmpty(typeInfo.sku)) {
            TE("Type sku not provided")
        }

        [err, type] = await TO(Type.findOne({ sku: typeInfo.sku }))
        if (err) {
            TE(err)
        }

        if (typeof type === 'undefined') {
            TE("Type not found")
        }

        return type.toJSON()
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