import { Request, Response } from "express";
import { TOG, ReE, ReS } from "../../utils";
import UserAuthService, {
    SendOtpResponse,
    UserLoginResponse,
} from "../../services/user/auth.service";
import { User } from "entity/user/User";
import ApiError from "../../core/errors";

export class UserAuthController {
    static findUser = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;

        let result = await TOG<User | ApiError>(UserAuthService.findUser(body));
        if (result instanceof ApiError) return ReE(res, result, 422);

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

        let result = await TOG<SendOtpResponse | ApiError>(
            UserAuthService.sendOtp(body)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

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

        let err = await TOG<void | ApiError>(UserAuthService.verifyOtp(body));
        if (err instanceof ApiError) return ReE(res, err, 422);

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

        let result = await TOG<User | ApiError>(
            UserAuthService.createUser(body)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "User created successfully",
                result: result.toJSON(),
            },
            201
        );
    };

    static login = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;

        let result = await TOG<UserLoginResponse | ApiError>(
            UserAuthService.login(body)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

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

        let result = await TOG<UserLoginResponse | ApiError>(
            UserAuthService.loginWithGoogle(body)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

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
