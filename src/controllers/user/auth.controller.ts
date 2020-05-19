import { Request, Response } from "express";
import { TO, ReE, ReS } from "../../utils";
import UserAuthService, { UserLoginInfo } from "../../services/user/auth.service";

export class UserAuthController {
    static sendOtp = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, otp: number

        [err, otp] = await TO(UserAuthService.sendOTP(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'OTP sent',
            otp: otp
        },
            201)
    }

    static signInWithPhoneNumber = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, loginInfo: UserLoginInfo

        [err, loginInfo] = await TO(UserAuthService.signInWithPhoneNumber(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Login successfull',
            loginInfo: loginInfo
        },
            201)
    }

    static verifyEmailOtpAndSignIn = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body
        let err: string, loginInfo: UserLoginInfo

        [err, loginInfo] = await TO(UserAuthService.verifyEmailOtpAndSignIn(body))

        if (err) return ReE(res, err, 422)

        return ReS(res, {
            message: 'Login successfull',
            loginInfo: loginInfo
        },
            201)
    }
}