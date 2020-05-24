import { Collection, CollectionJSON } from "../../entity/catalogue/collection"
import { TE, TO, VE } from "../../utils"
import { isEmpty } from "class-validator"
import { BulkCreateResult } from "entity/shared/BulkCreateResult"

export class CollectionService {

    static get = async (collectionInfo: any): Promise<CollectionJSON> | never => {
        let err, collection: Collection

        if (isEmpty(collectionInfo.slug)) {
            TE("Collection slug not provided")
        }

        [err, collection] = await TO(Collection.findOne({ slug: collectionInfo.slug }))
        if (err) {
            TE(err)
        }

        if (typeof collection === 'undefined') {
            TE("Collection not found")
        }

        return collection.toJSON()

    }

    static getAll = async (): Promise<CollectionJSON[]> | never => {
        let err, collections: Collection[]

        [err, collections] = await TO(Collection.find())
        if (err) {
            TE(err)
        }

        if (typeof collections === 'undefined') {
            TE("Collections not found")
        }

        return collections.map(c => c.toJSON())

    }

    static delete = async (collectionInfo: any): Promise<CollectionJSON> | never => {
        let err, collection: Collection

        if (isEmpty(collectionInfo.slug)) {
            TE("Collection slug not provided")
        }

        [err, collection] = await TO(Collection.findOne({ slug: collectionInfo.slug }))
        if (err) {
            TE(err)
        }

        if (typeof collection === 'undefined') {
            TE("Collection not found")
        }

        [err, collection] = await TO(Collection.remove(collection))

        if (err) {
            TE(err)
        }

        return collection.toJSON()

    }

    static create = async (collectionInfo: CollectionJSON): Promise<CollectionJSON> | never => {
        let err: any, collection: Collection
        if (isEmpty(collectionInfo.slug) || isEmpty(collectionInfo.name)) {
            TE("Missing fields")
        }

        collection = new Collection(collectionInfo.slug, collectionInfo.name);

        [err] = await TO(Collection.insert(collection))
        if (err) {
            TE(err)
        }

        return collection.toJSON()

    }

    static bulkCreate = async (collectionsInfo: CollectionJSON[]): Promise<BulkCreateResult<CollectionJSON>> | never => {
        if (typeof collectionsInfo !== 'object') {
            TE("Invalid request data format")
        }
        let errors: any[] = []
        let collectionsJSON: CollectionJSON[] = []
        for (let i = 0; i < collectionsInfo.length; i++) {
            let err: any, collectionJSON: CollectionJSON
            let collectionInfo = collectionsInfo[i];

            [err, collectionJSON] = await TO(CollectionService.create(collectionInfo))
            if (err) {
                errors.push({ index: i, error: err })
            } else {
                collectionsJSON.push(collectionJSON)
            }
        }

        return { errors, entitiesCreated: collectionsJSON }

    }

    static update = async (collectionInfo: CollectionJSON): Promise<CollectionJSON> | never => {
        let err: any, collection: Collection
        if (isEmpty(collectionInfo.slug)) {
            TE("Collection slug not provided")
        }

        let existingCollection: Collection
        [err, existingCollection] = await TO(Collection.findOne({ slug: collectionInfo.slug }))
        if (err || !existingCollection) {
            TE("Collection does not exist")
        }

        const existingCollectionJSON = existingCollection.toJSON()

        Object.assign(existingCollectionJSON, collectionInfo)

        collection = Collection.fromJson(existingCollectionJSON)
        await VE(collection);

        [err] = await TO(Collection.update({ slug: collection.slug }, collection))
        if (err) {
            TE(err)
        }

        return collection.toJSON()

    }
}