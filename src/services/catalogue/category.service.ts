import { Category, CategoryJSON } from "../../entity/catalogue/category"
import { isNotEmpty, isEmpty } from "class-validator"
import { getManager } from "typeorm"
import { BulkCreateResult } from "../../entity/shared/BulkCreateResult"
import { CAE, TOG } from "../../utils"

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

    static get = async (categoryInfo: any): Promise<Category | ApiError> => {
        let category: Category

        if (isEmpty(categoryInfo.slug)) {
            return CAE("Category slug not provided")
        }

        let res = await TOG<Category | undefined>(Category.findOne({ slug: categoryInfo.slug }))

        if (res instanceof ApiError) {
            return res
        } else if (typeof res === 'undefined') {
            return CAE("Category not found")
        }

        category = res
        let ancestors: Category[] | ApiError
        const manager = getManager();
        ancestors = await TOG<Category[]>(manager.getTreeRepository(Category).findAncestors(category));
        if (ancestors instanceof ApiError) {
            return res
        } else {
            if (ancestors) {
                ancestors = ancestors.filter(a => a.slug !== category.slug)
                category.ancestors = ancestors
            }
            return category
        }

    }

    static getAll = async (): Promise<Category[] | ApiError> => {

        let res = await TOG<Category[]>(Category.find())
        if (res instanceof ApiError)
            return res

        return res
    }

    static getTrees = async (): Promise<Category[] | ApiError> => {
        const manager = getManager();
        let res = await TOG<Category[]>(manager.getTreeRepository(Category).findTrees());
        console.log(res)
        if (res instanceof ApiError) {
            return res
        }

        return res
    }



    static delete = async (categoryInfo: any): Promise<Category | ApiError> => {
        if (isEmpty(categoryInfo.slug)) {
            return CAE("Category slug not provided")
        }

        let res = await TOG<Category | undefined>(Category.findOne({ slug: categoryInfo.slug }))
        if (res instanceof ApiError) {
            return res
        }

        if (typeof res === 'undefined') {
            return CAE("Category not found")
        }

        res = await TOG<Category>(Category.remove(res))

        if (res instanceof ApiError) {
            return res
        }

        return res

    }


    static create = async (categoryInfo: CategoryCreateInfo): Promise<Category | ApiError> => {
        let category: Category
        if (isEmpty(categoryInfo.slug) || isEmpty(categoryInfo.name)) {
            return CAE("Missing fields")
        }

        category = new Category(categoryInfo.slug, categoryInfo.name)
        if (isNotEmpty(categoryInfo.parentSlug) && categoryInfo.parentSlug.length > 0) {
            let parent = await TOG<Category | undefined>(Category.findOne({ slug: categoryInfo.parentSlug }))
            if (parent instanceof ApiError || typeof parent === 'undefined') {
                return CAE(`Parent with given slug ${categoryInfo.parentSlug} not found`)
            }
            console.log(parent)
            category.parent = parent
            console.log(category)
        }

        let res = await TOG<Category>(Category.save(category))
        if (res instanceof ApiError) return res

        return res
    }

    static bulkCreate = async (categoriesInfo: CategoryCreateInfo[]): Promise<BulkCreateResult<CategoryJSON> | ApiError> => {
        if (typeof categoriesInfo !== 'object') {
            return CAE("Invalid request data format")
        }
        let errors: any[] = []
        let categoriesJSON: CategoryJSON[] = []
        for (let i = 0; i < categoriesInfo.length; i++) {
            let categoryInfo = categoriesInfo[i];

            let res = await TOG<Category | ApiError>(CategoryService.create(categoryInfo))
            if (res instanceof ApiError) {
                errors.push({ index: i, error: res })
            } else {
                categoriesJSON.push(res.toJSON())
            }
        }

        return { errors, entitiesCreated: categoriesJSON }

    }
}