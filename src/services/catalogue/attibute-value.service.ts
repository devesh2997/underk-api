import { TE, TO, VE } from "../../utils";
import { AttributeValue, AttributeValueJSON } from "../../entity/catalogue/AttributeValue";
import { Attribute } from "../../entity/catalogue/Attribute";
import { isNotEmpty, isEmpty } from "class-validator";
import { BulkCreateResult } from "entity/shared/BulkCreateResult";

type AttributeValueCreateInfo = {
    sku: string,
    name: string,
    attributeId: number,
    valueType?: string,
    value: string
}

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

    static create = async (attributeValueInfo: AttributeValueCreateInfo): Promise<AttributeValueJSON> | never => {
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
            attributeValue.valueType = attributeValueInfo.valueType as string
            attributeValue.value = attributeValueInfo.value as string
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

    static bulkCreate = async (attributeValuesInfo: AttributeValueCreateInfo[]): Promise<BulkCreateResult<AttributeValueJSON>> | never => {
        if (typeof attributeValuesInfo !== 'object') {
            TE("Invalid request data format")
        }
        let errors: any[] = []
        let attributeValuesJSON: AttributeValueJSON[] = []
        for (let i = 0; i < attributeValuesInfo.length; i++) {
            let err: any, attributeValueJSON: AttributeValueJSON
            let attributeValueInfo = attributeValuesInfo[i];

            [err, attributeValueJSON] = await TO(AttributeValueService.create(attributeValueInfo))
            if (err) {
                errors.push({ index: i, error: err })
            } else {
                attributeValuesJSON.push(attributeValueJSON)
            }
        }

        return { errors, entitiesCreated: attributeValuesJSON }

    }
}