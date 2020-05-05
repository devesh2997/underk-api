import { to } from "await-to-ts"
import { Response } from "express";
import { validate, isNotEmpty } from "class-validator";


//validate for errors 
export const VE = async (obj: any) => {
  return validate(obj).then(errors => { // errors is an array of validation errors
    if (errors.length > 0) {
      let errObj: any = {}
      errors.forEach(err => {
        errObj[err.property] = err.constraints
      })
      throw errObj
    }
  })
}


export const TO = async (promise: Promise<any>): Promise<[any, any]> => {
  let err, res
    ;[err, res] = await to(promise)
  if (err) return [err, null]

  return [null, res]
}

export const isEmpty = (o: any) => {
  return o === null || o === undefined || (o !== undefined && o.length === 0)
}

export const ReE = (res: Response, err: any, code: number) => {
  // Error Web Response
  console.log(err)
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

export const TE = (err_message: string, log: boolean = true) => {
  // TE stands for Throw Error
  if (log === true) {
    console.error(err_message)
  }

  throw err_message
}

export const TIE = (err: any,) => {
  // TIE stands for Throw If Error
  if(isNotEmpty(err)){
    throw err
  }
}
