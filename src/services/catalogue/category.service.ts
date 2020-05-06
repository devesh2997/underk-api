import { Category, CategoryJSON } from "../../entity/catalogue/category"
import { isEmpty, TE, TO } from "../../utils"
import { isNotEmpty } from "class-validator"
import { getManager } from "typeorm"

type CategoryCreateInfo = {
    slug: string,
    parentSlug: string,
    name: string
    sku: string
}

export type CategoryTree = {
    id: string,
    slug: string,
    sku: string,
    name: string,
    children: CategoryTree[]
}

export class CategoryService {

    static get = async (categoryInfo: any): Promise<CategoryJSON> | never => {
        let err, category: Category

        if (isEmpty(categoryInfo.slug)) {
            TE("Category slug not provided")
        }

        [err, category] = await TO(Category.findOne({ slug: categoryInfo.slug }, { relations: ['parent', 'children'] }))
        if (err) {
            TE(err)
        }
        
        if (typeof category === 'undefined') {
            TE("Category not found")
        }

        let ancestors: Category[]
        const manager = getManager();
        [err, ancestors] = await TO(manager.getTreeRepository(Category).findAncestors(category));
        if(ancestors){
            category.ancestors = ancestors
        }
        

        return category.toJSON()

    }

    static getAll = async (): Promise<CategoryJSON[]> | never => {
        let err, categories: Category[]

        [err, categories] = await TO(Category.find())
        if (err) {
            TE(err)
        }

        if (typeof categories === 'undefined') {
            TE("No category not found")
        }

        return categories.map(category => category.toJSON())

    }

    static getTrees = async (): Promise<CategoryTree[]> | never => {
        let err, categories: CategoryTree[]

        const manager = getManager();
        [err, categories] = await TO(manager.getTreeRepository(Category).findTrees());
        console.log(categories)
        if (err) {
            TE(err)
        }

        if (typeof categories === 'undefined') {
            TE("No category not found")
        }

        return categories

    }



    static delete = async (categoryInfo: any): Promise<CategoryJSON> | never => {
        let err, category: Category

        if (isEmpty(categoryInfo.slug)) {
            TE("Category slug not provided")
        }

        [err, category] = await TO(Category.findOne({ slug: categoryInfo.slug }))
        if (err) {
            TE(err)
        }

        if (typeof category === 'undefined') {
            TE("Category not found")
        }

        [err, category] = await TO(Category.remove(category))

        if (err) {
            TE(err)
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
            [err, parent] = await TO(Category.findOne({ slug: categoryInfo.parentSlug }))
            if (err || !parent) {
                TE("Parent with given slug not found")
            }
            console.log(parent)
            category.parent = parent
            console.log(category)
        }

        [err] = await TO(Category.insert(category))
        if (err) {
            TE(err)
        }

        return category.toJSON()


    }
}