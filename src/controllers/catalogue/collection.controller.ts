import { Request, Response } from "express";
import { TO, ReS, ReE } from "../../utils";
import { CollectionService } from "../../services/catalogue/collection.service";
import { Collection, CollectionJSON } from "../../entity/catalogue/collection";
import { BulkCreateResult } from "entity/shared/BulkCreateResult";

export class CollectionController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let err: string, collection: Collection

        [err, collection] = await TO(CollectionService.get(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: "Collection found",
            result: collection,
            error: err
        }, 201)

    }

    static getAll = async (_: Request, res: Response): Promise<Response> => {

        let err: string, collections: CollectionJSON[]

        [err, collections] = await TO(CollectionService.getAll())

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: "Collections found",
            result: collections,
            error: err
        }, 201)

    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let err: string, collection: Collection

        [err, collection] = await TO(CollectionService.delete(query))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: "Collection deleted",
            result: collection,
            error: err
        }, 201)

    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body

        let err: string, collection: Collection

        [err, collection] = await TO(CollectionService.create(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: "Collection created",
            result: collection,
            error: err
        }, 201)

    }

    static bulkCreate = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, bulkCreateResult: BulkCreateResult<Collection>

        [err, bulkCreateResult] = await TO(CollectionService.bulkCreate(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Collections created : ' + bulkCreateResult.entitiesCreated.length + ', Errors : ' + bulkCreateResult.errors.length,
            result: bulkCreateResult
        },
            201)

    }

    static update = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body

        let err: string, collection: Collection

        [err, collection] = await TO(CollectionService.update(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: "Collection updated",
            result: collection,
            error: err
        }, 201)

    }
}