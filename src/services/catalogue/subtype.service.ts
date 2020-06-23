import { SubtypeJSON, Subtype } from "../../entity/catalogue/Subtype";
import { TE, TO, VE } from "../../utils";
import { Type } from "../../entity/catalogue/Type";
import { isEmpty } from "class-validator";
import { Attribute, AttributeJSON } from "../../entity/catalogue/Attribute";
import { SKUAttribute, SKUAttributeJSON } from "../../entity/catalogue/SKUAttribute";
import { OptionAttribute, OptionAttributeJSON } from "../../entity/catalogue/OptionAttribute";
import { AttributeValue } from "../../entity/catalogue/AttributeValue";
import { SKUAttributeValue } from "../../entity/catalogue/SKUAttributeValue";
import { OptionAttributeValue } from "../../entity/catalogue/OptionAttributeValue";

export interface CreateSubtypeInfo {
    sku: string
    name: string
    typeSku: string
    attributes: AttributeJSON[]
    skuAttributes: SKUAttributeJSON[],
    optionAttributes: OptionAttributeJSON[]
}

export class SubtypeService {
    static get = async (subtypeInfo: any): Promise<SubtypeJSON> | never => {
        let err: any, subtype: Subtype

        if (isEmpty(subtypeInfo.sku)) {
            TE("Subtype sku not provided")
        }

        [err, subtype] = await TO(Subtype.findOne({ sku: subtypeInfo.sku }, { relations: ['type', 'attributes', 'optionAttributes', 'skuAttributes'] }))
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

        console.log(JSON.stringify(subtypeInfo))

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
                const attribute = new Attribute(attr.name.toLowerCase(), attr.isMultiValued, attr.isCompulsory, attr.isFilterable)
                await VE(attribute)
                attribute.values = []
                for (let j = 0; j < attr.values.length; j++) {
                    const attrValue = attr.values[j]
                    const attributeValue = new AttributeValue(attrValue.name, attrValue.valueType, attrValue.value)
                    await VE(attributeValue)
                    attribute.values.push(attributeValue)
                }
                subtype.attributes.push(attribute)
            }
        }

        if (!isEmpty(subtypeInfo.skuAttributes)) {
            subtype.skuAttributes = []
            for (let i = 0; i < subtypeInfo.skuAttributes.length; i++) {
                const attr = subtypeInfo.skuAttributes[i]
                const attribute = new SKUAttribute(attr.name.toLowerCase(), attr.skuOrdering, attr.variantsBasis, attr.isFilterable)
                await VE(attribute)
                attribute.values = []
                for (let j = 0; j < attr.values.length; j++) {
                    const attrValue = attr.values[j]
                    const attributeValue = new SKUAttributeValue(attrValue.sku, attrValue.name, attrValue.valueType, attrValue.value)
                    await VE(attributeValue)
                    attribute.values.push(attributeValue)
                }
                subtype.skuAttributes.push(attribute)
            }
        }

        if (!isEmpty(subtypeInfo.optionAttributes)) {
            subtype.optionAttributes = []
            for (let i = 0; i < subtypeInfo.optionAttributes.length; i++) {
                const attr = subtypeInfo.optionAttributes[i]
                const attribute = new OptionAttribute(attr.name.toLowerCase(),)
                await VE(attribute)
                attribute.values = []
                for (let j = 0; j < attr.values.length; j++) {
                    const attrValue = attr.values[j]
                    const attributeValue = new OptionAttributeValue(attrValue.sku, attrValue.name, attrValue.valueType, attrValue.value)
                    await VE(attributeValue)
                    attribute.values.push(attributeValue)
                }
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