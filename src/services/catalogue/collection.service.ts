import { Collection, CollectionJSON } from "../../entity/catalogue/collection"
import { isEmpty } from "class-validator"
import { BulkCreateResult } from "../../entity/shared/BulkCreateResult"
import { CAE, TOG, VE } from "../../utils"
import { InsertResult, UpdateResult } from "typeorm"
import ApiError from "../../core/errors"

export class CollectionService {

    static get = async (collectionInfo: any): Promise<Collection | ApiError> => {
        if (isEmpty(collectionInfo.slug)) {
            return CAE("Collection slug not provided")
        }

        let res = await TOG(Collection.findOne({ slug: collectionInfo.slug }))
        if (res instanceof ApiError) {
            return res
        }

        if (typeof res === 'undefined') {
            return CAE("Collection not found")
        }

        return res

    }

    static getAll = async (): Promise<Collection[] | ApiError> => {

        let res = await TOG<Collection[]>(Collection.find())
        if (res instanceof ApiError) {
            return res
        }

        return res

    }

    static delete = async (collectionInfo: any): Promise<Collection | ApiError> => {

        if (isEmpty(collectionInfo.slug)) {
            return CAE("Collection slug not provided")
        }

        let res = await TOG<Collection | undefined>(Collection.findOne({ slug: collectionInfo.slug }))
        if (res instanceof ApiError) {
            return res
        }

        if (typeof res === 'undefined') {
            return CAE("Collection not found")
        }

        res = await TOG<Collection>(res.remove())

        if (res instanceof ApiError) {
            return res
        }

        return res

    }

    static create = async (collectionInfo: CollectionJSON): Promise<Collection | ApiError> => {
        if (isEmpty(collectionInfo.slug) || isEmpty(collectionInfo.name)) {
            return CAE("Missing fields")
        }

        const collection = new Collection(collectionInfo.slug, collectionInfo.name);

        let res = await TOG<InsertResult>(Collection.insert(collection))
        if (res instanceof ApiError) {
            return res
        }

        return collection

    }

    static bulkCreate = async (collectionsInfo: CollectionJSON[]): Promise<BulkCreateResult<CollectionJSON> | ApiError> => {
        if (typeof collectionsInfo !== 'object') {
            return CAE("Invalid request data format")
        }
        const errors: any[] = []
        const collectionsJSON: CollectionJSON[] = []
        for (let i = 0; i < collectionsInfo.length; i++) {
            let collectionInfo = collectionsInfo[i];

            let res = await TOG<Collection | ApiError>(CollectionService.create(collectionInfo))
            if (res instanceof ApiError) {
                errors.push({ index: i, error: res.toResponseJSON() })
            } else {
                collectionsJSON.push(res.toJSON())
            }
        }

        return { errors, entitiesCreated: collectionsJSON }

    }

    static update = async (collectionInfo: CollectionJSON): Promise<Collection | ApiError> => {
        if (isEmpty(collectionInfo.slug)) {
            return CAE("Collection slug not provided")
        }

        const existingCollection = await TOG<Collection | undefined>(Collection.findOne({ slug: collectionInfo.slug }))
        if (existingCollection instanceof ApiError) return existingCollection
        if (typeof existingCollection === 'undefined') {
            return CAE("Category not found.")
        }

        const existingCollectionJSON = existingCollection.toJSON()

        delete collectionInfo.id

        Object.assign(existingCollectionJSON, collectionInfo)

        const collection = Collection.fromJson(existingCollectionJSON)

        const validationResult = await VE(collection);
        if (validationResult instanceof ApiError) return validationResult;

        const res = await TOG<UpdateResult>(Collection.update({ slug: collection.slug }, collection))
        if (res instanceof ApiError) {
            return res
        }

        return collection

    }
}