import { Request, Response } from "express";
import { TO, ReS, ReE } from "../../utils";
import { CategoryService, CategoryTree } from "../../services/catalogue/category.service";
import { Category } from "../../entity/catalogue/category";

export class CategoryController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let err: string, category: Category

        [err, category] = await TO(CategoryService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: "Category found",
            category: category
        }, 201)

    }

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let err: string, categories: Category[]

        [err, categories] = await TO(CategoryService.getAll())

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: "Categories found : "+categories.length,
            categories: categories
        }, 201)

    }

    static getTrees = async (_: Request, res: Response): Promise<Response> => {
        let err: string, categories: CategoryTree[]

        [err, categories] = await TO(CategoryService.getTrees())

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: "Trees found : "+categories.length,
            categories: categories
        }, 201)

    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let err: string, category: Category

        [err, category] = await TO(CategoryService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: "Category deleted",
            category: category
        }, 201)

    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, category: Category

        [err, category] = await TO(CategoryService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Successfully created new category.',
            category: category
        },
            201)

    }
}