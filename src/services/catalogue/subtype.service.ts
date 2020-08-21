import { DescriptionJSON } from './../../entity/catalogue/Description';
import { VE, CAE, TOG } from "../../utils";
import { Type } from "../../entity/catalogue/Type";
import { isEmpty } from "class-validator";
import { Attribute, AttributeJSON } from "../../entity/catalogue/Attribute";
import { SKUAttribute, SKUAttributeJSON } from "../../entity/catalogue/SKUAttribute";
import { OptionAttribute, OptionAttributeJSON } from "../../entity/catalogue/OptionAttribute";
import { AttributeValue } from "../../entity/catalogue/AttributeValue";
import { SKUAttributeValue } from "../../entity/catalogue/SKUAttributeValue";
import { OptionAttributeValue } from "../../entity/catalogue/OptionAttributeValue";
import { Subtype } from "../../entity/catalogue/Subtype";
import ApiError from "../../core/errors";
import Description from "../../entity/catalogue/Description";

export interface CreateSubtypeInfo {
    sku: string
    name: string
    typeSku: string
    attributes: AttributeJSON[]
    skuAttributes: SKUAttributeJSON[],
    optionAttribute: OptionAttributeJSON,
    descriptions: DescriptionJSON[]
}

export class SubtypeService {
    static get = async (subtypeInfo: any): Promise<Subtype | ApiError> => {
        if (isEmpty(subtypeInfo.id)) {
            return CAE("Subtype id not provided")
        }

        let res = await TOG<Subtype | undefined>(Subtype.findOne({ id: subtypeInfo.id }, { relations: ['type', 'attributes', 'attributes.values', 'optionAttribute', 'optionAttribute.values', 'skuAttributes', 'skuAttributes.values'] }))
        if (res instanceof ApiError) {
            return res
        }

        if (typeof res === 'undefined') {
            return CAE("Subtype not found")
        }

        return res
    }

    static delete = async (subtypeInfo: any): Promise<Subtype | ApiError> => {
        if (isEmpty(subtypeInfo.sku)) {
            return CAE("Subtype sku not provided")
        }
        let subtype = await TOG<Subtype | undefined>(Subtype.findOne({ sku: subtypeInfo.sku }))
        if (subtype instanceof ApiError) {
            return subtype
        }
        if (typeof subtype === 'undefined') {
            return CAE("Subtype not found")
        }

        subtype = await TOG<Subtype>(subtype.remove())

        if (subtype instanceof ApiError) {
            return subtype
        }

        return subtype
    }

    static create = async (subtypeInfo: CreateSubtypeInfo): Promise<Subtype | ApiError> => {
        if (isEmpty(subtypeInfo.sku)) {
            return CAE("Subtype sku not provided")
        }

        if (isEmpty(subtypeInfo.name)) {
            return CAE("Subtype name not provided")
        }

        if (isEmpty(subtypeInfo.typeSku)) {
            return CAE("Type sku not provided")
        }

        let subtype = new Subtype(subtypeInfo.sku, subtypeInfo.name)

        let type = await TOG<Type | undefined>(Type.findOne({ sku: subtypeInfo.typeSku }))

        if (type instanceof ApiError) return type
        if (typeof type === 'undefined') {
            return CAE("Type with given sku not found")
        }

        subtype.type = type

        let existingsubtype = await TOG<Subtype | undefined>(Subtype.findOne({ sku: subtypeInfo.sku }))
        if (existingsubtype instanceof ApiError) return existingsubtype
        if (existingsubtype) {
            return CAE("subtype with given sku already exists")
        }

        existingsubtype = await TOG<Subtype | undefined>(Subtype.findOne({ name: subtypeInfo.name }))
        if (existingsubtype instanceof ApiError) return existingsubtype
        if (existingsubtype) {
            return CAE("subtype with given name already exists")
        }

        if (!isEmpty(subtypeInfo.descriptions)) {
            subtype.descriptions = []
            for (let i = 0; i < subtypeInfo.descriptions.length; i++) {
                const desc = subtypeInfo.descriptions[i]
                const description = await Description.fromJSON(desc)

                if (description instanceof ApiError) return description

                subtype.descriptions.push(description)

            }
        }

        if (!isEmpty(subtypeInfo.attributes)) {
            subtype.attributes = []
            for (let i = 0; i < subtypeInfo.attributes.length; i++) {
                const attr = subtypeInfo.attributes[i]
                const attribute = new Attribute(attr.name, attr.isMultiValued, attr.isCompulsory, attr.isFilterable, attr.isVisible)
                let validationResult = await VE(attribute);
                if (validationResult instanceof ApiError) return validationResult
                attribute.values = []
                for (let j = 0; j < attr.values.length; j++) {
                    const attrValue = attr.values[j]
                    const attributeValue = new AttributeValue(attrValue.name, attrValue.valueType, attrValue.value)
                    let validationResult = await VE(attributeValue);
                    if (validationResult instanceof ApiError) return validationResult
                    attribute.values.push(attributeValue)
                }
                subtype.attributes.push(attribute)
            }
        }

        if (!isEmpty(subtypeInfo.skuAttributes)) {
            subtype.skuAttributes = []
            for (let i = 0; i < subtypeInfo.skuAttributes.length; i++) {
                const attr = subtypeInfo.skuAttributes[i]
                const attribute = new SKUAttribute(attr.name, attr.skuOrdering, attr.variantsBasis, attr.isFilterable, attr.isVisible)
                let validationResult = await VE(attribute);
                if (validationResult instanceof ApiError) return validationResult
                attribute.values = []
                for (let j = 0; j < attr.values.length; j++) {
                    const attrValue = attr.values[j]
                    const attributeValue = new SKUAttributeValue(attrValue.sku, attrValue.name, attrValue.valueType, attrValue.value)
                    let validationResult = await VE(attributeValue);
                    if (validationResult instanceof ApiError) return validationResult
                    attribute.values.push(attributeValue)
                }
                subtype.skuAttributes.push(attribute)
            }
        }

        if (!isEmpty(subtypeInfo.optionAttribute)) {
            const attr = subtypeInfo.optionAttribute
            const attribute = new OptionAttribute(attr.name)
            let validationResult = await VE(attribute);
            if (validationResult instanceof ApiError) return validationResult
            attribute.values = []
            for (let j = 0; j < attr.values.length; j++) {
                const attrValue = attr.values[j]
                const attributeValue = new OptionAttributeValue(attrValue.sku, attrValue.name, attrValue.order, attrValue.valueType, attrValue.value)
                let validationResult = await VE(attributeValue);
                if (validationResult instanceof ApiError) return validationResult
                attribute.values.push(attributeValue)
            }
            subtype.optionAttribute = attribute
        }

        let validationResult = await VE(subtype);
        if (validationResult instanceof ApiError) return validationResult

        let res = await TOG<Subtype>(subtype.save())
        if (res instanceof ApiError) {
            return res
        }

        return res
    }
}