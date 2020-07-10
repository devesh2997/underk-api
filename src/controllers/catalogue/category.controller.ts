import { Request, Response } from "express";
import { ReS, ReE, TOG } from "../../utils";
import { CategoryService } from "../../services/catalogue/category.service";
import { Category } from "../../entity/catalogue/category";
import ApiError from "../../core/errors";

export class CategoryController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let result = await TOG<Category | ApiError>(CategoryService.get(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: "Category found",
            result: result.toJSON()
        }, 201)

    }

    static getAll = async (_: Request, res: Response): Promise<Response> => {
        let result = await TOG<Category[] | ApiError>(CategoryService.getAll())

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: "Categories found : " + result.length,
            result: result.map(cat => cat.toJSON())
        }, 201)

    }

    static getTrees = async (_: Request, res: Response): Promise<Response> => {
        let result = await TOG<Category[] | ApiError>(CategoryService.getTrees())

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: "Trees found : " + result.length,
            result: result.map(cat => cat.toJSON())
        }, 201)

    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let result = await TOG<Category | ApiError>(CategoryService.delete(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: "Category deleted",
            result: result.toJSON()
        }, 201)

    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let result = await TOG(CategoryService.create(body))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: 'Successfully created new category.',
            result: result.toJSON()
        },
            201)

    }

    static bulkCreate = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let result = await TOG(CategoryService.bulkCreate(body))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: 'Categories created : ' + result.entitiesCreated.length + ', Errors : ' + result.errors.length,
            result: result
        },
            201)

    }
}