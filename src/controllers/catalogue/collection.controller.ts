import { Request, Response } from "express";
import { TO, ReS } from "../../utils";
import { CollectionService } from "../../services/catalogue/collection.service";
import { Collection, CollectionJSON } from "../../entity/catalogue/collection";

export class CollectionController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let err: string, collection: Collection

        [err, collection] = await TO(CollectionService.get(query))

        return ReS(res, {
            message: "Collection found",
            collection: collection
        }, 201)

    }

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query

        let err: string, collection: Collection

        [err, collection] = await TO(CollectionService.delete(query))

        return ReS(res, {
            message: "Collection deleted",
            collection: collection
        }, 201)

    }
    
    static create = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body

        let err: string, collection: Collection

        [err, collection] = await TO(CollectionService.create(body))

        return ReS(res, {
            message: "Collection created",
            collection: collection
        }, 201)

    }

    static update = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body

        let err: string, collection: Collection

        [err, collection] = await TO(CollectionService.update(body))

        return ReS(res, {
            message: "Collection updated",
            collection: collection
        }, 201)

    }
    
    static createMultiple = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body as CollectionJSON[]

        let errs: string[] = [], collections: Collection[] = []

        for(let i=0; i<body.length; i++) {

            let err: string, collection: Collection
            [err, collection] = await TO(CollectionService.create(body[i]))

            errs.push(err);
            collections.push(collection)
        }

        return ReS(res, {
            message: "Collections created",
            collections: collections
        }, 201)

    }
}