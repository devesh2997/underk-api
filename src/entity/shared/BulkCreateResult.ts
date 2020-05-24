export type BulkCreateError = {
    index: number,
    error: any
}

export type BulkCreateResult<T> = {
    errors: BulkCreateError[],
    entitiesCreated: T[]
}