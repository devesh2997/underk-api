import { isEmpty, isNotEmpty } from "class-validator"
import { TE, TO, doRequest } from "../../utils"
import { Sms } from "../../entity/shared/Sms"

const TEXT_LOCAL_API_KEY = 'Bcw1ZQcdduc-lKzbGpgxa9OxpF98MVdFm3OmruznQo'

let url = 'https://api.textlocal.in/send/?apikey=' +
    TEXT_LOCAL_API_KEY +
    '&numbers='

type textLocalError = {
    code: number,
    message: string
}

type textlocalResponse = {
    status: string,
    errors: textLocalError[],
    cost: number | undefined
}

export class SmsService {
    static send = async (numbers: string[], message: string) => {
        let err: any, textLocalApiResponse: textlocalResponse
        if (isEmpty(numbers) || numbers.length === 0) {
            TE("Numbers not provided for sending sms")
        }
        if (isEmpty(message)) {
            TE("message not provided for sending sms.")
        }
        let fullUrl = url
        for (let i = 0; i < numbers.length; i++) {
            const mobile = numbers[i]
            fullUrl += mobile
            if (i !== numbers.length) {
                fullUrl += ','
            }
        }
        fullUrl += '&sender=' +
            'underK' +
            '&message=' +
            message + '&test=true'

            ;[err, textLocalApiResponse] = await TO(doRequest({ url: fullUrl }))

        if (err) {
            TE(err)
        }

        let errors: string[] = []
        if (isNotEmpty(textLocalApiResponse.errors)) {
            errors = textLocalApiResponse.errors.map(err => err.message)
        }

        let sms: Sms = new Sms(numbers, message, textLocalApiResponse.status, textLocalApiResponse.cost, errors)

            ;[err] = await TO(sms.save())

        if (err) {
            TE(err)
        }
    }
}

