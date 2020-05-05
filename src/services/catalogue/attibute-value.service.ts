import { isEmpty, TE, TO, VE } from "../../utils";
import { AttributeValue, AttributeValueJSON } from "../../entity/catalogue/AttributeValue";
import { Attribute } from "../../entity/catalogue/Attribute";
import { isNotEmpty } from "class-validator";

export class AttributeValueService {
    static get = async (attributeValueInfo: any): Promise<AttributeValueJSON> | never => {
        let err: any, attributeValue: AttributeValue

        if (isEmpty(attributeValueInfo.id)) {
            TE("AttributeValue id not provided")
        }

        [err, attributeValue] = await TO(AttributeValue.findOne({ id: attributeValueInfo.id }, { relations: ['attribute', 'attribute.subtype'] }))

        if (err) {
            TE(err)
        }

        if (typeof attributeValue === 'undefined') {
            TE("AttributeValue not found")
        }

        return attributeValue.toJSON()
    }

    static delete = async (attributeValueInfo: any): Promise<AttributeValueJSON> | never => {
        let err: any, attributeValue: AttributeValue

        if (isEmpty(attributeValueInfo.id)) {
            TE("AttributeValue id not provided")
        }

        [err, attributeValue] = await TO(AttributeValue.findOne({ id: attributeValueInfo.id }))

        if (err) {
            TE(err)
        }

        if (typeof attributeValue === 'undefined') {
            TE("AttributeValue not found")
        }

        [err] = await TO(AttributeValue.remove(attributeValue))

        if (err) {
            TE(err)
        }

        return attributeValue.toJSON()
    }

    static create = async (attributeValueInfo: any): Promise<AttributeValueJSON> | never => {
        let err: any, attributeValue: AttributeValue

        if (isEmpty(attributeValueInfo.sku)) {
            TE("AttributeValue sku not provided")
        }

        if (isEmpty(attributeValueInfo.name)) {
            TE("AttributeValue name not provided")
        }

        if (isEmpty(attributeValueInfo.attributeId)) {
            TE("Attribute id not provided")
        }

        attributeValueInfo.attributeId = Number(attributeValueInfo.attributeId)


        attributeValue = new AttributeValue(attributeValueInfo.sku, attributeValueInfo.name)
        VE(attributeValue)


        if (isNotEmpty(attributeValueInfo.valueType)) {
            if (attributeValueInfo.valueType !== 'hexcode') {
                TE("Value type not recognised")
            }
            if (isEmpty(attributeValueInfo.value)) {
                TE("Value not provided for value-type " + attributeValueInfo.valueType)
            }
            if (String(attributeValueInfo.value).length !== 7) {
                TE("Invalid hexcode length")
            }
            if (String(attributeValueInfo.value)[0] !== '#') {
                TE("Hexcode must begin with # symbol")
            }
            attributeValue.valueType = attributeValueInfo.valueType
            attributeValue.value = attributeValueInfo.value
        }

        let attribute: Attribute

        [err, attribute] = await TO(Attribute.findOne({ id: attributeValueInfo.attributeId }, { relations: ['subtype', 'subtype.type'] }))
        if (err) {
            TE(err)
        }
        if (isEmpty(attribute)) {
            TE("Attribute with given id not found")
        }

        attributeValue.attribute = attribute

        let existingAttributeValue: AttributeValue
        [err, existingAttributeValue] = await TO(AttributeValue.findOne({ where: { sku: attributeValue.sku, attribute: attribute } }))
        if (err) {
            TE(err)
        }
        if (existingAttributeValue) {
            TE("AttributeValue with given sku and attribute already exists")
        }

        [err] = await TO(AttributeValue.insert(attributeValue))
        if (err) {
            TE(err)
        }

        return attributeValue.toJSON()
    }
}