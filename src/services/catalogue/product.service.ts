import { Warehouse } from 'entity/inventory/Warehouse';
import { WarehouseService } from './../inventory/warehouse.service';
import { CollectionService } from './collection.service';
import { CategoryService } from './category.service';
import { TypeService } from './type.service';
import { Collection } from './../../entity/catalogue/collection';
import { TOG, VE, CAE } from "../../utils";
import { isEmpty, isNotEmpty } from "class-validator";
import { Price, PriceJSON } from "../../entity/catalogue/Price";
import { SKUAttributeValue } from "../../entity/catalogue/SKUAttributeValue";
import { AttributeValue } from "../../entity/catalogue/AttributeValue";
import { OptionAttributeValue } from "../../entity/catalogue/OptionAttributeValue";
import { DimensionsJSON, Dimensions } from "../../entity/catalogue/Dimensions";
import ApiError from '../../core/errors';
import { SKU } from '../../entity/inventory/SKU';
import { ProductInventory } from '../../entity/inventory/ProductInventory';
import { Product } from '../../entity/catalogue/Product';
import { validateProductCreateInfo } from 'underk-utils';
import { Type } from '../../entity/catalogue/Type';
import { Category } from '../../entity/catalogue/category';

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
    static get = async (productInfo: any): Promise<Product | ApiError> => {
        if (isEmpty(productInfo.pid) && isEmpty(productInfo.slug)) {
            return CAE("Product id or slug not provided")
        }
        let res
        if (isNotEmpty(productInfo.pid)) {
            res = await TOG(Product.findOne({ pid: productInfo.pid }, { relations: ['type', 'subtype', 'category', 'collections', 'variants', 'attributes'] }))
        } else {
            res = await TOG(Product.findOne({ slug: productInfo.slug }, { relations: ['type', 'subtype', 'category', 'collections', 'variants', 'attributes'] }))
        }



        if (res instanceof ApiError) {
            return res
        }

        if (typeof res === 'undefined') {
            return CAE("Product not found")
        }

        return res
    }

    static delete = async (productInfo: any): Promise<Product | ApiError> => {
        if (isEmpty(productInfo.pid)) {
            return CAE("Product pid not provided")
        }

        let res = await TOG(Product.findOne({ pid: productInfo.pid }))

        if (res instanceof ApiError) {
            return res
        }

        if (typeof res === 'undefined') {
            return CAE("Product not found")
        }

        res = await TOG(res.remove())

        if (res instanceof ApiError) {
            return res
        }

        return res
    }

    static create = async (productInfo: ProductCreateInfo): Promise<Product | ApiError> => {

        const types = await TOG(TypeService.getAll())
        if (types instanceof ApiError) return types

        const categories = await TOG(CategoryService.getAll())
        if (categories instanceof ApiError) return categories;

        const collections = await TOG(CollectionService.getAll())
        if (collections instanceof ApiError) return collections;

        const warehouses = await TOG(WarehouseService.getAll())
        if (warehouses instanceof ApiError) return warehouses;

        return validateAndCreateProduct(productInfo, types, categories, collections, warehouses);

    }

    static bulkCreate = async (productsInfo: ProductCreateInfo[]): Promise<{ products: Product[], errors: ApiError[] } | ApiError> => {
        const types = await TOG(TypeService.getAll())
        if (types instanceof ApiError) return types

        const categories = await TOG(CategoryService.getAll())
        if (categories instanceof ApiError) return categories;

        const collections = await TOG(CollectionService.getAll())
        if (collections instanceof ApiError) return collections;

        const warehouses = await TOG(WarehouseService.getAll())
        if (warehouses instanceof ApiError) return warehouses;

        let products: Product[] = []
        let errors: ApiError[] = []

        // console.log(productsInfo)
        for (let i = 0; i < productsInfo.length; i++) {
            let result = await TOG(validateAndCreateProduct(productsInfo[i], types, categories, collections, warehouses))

            if (result instanceof ApiError) {
                errors.push(result)
            }
            else products.push(result)
        }

        // console.log(errors)

        return { products, errors }
    }

}

const validateAndCreateProduct = async (productInfo: ProductCreateInfo, types: Type[], categories: Category[], collections: Collection[], warehouses: Warehouse[]): Promise<Product | ApiError> => {

    const productValidationResult = validateProductCreateInfo(productInfo, types, categories, collections, warehouses)

    if (!productValidationResult.isValid) {
        if (typeof productValidationResult.error === undefined) {
            productValidationResult.error = "Some error occurred"
        }
        return CAE(productValidationResult.error as string)
    }


    //check for uniqueness of slug
    const productWithSameSlug = await TOG(Product.findOne({ slug: productInfo.slug }))
    if (productWithSameSlug instanceof ApiError) return productWithSameSlug
    if (typeof productWithSameSlug !== 'undefined') {
        return CAE(`Product with slug ${productInfo.slug} already exits`)
    }

    const validatedProduct = productValidationResult.product;

    if (typeof validatedProduct === 'undefined') return CAE("Product obj not returned after validation.")

    const productType = types.find((type) => type.id === validatedProduct.type.id)
    if (typeof productType === 'undefined') return CAE("Some error occurred while resolving type")

    const productSubtype = productType.subtypes.find((subtype) => subtype.id === validatedProduct.subtype.id)
    if (typeof productSubtype === 'undefined') return CAE("Some error occurred while resolving subtype")

    const productCategory = categories.find((cat) => cat.id === validatedProduct.category.id)
    if (typeof productCategory === 'undefined') return CAE("Some error occurred while resolving category")

    const productCollections: Collection[] = []
    validatedProduct.collections.forEach(col => productCollections.push(collections.find(c => c.id === col.id)!))


    const skus: SKU[] = []
    for (let i = 0; i < validatedProduct.skus.length; i++) {
        const vps = validatedProduct.skus[i]
        const sku = new SKU(vps.sku)
        sku.price = new Price(vps.price.currency, vps.price.listPrice, vps.price.salePrice, vps.price.taxPercent, vps.price.isInclusiveTax)
        sku.dimensions = new Dimensions(vps.dimensions.length, vps.dimensions.breadth, vps.dimensions.height, vps.dimensions.weight)
        const inventory: ProductInventory[] = [];
        for (let j = 0; j < vps.inventory.length; j++) {
            const vpsi = vps.inventory[j]
            const warehouse = warehouses.find(war => war.id === vpsi.warehouse.id)!
            inventory.push(new ProductInventory(warehouse, vpsi.stock, vpsi.reserved))
        }
        sku.inventory = inventory
        skus.push(sku)
    }

    const productAttributes: AttributeValue[] = []
    if (validatedProduct.attributes.length > 0) {
        if (typeof productInfo.productAttributeValues !== 'undefined') {
            for (let i = 0; i < productInfo.productAttributeValues.length!; i++) {
                const pai = productInfo.productAttributeValues[i]
                const productAttribute = productSubtype.attributes.find(attr => attr.name === pai.attributeName)!
                if (productAttribute.isMultiValued) {
                    const pAttributeValueNames = pai.attributeValueNames
                    if (typeof pAttributeValueNames !== 'undefined') {
                        for (let j = 0; j < pAttributeValueNames.length; j++) {
                            const productAttributeValue = productAttribute.values.find(attrv => attrv.name === pAttributeValueNames[j])!
                            productAttributes.push(productAttributeValue)
                        }
                    }

                } else {
                    const pAttributeValueName = pai.attributeValueName
                    const productAttributeValue = productAttribute.values.find(attrv => attrv.name === pAttributeValueName)!
                    productAttributes.push(productAttributeValue)
                }
            }

        }
    }

    const productSkuattributes: SKUAttributeValue[] = []
    for (let i = 0; i < productInfo.productSKUAttributeValues.length; i++) {
        const pai = productInfo.productSKUAttributeValues[i]
        const productSkuAttribute = productSubtype.skuAttributes.find(attr => attr.name === pai.skuAttributeName)!
        const pSkuAttributeValueName = pai.skuAttributeValueName
        const productSkuAttributeValue = productSkuAttribute.values.find(attrv => attrv.name === pSkuAttributeValueName)!
        productSkuattributes.push(productSkuAttributeValue)
    }

    const productOptionAttributes: OptionAttributeValue[] = []
    if (typeof productSubtype.optionAttribute !== 'undefined') {
        if (typeof productInfo.productOptionAttributeValues !== 'undefined') {
            for (let i = 0; i < productInfo.productOptionAttributeValues.length!; i++) {
                const pai = productInfo.productOptionAttributeValues[i]
                const productOptionAttributeValue = productSubtype.optionAttribute.values.find(attrv => attrv.name === pai.optionAttributeValueName)!
                productOptionAttributes.push(productOptionAttributeValue)
            }
        }

    }
    const product = new Product(validatedProduct.title, validatedProduct.slug, validatedProduct.status, productType, productSubtype, productCategory,)
    product.baseSKU = validatedProduct.baseSKU
    product.status = validatedProduct.status
    product.collections = productCollections
    product.attributes = productAttributes
    product.skuAttributes = productSkuattributes
    product.optionAttributes = productOptionAttributes

    let validationResult = await VE(product)
    if (validationResult instanceof ApiError) return validationResult

    let productSaveResult = await TOG(product.save())
    if (productSaveResult instanceof ApiError) return productSaveResult

    return productSaveResult
}




