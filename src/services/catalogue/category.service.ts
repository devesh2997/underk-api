import { Category, CategoryJSON } from "../../entity/catalogue/category"
import { isEmpty, TE, TO } from "../../utils"
import { isNotEmpty } from "class-validator"

type CategoryCreateInfo = {
    slug: string,
    parentSlug: string,
    name: string
    sku: string
}

export class CategoryService {

    static get = async (categoryInfo: any): Promise<CategoryJSON> | never => {
        let err, category: Category

        if (isEmpty(categoryInfo.slug)) {
            TE("Category slug not provided")
        }

        [err, category] = await TO(Category.findOne({ slug: categoryInfo.slug }))
        if (err) {
            TE(err)
        }

        if(typeof category === 'undefined'){
            TE("Category not found")
        }

        return category.toJSON()

    }


    static create = async (categoryInfo: CategoryCreateInfo): Promise<CategoryJSON> | never => {
        let err: any, parent: Category, category: Category
        if (isEmpty(categoryInfo.slug) || isEmpty(categoryInfo.name) || isEmpty(categoryInfo.sku)) {
            TE("Missing fields")
        }

        category = new Category(categoryInfo.slug, categoryInfo.sku, categoryInfo.name)
        if (isNotEmpty(categoryInfo.parentSlug)) {
            [err, parent] = await TO(Category.findOne({ slug: categoryInfo.slug }))
            if (err || !parent) {
                TE("Parent with given slug not found")
            }
            category.parent = parent
        }

        [err] = await TO(Category.insert(category))
        if (err) {
            TE(err)
        }

        return category.toJSON()


    }
}