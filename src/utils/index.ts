import { to } from "await-to-ts"
import { Response } from "express";
import { validate, isNotEmpty, isEmpty } from "class-validator";
import axios, { AxiosRequestConfig } from 'axios'


//makes http request with the given config
//if method is not provided, a get request is made
export const doRequest = async (config: AxiosRequestConfig) => {
  if (isEmpty(config.method)) {
    config.method = 'GET'
  }
  if (isEmpty(config.url)) {
    TE("url not provided for making request.")
  }
  let err: any, res
  [err, res] = await TO(axios(config))
  if (err) {
    console.log(err.response.data)
    throw err.toString()
  }
  if (res.status !== 200) {
    throw 'Some error occurred while requesting ' + config.url
  }
  if (res.status === 200) {
    return res.data
  }
}


// check if given fields are not empty in an object
//if empty field is detected through error if throwError flag is set
export const isAnyEmpty = (object: any, fields: string[], throwError: boolean = true) => {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    if (!object.hasOwnProperty(field) || isEmpty(object[field])) {
      if (throwError) {
        TE(`Please provide ${field}`)
      }
      return true
    }
  }
  return false
}

//validate for errors 
export const VE = async (obj: any) => {
  try {
    let errors = await validate(obj)
    if (errors.length > 0) {
      let errObj: any = {}
      errors.forEach(err => {
        errObj[err.property] = err.constraints
      })
      return new ApiError(JSON.stringify(errObj))
    }
    return
  } catch (e) {
    return createApiError(e)
  }
}


// export const TO = async (promise: Promise<any>): Promise<[any, any]> => {
//   let err, res
//     ;[err, res] = await to(promise)
//   if (err) return [err, null]

//   return [null, res]
// }

export const createApiError = (err: string | Error, errorCode?: number | undefined, statusCode?: number | undefined): ApiError => {
  let apiError: ApiError
  if (typeof err === 'undefined') {
    apiError = new ApiError(err, undefined, undefined, errorCode, statusCode)
  } else if (err instanceof Error) {
    apiError = new ApiError(err.message, err.name, err.stack, errorCode, statusCode)
  } else {
    apiError = new ApiError("Some Error occurred")
  }

  return apiError
}

//generic version of TO (for type safety)
export const TOG = async <T>(promise: Promise<T>): Promise<T | ApiError> => {
  try {
    return await promise
  } catch (e) {
    if (e instanceof ApiError) {
      return e
    } else if (e instanceof Error) {
      return new ApiError(e.message, e.name, e.stack)
    } else if (typeof e === 'string') {
      return new ApiError(e)
    } else {
      return new ApiError("Some error occurred")
    }
  }
}

// export const isEmpty = (o: any) => {
//   return o === null || o === undefined || (o !== undefined && o.length === 0)
// }

export const ReE = (res: Response, err: ApiError, code: number) => {
  console.log("Responding with error" + err)
  // Error Web Response
  if (typeof code !== 'undefined') res.statusCode = code

  return res.json({ success: false, error: err.toResponseJSON() })
}

export const ReS = (res: Response, data: any, code: number) => {
  // Success Web Response
  let send_data = { success: true }

  if (typeof data == 'object') {
    send_data = Object.assign(data, send_data) //merge the objects
  }

  if (typeof code !== 'undefined') res.statusCode = code

  return res.json(send_data)
}

// export const TE = (err: string | Error, log: boolean = true) => {
//   // TE stands for Throw Error
//   if (log === true) {
//     console.error(err)
//   }

//   if (typeof err === 'string')
//     throw new Error(err)

//   else throw err
// }

// export const RE = (err: string | Error, errorCode: number | undefined, statusCode: number | undefined, log: boolean = true) => {
//   // RE stands for return ApiError
//   if (log === true) {
//     console.error(err)
//   }

//   if (typeof err === 'string')
//     return new ApiError(err, errorCode, statusCode)
//   else if (err instanceof Error)
//     return new ApiError()

//   else return err
// }

// export const TIE = (err: any,) => {
//   // TIE stands for Throw If Error
//   if (isNotEmpty(err)) {
//     throw err
//   }
// }
