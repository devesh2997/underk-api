import { Request, Response } from "express";
import { ReS, ReE, TOG } from "../../utils";
import { CollectionService } from "../../services/catalogue/collection.service";
import ApiError from "../../core/errors";

export class CollectionController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let result = await TOG(CollectionService.get(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: "Collection found",
            result: result.toJSON()
        }, 201)

    }

    static getAll = async (_: Request, res: Response): Promise<Response> => {

        let result = await TOG(CollectionService.getAll())

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: "Collections found",
            result: result.map(col => col.toJSON())
        }, 201)

    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let result = await TOG(CollectionService.delete(query))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: "Collection deleted",
            result: result.toJSON()
        }, 201)

    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body

        let result = await TOG(CollectionService.create(body))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: "Collection created",
            result: result.toJSON()
        }, 201)

    }

    static bulkCreate = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let result = await TOG(CollectionService.bulkCreate(body))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: 'Collections created : ' + result.entitiesCreated.length + ', Errors : ' + result.errors.length,
            result: result
        },
            201)

    }

    static update = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body

        let result = await TOG(CollectionService.update(body))

        if (result instanceof ApiError) return ReE(res, result, 422)

        return ReS(res, {
            message: "Collection updated",
            result: result.toJSON()
        }, 201)

    }
}