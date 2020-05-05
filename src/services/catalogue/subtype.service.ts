import { SubtypeJSON, Subtype } from "../../entity/catalogue/Subtype";
import { isEmpty, TE, TO } from "../../utils";
import { Type } from "../../entity/catalogue/Type";

export class SubtypeService {
    static get = async (subtypeInfo: any): Promise<SubtypeJSON> | never => {
        let err: any, subtype: Subtype

        if (isEmpty(subtypeInfo.sku)) {
            TE("Subtype sku not provided")
        }

        [err, subtype] = await TO(Subtype.findOne({ sku: subtypeInfo.sku }))
        if (err) {
            TE(err)
        }

        if (typeof subtype === 'undefined') {
            TE("Subtype not found")
        }

        return subtype.toJSON()
    }

    static delete = async (subtypeInfo: any): Promise<SubtypeJSON> | never => {
        let err: any, subtype: Subtype

        if (isEmpty(subtypeInfo.sku)) {
            TE("Subtype sku not provided")
        }
        [err, subtype] = await TO(Subtype.findOne({ sku: subtypeInfo.sku }))
        if (err) {
            TE(err)
        }
        if (isEmpty(subtype)) {
            TE("Subtype not found")
        }
        [err, subtype] = await TO(Subtype.remove(subtype as Subtype))

        if (err) {
            TE(err)
        }

        return subtype?.toJSON() as SubtypeJSON
    }

    static create = async (subtypeInfo: any): Promise<SubtypeJSON> | never => {
        let err: any, subtype: Subtype

        if (isEmpty(subtypeInfo.sku)) {
            TE("Subtype sku not provided")
        }

        if (isEmpty(subtypeInfo.name)) {
            TE("Subtype name not provided")
        }

        if (isEmpty(subtypeInfo.typeSku)) {
            TE("Type sku not provided")
        }

        subtype = new Subtype(subtypeInfo.sku, subtypeInfo.name)

        let type: Type

        [err, type] = await TO(Type.findOne({ sku: subtypeInfo.typeSku }))

        if (err) {
            TE(err)
        }

        if(isEmpty(type)){
            TE("Type with given not found")
        }

        subtype.type = type

        let existingsubtype: Subtype

        [err, existingsubtype] = await TO(Subtype.findOne({ sku: subtypeInfo.sku }))
        if (existingsubtype) {
            TE("subtype with given sku already exists")
        }

        [err] = await TO(Subtype.insert(subtype))
        if (err) {
            TE(err)
        }

        return subtype.toJSON()
    }
}