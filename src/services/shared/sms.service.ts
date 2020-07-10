import { isEmpty, isNotEmpty } from "class-validator";
import { CAE, TOG, doRequest } from "../../utils";
import { Sms } from "../../entity/shared/Sms";
import ApiError from "../../core/errors";

const TEXT_LOCAL_API_KEY = "Bcw1ZQcdduc-lKzbGpgxa9OxpF98MVdFm3OmruznQo";

let url =
    "https://api.textlocal.in/send/?apikey=" + TEXT_LOCAL_API_KEY + "&numbers=";

type textLocalError = {
    code: number;
    message: string;
};

type textlocalResponse = {
    status: string;
    errors: textLocalError[];
    cost: number | undefined;
};

export class SmsService {
    static send = async (numbers: string[], message: string) => {
        if (isEmpty(numbers) || numbers.length === 0) {
            return CAE("Numbers not provided for sending sms");
        }
        if (isEmpty(message)) {
            return CAE("message not provided for sending sms.");
        }
        let fullUrl = url;
        for (let i = 0; i < numbers.length; i++) {
            const mobile = numbers[i];
            fullUrl += mobile;
            if (i !== numbers.length) {
                fullUrl += ",";
            }
        }
        fullUrl += "&sender=" + "underK" + "&message=" + message + "&test=true";
        let textLocalApiResponse = await TOG<textlocalResponse | ApiError>(
            doRequest({ url: fullUrl })
        );

        if (textLocalApiResponse instanceof ApiError) {
            return textLocalApiResponse;
        }

        let errors: string[] = [];
        if (isNotEmpty(textLocalApiResponse.errors)) {
            errors = textLocalApiResponse.errors.map((err) => err.message);
        }

        let sms: Sms = new Sms(
            numbers,
            message,
            textLocalApiResponse.status,
            textLocalApiResponse.cost,
            errors
        );

        let res = await TOG<Sms>(sms.save());

        if (res instanceof ApiError) {
            return res;
        }
    };
}
