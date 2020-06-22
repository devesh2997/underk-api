import { SubtypeJSON, Subtype } from "../../entity/catalogue/Subtype";
import { TE, TO, VE } from "../../utils";
import { Type } from "../../entity/catalogue/Type";
import { isEmpty } from "class-validator";
import { Attribute } from "../../entity/catalogue/Attribute";
import { SKUAttribute } from "../../entity/catalogue/SKUAttribute";
import { OptionAttribute } from "../../entity/catalogue/OptionAttribute";

export interface CreateSubtypeInfo {
    sku: string
    name: string
    typeSku: string
    attributes: { name: string, variantsBasis: boolean, isMultivalued: boolean, isCompulsory: boolean, isFilterable: boolean }[]
    skuAttributes: { name: string, skuOrdering: number, variantsBasis: boolean, isFilterable: boolean }[],
    optionAttributes: { name: string }[]
}

export class SubtypeService {
    static get = async (subtypeInfo: any): Promise<SubtypeJSON> | never => {
        let err: any, subtype: Subtype

        if (isEmpty(subtypeInfo.sku)) {
            TE("Subtype sku not provided")
        }

        [err, subtype] = await TO(Subtype.findOne({ sku: subtypeInfo.sku }, { relations: ['type', 'attributes'] }))
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

    static create = async (subtypeInfo: CreateSubtypeInfo): Promise<SubtypeJSON> | never => {
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

        if (isEmpty(type)) {
            TE("Type with given sku not found")
        }

        subtype.type = type

        let existingsubtype: Subtype

        [err, existingsubtype] = await TO(Subtype.findOne({ sku: subtypeInfo.sku }))
        if (existingsubtype) {
            TE("subtype with given sku already exists")
        }

        if (!isEmpty(subtypeInfo.attributes)) {
            subtype.attributes = []
            for (let i = 0; i < subtypeInfo.attributes.length; i++) {
                const attr = subtypeInfo.attributes[i]
                const attribute = new Attribute(attr.name, attr.variantsBasis, attr.isMultivalued, attr.isCompulsory, attr.isFilterable)
                await VE(attribute)
                subtype.attributes.push(attribute)
            }
        }

        if (!isEmpty(subtypeInfo.skuAttributes)) {
            subtype.skuAttributes = []
            for (let i = 0; i < subtypeInfo.skuAttributes.length; i++) {
                const attr = subtypeInfo.skuAttributes[i]
                const attribute = new SKUAttribute(attr.name, attr.skuOrdering, attr.variantsBasis, attr.isFilterable)
                await VE(attribute)
                subtype.skuAttributes.push(attribute)
            }
        }

        if (!isEmpty(subtypeInfo.optionAttributes)) {
            subtype.optionAttributes = []
            for (let i = 0; i < subtypeInfo.optionAttributes.length; i++) {
                const attr = subtypeInfo.optionAttributes[i]
                const attribute = new OptionAttribute(attr.name,)
                await VE(attribute)
                subtype.optionAttributes.push(attribute)
            }
        }

        [err, subtype] = await TO(subtype.save())
        if (err) {
            TE(err)
        }

        return subtype.toJSON()
    }
}