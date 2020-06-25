import { Category, CategoryJSON } from "../../entity/catalogue/category"
import { TE, TO } from "../../utils"
import { isNotEmpty, isEmpty } from "class-validator"
import { getManager } from "typeorm"
import { BulkCreateResult } from "entity/shared/BulkCreateResult"

type CategoryCreateInfo = {
    slug: string,
    parentSlug: string,
    name: string
}

export type CategoryTree = {
    id: string,
    slug: string,
    name: string,
    children: CategoryTree[]
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

        if (typeof category === 'undefined') {
            TE("Category not found")
        }

        let ancestors: Category[]
        const manager = getManager();
        [err, ancestors] = await TO(manager.getTreeRepository(Category).findAncestors(category));
        if (ancestors) {
            ancestors = ancestors.filter(a => a.slug !== category.slug)
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
        if (isEmpty(categoryInfo.slug) || isEmpty(categoryInfo.name)) {
            TE("Missing fields")
        }

        category = new Category(categoryInfo.slug, categoryInfo.name)
        if (isNotEmpty(categoryInfo.parentSlug) && categoryInfo.parentSlug.length > 0) {
            [err, parent] = await TO(Category.findOne({ slug: categoryInfo.parentSlug }))
            if (err || !parent) {
                TE(`Parent with given slug ${categoryInfo.parentSlug} not found`)
            }
            console.log(parent)
            category.parent = parent
            console.log(category)
        }

        [err] = await TO(Category.save(category))
        if (err) {
            TE(err)
        }

        return category.toJSON()


    }

    static bulkCreate = async (categoriesInfo: CategoryCreateInfo[]): Promise<BulkCreateResult<CategoryJSON>> | never => {
        if (typeof categoriesInfo !== 'object') {
            TE("Invalid request data format")
        }
        let errors: any[] = []
        let categoriesJSON: CategoryJSON[] = []
        for (let i = 0; i < categoriesInfo.length; i++) {
            let err: any, categoryJSON: CategoryJSON
            let categoryInfo = categoriesInfo[i];

            [err, categoryJSON] = await TO(CategoryService.create(categoryInfo))
            if (err) {
                errors.push({ index: i, error: err })
            } else {
                categoriesJSON.push(categoryJSON)
            }
        }

        return { errors, entitiesCreated: categoriesJSON }

    }
}