import { Request, Response } from "express";
import { TO, ReS } from "../../utils";
import { CategoryService } from "../../services/catalogue/category.service";
import { Category } from "../../entity/catalogue/category";

export class CategoryController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let err: string, category: Category

        [err, category] = await TO(CategoryService.get(query))

        return ReS(res, {
            message: "Category found",
            category: category
        }, 201)

    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let err: string, category: Category

        [err, category] = await TO(CategoryService.delete(query))

        return ReS(res, {
            message: "Category deleted",
            category: category
        }, 201)

    }
}