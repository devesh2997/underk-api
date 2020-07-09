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
  return validate(obj).then(errors => { // errors is an array of validation errors
    if (errors.length > 0) {
      let errObj: any = {}
      errors.forEach(err => {
        errObj[err.property] = err.constraints
      })
      throw new Error(JSON.stringify(errObj))
    }
  })
}


export const TO = async (promise: Promise<any>): Promise<[any, any]> => {
  let err, res
    ;[err, res] = await to(promise)
  if (err) return [err, null]

  return [null, res]
}


//generic version of TO (for type safety)
export const TOG = async <T>(promise: Promise<T>): Promise<[Error | undefined, T | undefined]> => {
  let err: Error
  let res: T
    ;[err, res] = await to<T>(promise)
  if (err) return [err, undefined]

  return [undefined, res]
}

// export const isEmpty = (o: any) => {
//   return o === null || o === undefined || (o !== undefined && o.length === 0)
// }

export const ReE = (res: Response, err: any, code: number) => {
  console.log(err)
  // Error Web Response
  if (typeof err == 'object' && typeof err.message != 'undefined') {
    err = err.message
  }

  if (typeof code !== 'undefined') res.statusCode = code

  return res.json({ success: false, error: err })
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

export const TE = (err: string | Error, log: boolean = true) => {
  // TE stands for Throw Error
  if (log === true) {
    console.error(err)
  }

  if (typeof err === 'string')
    throw new Error(err)

  else throw err
}

export const TIE = (err: any,) => {
  // TIE stands for Throw If Error
  if (isNotEmpty(err)) {
    throw err
  }
}
