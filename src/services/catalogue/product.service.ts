import { ProductJSON, Product } from "../../entity/catalogue/Product";
import { TE, TO, VE } from "../../utils";
import { Subtype } from "../../entity/catalogue/Subtype";
import { isEmpty, isNotEmpty } from "class-validator";

export class ProductService {
    static get = async (productInfo: any): Promise<ProductJSON> | never => {
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

        return product.toJSON()
    }

    static delete = async (productInfo: any): Promise<ProductJSON> | never => {
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

        return product.toJSON()
    }

    // static create = async (productInfo: any): Promise<ProductJSON> | never => {
    //     let err: any, product: Product

        
    // }


}