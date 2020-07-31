import { Request, Response } from "express";
import { TOG, ReE, ReS } from "../../utils";
import { EmailService } from "../../services/shared/email.service";
import ApiError from "../../core/errors";

export class EmailController {
    static send = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;

        let err = await TOG<null | ApiError>(EmailService.send(body));
        if (err instanceof ApiError) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Email sent",
            },
            201
        );
    };
}
