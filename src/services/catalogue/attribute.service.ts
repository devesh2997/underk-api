import { AttributeJSON, Attribute } from "../../entity/catalogue/Attribute";
import { isEmpty, TE, TO, VE } from "../../utils";
import { Subtype } from "../../entity/catalogue/Subtype";

export class AttributeService {
    static get = async (attributeInfo: any): Promise<AttributeJSON> | never => {
        let err: any, attribute: Attribute

        if (isEmpty(attributeInfo.id)) {
            TE("Attribute id not provided")
        }

        [err, attribute] = await TO(Attribute.findOne({ id: attributeInfo.id },{relations:['subtype','subtype.type']}))

        if (err) {
            TE(err)
        }

        if (typeof attribute === 'undefined') {
            TE("Attribute not found")
        }

        return attribute.toJSON()
    }

    static delete = async (attributeInfo: any): Promise<AttributeJSON> | never => {
        let err: any, attribute: Attribute

        if (isEmpty(attributeInfo.id)) {
            TE("Attribute id not provided")
        }

        [err, attribute] = await TO(Attribute.findOne({ id: attributeInfo.id }))

        if (err) {
            TE(err)
        }

        if (typeof attribute === 'undefined') {
            TE("Attribute not found")
        }

        [err] = await TO(Attribute.remove(attribute))

        if (err) {
            TE(err)
        }

        return attribute.toJSON()
    }

    static create = async (attributeInfo: any): Promise<AttributeJSON> | never => {
        let err: any, attribute: Attribute

        if (isEmpty(attributeInfo.name)) {
            TE("Attribute name not provided")
        }

        if (isEmpty(attributeInfo.subtypeSku)) {
            TE("Subtype sku not provided")
        }

        attribute = new Attribute(String(attributeInfo.name).toLowerCase())
        VE(attribute)

        let subtype: Subtype

        [err, subtype] = await TO(Subtype.findOne({ sku: attributeInfo.subtypeSku }, { relations: ['type'] }))
        if (err) {
            TE(err)
        }
        if (isEmpty(subtype)) {
            TE("Subtype with given sku not found")
        }

        attribute.subtype = subtype

        let existingAttribute: Attribute
        [err, existingAttribute] = await TO(Attribute.findOne({ where: { name: attribute.name, subtype: subtype } }))
        if (err) {
            TE(err)
        }
        if (existingAttribute) {
            TE("Attribute with given name and subtype already exists")
        }

        [err] = await TO(Attribute.insert(attribute))
        if (err) {
            TE(err)
        }

        return attribute.toJSON()
    }


}