class ApiError extends Error {
    constructor(message: string, name?: string, stackTrack?: string, errorCode?: number, statusCode?: number) {
        super(message)
        if (typeof name === 'string')
            this.name = name
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.stack = stackTrack
    }
    errorCode?: number
    statusCode?: number

    toResponseJSON = (sendStackTrace: boolean = false) => {
        let stackTrace
        if (sendStackTrace) {
            stackTrace = this.stack
        }
        return {
            message: this.message,
            name: this.name,
            errorCode: this.errorCode,
            statusCode: this.statusCode,
            stackTrace
        }
    }
}