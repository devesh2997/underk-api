import { Request, Response } from "express";
import { TO, ReE, ReS } from "../../utils";
import { EmailService } from "../../services/shared/email.service";

export class EmailController {
    static send = async (req:Request, res: Response): Promise<Response>=>{
        const body = req.body
        let err: string

        [err] = await TO(EmailService.send(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Email sent',
        },
            201)
    }
}