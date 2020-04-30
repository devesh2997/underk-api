import { Request, Response } from "express";
import { ReS, isEmpty } from "../utils";
import axios from 'axios';

export class PincodeController {
    static checkAvailability = async (req: Request, res: Response): Promise<Response> => {
        let err = ""
        let pincodeJSON = {
            cash: false,
            prepaid: false,
            isInvalid: true
        }

        const pincode = req.query.pincode
        if (isEmpty(pincode)) {
            err = "Pincode not provided"
        }

        if (!err) {
            const token = 'd78510174c7cfec25075415bd3e2781ba09cee42'
            const url = `https://api.delhivery.com/c/api/pin-codes/json/?token=${token}&filter_codes=${pincode}`

            try {
                const response = await axios.get(url)

                const result = response.data['delivery_codes'][0]
                if (result) {
                    pincodeJSON.cash = result['postal_code']['cash'] === 'Y'
                    pincodeJSON.prepaid = result['postal_code']['pre_paid'] === 'Y'
                    pincodeJSON.isInvalid = false
                }
            } catch (error) {
                if (error.message) {
                    err = error.message
                }
            }
        }

        return ReS(res, {
            message: "",
            pincode: pincodeJSON,
            error: err
        }, 201)

    }
}
