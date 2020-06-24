import { Request, Response } from "express";
import { TO, ReE, ReS } from "../../utils";
import UserAuthService, {
    SendOtpResponse,
    UserLoginResponse,
} from "../../services/user/auth.service";
import { User } from "entity/user/User";

export class UserAuthController {
    static findUser = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;
        let err: string;

        [err] = await TO(UserAuthService.findUser(body));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "User found",
            },
            201
        );
    };

    static sendOtp = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;
        let err: string, result: SendOtpResponse;

        [err, result] = await TO(UserAuthService.sendOtp(body));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "OTP sent",
                result,
            },
            201
        );
    };

    static verifyOtp = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;
        let err: string;

        [err] = await TO(UserAuthService.verifyOtp(body));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "OTP verified",
            },
            201
        );
    };

    static createUser = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;
        let err: string, user: User;

        [err, user] = await TO(UserAuthService.createUser(body));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "User created successfully",
                result: user.toJSON(),
            },
            201
        );
    };

    static login = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;
        let err: string, result: UserLoginResponse;

        [err, result] = await TO(UserAuthService.login(body));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Login successfull",
                result,
            },
            201
        );
    };

    static loginWithGoogle = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;
        let err: string, result: UserLoginResponse;

        [err, result] = await TO(UserAuthService.loginWithGoogle(body));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Login successfull",
                result,
            },
            201
        );
    };
}
