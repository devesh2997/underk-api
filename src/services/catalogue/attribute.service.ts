import { AttributeJSON, Attribute } from "../../entity/catalogue/Attribute";
import { TE, TO, VE } from "../../utils";
import { Subtype } from "../../entity/catalogue/Subtype";
import { isEmpty, isNotEmpty } from "class-validator";

export class AttributeService {
    static get = async (attributeInfo: any): Promise<AttributeJSON> | never => {
        let err: any, attribute: Attribute

        if (isEmpty(attributeInfo.id)) {
            TE("Attribute id not provided")
        }

        [err, attribute] = await TO(Attribute.findOne({ id: attributeInfo.id }, { relations: ['subtype', 'subtype.type'] }))

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

        
        if (isNotEmpty(attributeInfo.skuOrdering)) {
            if (isNaN(attributeInfo.skuOrdering)) {
                attributeInfo.skuOrdering = Number(attributeInfo.skuOrdering)
            }
            if (isNaN(attributeInfo.skuOrdering)) {
                TE("skuOrdering should be a number")
            }
            attribute.skuOrdering = attributeInfo.skuOrdering
        }

        if(isNotEmpty(attributeInfo.isOption)){
            if(typeof attributeInfo.isOption !== 'boolean'){
                TE("isOption should be a boolean")
            }
            attribute.isOption = attributeInfo.isOption
        }

        if(isNotEmpty(attributeInfo.variantsBasis)){
            if(typeof attributeInfo.variantsBasis !== 'boolean'){
                TE("variantsBasis should be a boolean")
            }
            attribute.variantsBasis = attributeInfo.variantsBasis
        }

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