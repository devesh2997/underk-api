import { isEmpty } from "class-validator"
import { TE, TO, doRequest } from "../../utils"
import { Sms } from "../../entity/shared/Sms"

const TEXT_LOCAL_API_KEY = 'Bcw1ZQcdduc-lKzbGpgxa9OxpF98MVdFm3OmruznQo'

let url = 'https://api.textlocal.in/send/?apikey=' +
    TEXT_LOCAL_API_KEY +
    '&numbers='

type mobile = {
    mobileCountryCode: string
    mobileNumber: number
}

export const send = async (numbers: mobile[], sender: string, message: string) => {
    let err: any, messageApiResponse: any, smss: Sms[]
    if (isEmpty(numbers) || numbers.length === 0) {
        TE("Numbers not provided for sending sms")
    }
    if (isEmpty(sender)) {
        TE("sender not provided for sending sms")
    }
    if (isEmpty(message)) {
        TE("message not provided for sending sms.")
    }

    smss = []
    let fullUrl = url
    for (let i = 0; i < numbers.length; i++) {
        const mobile = numbers[i]
        let number = mobile.mobileCountryCode + '' + mobile.mobileNumber
        fullUrl += number
        if (i !== numbers.length) {
            fullUrl += ','
        }
        smss.push(new Sms(mobile.mobileCountryCode, mobile.mobileNumber, message))
    }
    fullUrl += '&sender=' +
        'underK' +
        '&message=' +
        message + '&test=true'

        ;[err, messageApiResponse] = await TO(doRequest({ url: fullUrl }))

    if (err) {
        TE(err)
    }

    console.log(messageApiResponse)


}