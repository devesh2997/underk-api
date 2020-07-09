import { OptionAttribute } from './../../entity/catalogue/OptionAttribute';
import { Collection } from './../../entity/catalogue/collection';
import { ProductJSON, Product } from "../../entity/catalogue/Product";
import { TE, TO, VE } from "../../utils";
import { Subtype } from "../../entity/catalogue/Subtype";
import { isEmpty, isNotEmpty } from "class-validator";
import { Price, PriceJSON } from "../../entity/catalogue/Price";
import { Type } from "../../entity/catalogue/Type";
import { Category } from "../../entity/catalogue/category";
import { SKUAttributeValue } from "../../entity/catalogue/SKUAttributeValue";
import { AttributeValue } from "../../entity/catalogue/AttributeValue";
import { OptionAttributeValue } from "../../entity/catalogue/OptionAttributeValue";
import { DimensionsJSON, Dimensions } from "../../entity/catalogue/Dimensions";
import { Warehouse } from 'entity/inventory/Warehouse';
import { Attribute } from 'entity/catalogue/Attribute';
import { SKUAttribute } from 'entity/catalogue/SKUAttribute';

export type ProductCreateInfo = {
    title: string
    slug: string
    typeName: string
    subtypeName: string
    categorySlug: string
    collectionsSlugs: string[]
    productAttributeValues?: {
        attributeName: string,
        attributeValueName?: string
        attributeValueNames?: string[]
    }[]
    productSKUAttributeValues: {
        skuAttributeName: string,
        skuAttributeValueName: string
    }[]
    productOptionAttributeValues?: {
        optionAttributeValueName: string,
        optionAttributeValueDimensions: DimensionsJSON,
        optionAttributeValuePrice: PriceJSON,
        optionAttributeValueInventory?: {
            warehouseCode: string,
            stock: number
        }[]
    }[],
    price?: PriceJSON,
    productDimensions?: DimensionsJSON,
    productInventory?: {
        warehouseCode: string,
        stock: number
    }[]

}

export class ProductService {
    static get = async (productInfo: any): Promise<Product> | never => {
        let err: any, product: Product

        if (isEmpty(productInfo.pid)) {
            TE("Product id not provided")
        }

        [err, product] = await TO(Product.findOne({ pid: productInfo.pid }, { relations: ['type', 'subtype', 'category', 'collections', 'variants', 'attributes'] }))

        if (err) {
            TE(err)
        }

        if (typeof product === 'undefined') {
            TE("Product not found")
        }

        return product
    }

    static delete = async (productInfo: any): Promise<Product> | never => {
        let err: any, product: Product

        if (isEmpty(productInfo.pid)) {
            TE("Product pid not provided")
        }

        [err, product] = await TO(Product.findOne({ pid: productInfo.pid }))

        if (err) {
            TE(err)
        }

        if (typeof product === 'undefined') {
            TE("Product not found")
        }

        [err] = await TO(Product.remove(product))

        if (err) {
            TE(err)
        }

        return product
    }

    static create = async (productInfo: ProductCreateInfo): Promise<Product> | never => {
        let err: any, product: Product

        let types: Type[], categories: Category[], collections: Collection[], warehouses: Warehouse[];

        [err, types] = await TO(Type.find({ relations: ["subtypes", "subtypes.attributes", "subtypes.attributes.values", "subtypes.optionAttributes", "subtypes.optionAttributes.values", "subtypes.skuAttributes", "subtypes.skuAttributes.values"] }))
        if (err) TE(err);

        [err, categories] = await TO(Category.find())
        if (err) TE(err);

        [err, collections] = await TO(Collection.find())
        if (err) TE(err);

        [err, warehouses] = await TO(Warehouse.find())
        if (err) TE(err);

        let productValidationResult = validateProductCreateInfo(productInfo, types, categories, collections, warehouses)

        if (!productValidationResult.isValid) {
            if (typeof productValidationResult.error === undefined) {
                productValidationResult.error = "Some error occurred"
            }
            TE(productValidationResult.error as string)
        }

        //check for uniqueness of slug
        let productWithSameSlug: Product
        [err, productWithSameSlug] = await TO(Product.findOne({ slug: productInfo.slug }))
        if (err) TE(err)
        if (typeof productWithSameSlug !== 'undefined') {
            TE("Product with same slug already exits")
        }
    }
}


const findSKUOrderforSKUAttributeValue = (skuAttributes: SKUAttribute[], skuAttributeValue: SKUAttributeValue): number => {
    const skuAttribute = skuAttributes.find(sa => typeof sa.values.find(val => val == skuAttributeValue) !== 'undefined')
    if (typeof skuAttribute === 'undefined') {
        TE(`No skuAttribute found which has value ${skuAttributeValue.name}`)
    } return skuAttribute?.skuOrdering as number
}
const createProductBaseSKU = (type: Type, subtype: Subtype, skuAttributeValues: SKUAttributeValue[]): string => {
    if (typeof type === 'undefined' || typeof subtype === 'undefined' || typeof skuAttributeValues === 'undefined') {
        TE("type, subtype or skuAttributeValues not provided")
    }
    if (typeof subtype.skuAttributes === 'undefined') {
        TE("subtype must contain skuAttributes")
    }
    let baseSKU = ""
    baseSKU += type.sku
    baseSKU += `-${subtype.sku}`
    skuAttributeValues.sort((a, b) => findSKUOrderforSKUAttributeValue(subtype.skuAttributes, a) - findSKUOrderforSKUAttributeValue(subtype.skuAttributes, b))
    for (let i = 0; i < skuAttributeValues.length; i++) {
        baseSKU += `-${skuAttributeValues[i].sku}`
    }
    return baseSKU
}







