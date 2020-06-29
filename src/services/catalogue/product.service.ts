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
import { DimensionsJSON } from "../../entity/catalogue/Dimensions";
import { OptionAttribute } from "entity/catalogue/OptionAttribute";

export type ProductCreateInfo = {
    slug: string
    title: string
    status: string
    typeName: string
    subtypeName: string
    categorySlug: string
    collectionsSlugs: string[]
    productAttributeValues: {
        attributeName: string,
        attributeValueName?: string
        attributeValueNames?: string[]
    }[]
    productSKUAttributeValues: {
        skuAttributeName: string,
        skuAttributeValueName: string
    }[]
    productOptionAttributeValues: {
        optionAttributeValueName: string,
        optionAttributeValueDimension: DimensionsJSON,
        optionAttributeValuePrice: PriceJSON,
        optionAttributeValueInventory: {
            warehouseCode: string,
            stock: number
        }[]
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

        if (isEmpty(productInfo.typeName)) {
            TE("Type Name not provided")
        }
        if (isEmpty(productInfo.subtypeName)) {
            TE("Subtype Name not provided")
        }
        if (isEmpty(productInfo.categorySlug)) {
            TE("Category Slug not provided")
        }

        let baseSKU = ""
        let type: Type, subtype: Subtype, category: Category
        const { typeName, subtypeName, categorySlug } = productInfo;
        [err, type] = await TO(Type.find({ name: typeName }))
        if (err) TE(err)
        if (isEmpty(type)) {
            TE("Type with given name not found.")
        }
        baseSKU = baseSKU += type.sku;

        [err, subtype] = await TO(Subtype.findOne({ type: type, name: subtypeName }, { relations: ['type', 'attributes', 'attributes.values', 'optionAttributes', 'optionAttributes.values', 'skuAttributes', 'skuAttributes.values'] }))
        if (err) TE(err)
        if (isEmpty(subtype)) {
            TE("Subtype with given name not found.")
        }
        baseSKU += "-" + subtype.sku;

        [err, category] = await TO(Category.findOne({ slug: categorySlug }))
        if (err) TE(err)
        if (isEmpty(category)) {
            TE("Category with given slug not found.")
        }

        let skuAttributes: SKUAttributeValue[] = []
        let attributes: AttributeValue[] = []
        let optionAttributes: OptionAttributeValue[] = []
        const { productAttributeValues, productSKUAttributeValues, productOptionAttributeValues } = productInfo
        if (isEmpty(productSKUAttributeValues)) {
            TE("SKU attribute values cannot be empty")
        }
        subtype.skuAttributes.forEach((sa) => {
            const productSKUAttribute = productSKUAttributeValues.find((psav) => psav.skuAttributeName === sa.name)
            if (typeof productSKUAttribute === 'undefined') {
                TE(`Value of sku attribute ${sa.name} not provided`)
            } else {
                const productSKUAttributeValue = sa.values.find((sav) => sav.name === productSKUAttribute.skuAttributeValueName)
                if (typeof productSKUAttributeValue === 'undefined') {
                    TE(`Value for sku attribute ${sa.name} does not exist`)
                } else {
                    baseSKU += "-" + productSKUAttributeValue.sku
                    skuAttributes.push(productSKUAttributeValue)
                }
            }
        })
        if (isNotEmpty(subtype.optionAttribute)) {
            if (isEmpty(productOptionAttributeValues) || productOptionAttributeValues.length === 0) {
                TE("Atleast one option must be provided")
            }
            productOptionAttributeValues.forEach((poav) => {
                const subtypeOptionAttributeValue = subtype.optionAttribute.values.find((v) => v.name === poav.optionAttributeValueName)
                if (typeof subtypeOptionAttributeValue === 'undefined') {
                    TE(`No subtype option attribute value exists named ${poav.optionAttributeValueName}`)
                } else {
                    
                    optionAttributes.push(subtypeOptionAttributeValue)
                }
            })
        }
        productAttributeValues.forEach((a) => {
            const subtypeAttribute = subtype.attributes.find((sa) => sa.name === a.attributeName)
            if (typeof subtypeAttribute === 'undefined') {
                TE(`Attribute with name ${a.attributeName} Not found`)
            } else {
                const subtypeAttributeValue = subtypeAttribute.values.find((sav) => sav.name === a.attributeValueName)
                if (typeof subtypeAttributeValue === 'undefined') {
                    TE(`Attribute value with name ${a.attributeValueName} Not found`)
                } else {
                    attributes.push(subtypeAttributeValue)
                }
            }

        })

        const { title, slug, status } = productInfo
        product = new Product(title, slug, status, type, subtype, category, prices)
        await VE(product)




    }
}


