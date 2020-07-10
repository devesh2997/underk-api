import { User } from "../../entity/user/User";
import { isEmpty, isNotEmpty } from "class-validator";
import { CAE, TOG, VE } from "../../utils";
import { SmsOtp } from "../../entity/shared/SmsOtp";
import { SmsService } from "../shared/sms.service";
import { EmailService } from "../shared/email.service";
import { EmailOtp } from "../../entity/shared/EmailOtp";
import { addMinutes, generateOtp } from "underk-utils";
import bcrypt from "bcryptjs";
import { OAuth2Client, LoginTicket, TokenPayload } from "google-auth-library";
import ApiError from "../../core/errors";

export type SendOtpResponse = {
    mobileCountryCode?: string;
    mobileNumber?: number;
    email?: string;
    sentTime: number;
    delayUntilResend: number;
};

export type UserLoginResponse = {
    uuid: string;
    token: string;
    mobileCountryCode: string;
    mobileNumber: number;
    email: string;
};

const CLIENT_ID = "";

export default class UserAuthService {
    static findUser = async (userInfo: {
        mobileCountryCode?: string;
        mobileNumber?: number;
        email?: string;
    }): Promise<User | ApiError> => {
        if (
            (isEmpty(userInfo.mobileCountryCode) ||
                isEmpty(userInfo.mobileNumber)) &&
            isEmpty(userInfo.email)
        ) {
            return CAE("Mobile number or email not provided");
        }

        let users: User[] | ApiError;
        if (isNotEmpty(userInfo.email)) {
            users = await TOG<User[]>(
                User.find({
                    email: userInfo.email,
                })
            );
        } else {
            users = await TOG<User[]>(
                User.find({
                    mobileCountryCode: userInfo.mobileCountryCode,
                    mobileNumber: userInfo.mobileNumber,
                })
            );
        }
        if (users instanceof ApiError) return users;

        let user: User | undefined;
        if (users.length === 0) {
            return CAE("User doesn't exist");
        } else if (users.length === 1) {
            user = users[0];
        } else {
            return CAE("Critical error");
        }

        return user!;
    };

    static sendOtptoPhoneNumber = async (
        mobileCountryCode?: string,
        mobileNumber?: number
    ): Promise<SendOtpResponse | ApiError> => {
        if (isEmpty(mobileCountryCode) || isEmpty(mobileNumber)) {
            return CAE("Mobile number not provided");
        }

        const mobile = mobileCountryCode + "" + mobileNumber;
        const otp = generateOtp();

        let smsOtp = await TOG<SmsOtp | undefined>(
            SmsOtp.findOne({ mobile: mobile })
        );
        if (smsOtp instanceof ApiError) return smsOtp;

        if (typeof smsOtp !== "undefined") {
            const timeDiffInSeconds =
                (new Date().getTime() - smsOtp.updated_at.getTime()) / 1000;
            if (timeDiffInSeconds < 30) {
                return CAE("Wait for 30 seconds and try again.");
            }
            smsOtp.otp = otp;
            smsOtp.expiry = addMinutes(new Date(), 20);
            smsOtp.verified = false;
        } else {
            smsOtp = new SmsOtp(mobile, otp, addMinutes(new Date(), 20), false);
        }

        smsOtp = await TOG<SmsOtp>(smsOtp.save());
        if (smsOtp instanceof ApiError) return smsOtp;

        const otpMessage = "Your otp from underK is : " + otp;
        let err = await TOG<void | ApiError>(
            SmsService.send([mobile], otpMessage)
        );
        if (err instanceof ApiError) return err;

        return {
            mobileCountryCode,
            mobileNumber,
            sentTime: smsOtp.updated_at.getTime(),
            delayUntilResend: 30,
        };
    };

    static sendOtptoEmail = async (
        email?: string
    ): Promise<SendOtpResponse | ApiError> => {
        if (isEmpty(email)) {
            return CAE("Email not provided");
        }

        const otp = generateOtp();

        let emailOtp = await TOG<EmailOtp | undefined>(
            EmailOtp.findOne({ email: email })
        );
        if (emailOtp instanceof ApiError) return emailOtp;

        if (typeof emailOtp !== "undefined") {
            const timeDiffInSeconds =
                (new Date().getTime() - emailOtp.updated_at.getTime()) / 1000;
            if (timeDiffInSeconds < 30) {
                return CAE("Wait for 30 seconds and try again.");
            }
            emailOtp.otp = otp;
            emailOtp.expiry = addMinutes(new Date(), 20);
            emailOtp.verified = false;
        } else {
            emailOtp = new EmailOtp(
                email!,
                otp,
                addMinutes(new Date(), 20),
                false
            );
        }

        emailOtp = await TOG<EmailOtp>(emailOtp.save());
        if (emailOtp instanceof ApiError) return emailOtp;

        let err = await TOG<void | ApiError>(
            EmailService.send({
                from: "no-reply@underk.in",
                to: email!,
                subject: "underK OTP for login",
                text: `Your OTP from underK is : ${otp}`,
            })
        );
        if (err instanceof ApiError) return err;

        return {
            email,
            sentTime: emailOtp.updated_at.getTime(),
            delayUntilResend: 30,
        };
    };

    static sendOtp = async (userInfo: {
        mobileCountryCode?: string;
        mobileNumber?: number;
        email?: string;
    }): Promise<SendOtpResponse | ApiError> => {
        if (
            (isEmpty(userInfo.mobileCountryCode) ||
                isEmpty(userInfo.mobileNumber)) &&
            isEmpty(userInfo.email)
        ) {
            return CAE("Mobile number or email not provided");
        }

        let res: SendOtpResponse | ApiError;
        if (isNotEmpty(userInfo.email)) {
            res = await TOG<SendOtpResponse | ApiError>(
                UserAuthService.sendOtptoEmail(userInfo.email)
            );
        } else {
            res = await TOG<SendOtpResponse | ApiError>(
                UserAuthService.sendOtptoPhoneNumber(
                    userInfo.mobileCountryCode,
                    userInfo.mobileNumber
                )
            );
        }
        if (res instanceof ApiError) return res;

        return res;
    };

    static verifyEmailOtp = async (
        email?: string,
        otp?: string
    ): Promise<void | ApiError> => {
        if (isEmpty(email)) {
            return CAE("Email not provided");
        }
        if (isEmpty(otp)) {
            return CAE("OTP not provided");
        }

        let emailOtp = await TOG<EmailOtp | undefined>(
            EmailOtp.findOne({ email: email })
        );
        if (emailOtp instanceof ApiError) return emailOtp;

        if (typeof emailOtp === "undefined") {
            return CAE("Invalid request");
        }
        if (emailOtp.otp !== otp) {
            return CAE("Invalid OTP");
        }
        if (emailOtp.expiry < new Date()) {
            return CAE("OTP expired");
        }

        emailOtp.expiry = new Date();
        emailOtp.verified = true;

        emailOtp = await TOG<EmailOtp>(emailOtp.save());
        if (emailOtp instanceof ApiError) return emailOtp;
    };

    static verifySmsOtp = async (
        mobileCountryCode?: string,
        mobileNumber?: number,
        otp?: string
    ): Promise<void | ApiError> => {
        if (isEmpty(mobileCountryCode) || isEmpty(mobileNumber)) {
            return CAE("Mobile number not provided");
        }
        if (isEmpty(otp)) {
            return CAE("OTP not provided");
        }

        const mobile = mobileCountryCode + "" + mobileNumber;

        let smsOtp = await TOG<SmsOtp | undefined>(
            SmsOtp.findOne({ mobile: mobile })
        );
        if (smsOtp instanceof ApiError) return smsOtp;

        if (typeof smsOtp === "undefined") {
            return CAE("Invalid request");
        }
        if (smsOtp.otp !== otp) {
            return CAE("Invalid OTP");
        }
        if (smsOtp.expiry < new Date()) {
            return CAE("OTP expired");
        }

        smsOtp.expiry = new Date();
        smsOtp.verified = true;

        smsOtp = await TOG<SmsOtp>(smsOtp.save());
        if (smsOtp instanceof ApiError) return smsOtp;
    };

    static verifyOtp = async (userInfo: {
        mobileCountryCode?: string;
        mobileNumber?: number;
        email?: string;
        otp?: string;
    }): Promise<void | ApiError> => {
        if (
            (isEmpty(userInfo.mobileCountryCode) ||
                isEmpty(userInfo.mobileNumber)) &&
            isEmpty(userInfo.email)
        ) {
            return CAE("Mobile number or email not provided");
        }
        if (isEmpty(userInfo.otp)) {
            return CAE("OTP not provided");
        }

        let err: void | ApiError;
        if (isNotEmpty(userInfo.email)) {
            err = await TOG<void | ApiError>(
                UserAuthService.verifyEmailOtp(userInfo.email, userInfo.otp)
            );
        } else {
            err = await TOG<void | ApiError>(
                UserAuthService.verifySmsOtp(
                    userInfo.mobileCountryCode,
                    userInfo.mobileNumber,
                    userInfo.otp
                )
            );
        }
        if (err instanceof ApiError) return err;
    };

    static createUser = async (userInfo: {
        mobileCountryCode?: string;
        mobileNumber?: number;
        email?: string;
        password?: string;
        idToken?: string;
    }): Promise<User | ApiError> => {
        if (
            isEmpty(userInfo.mobileCountryCode) ||
            isEmpty(userInfo.mobileNumber)
        ) {
            return CAE("Mobile number not provided");
        }
        if (isEmpty(userInfo.email) && isEmpty(userInfo.idToken)) {
            return CAE("Email or id_token not provided");
        }
        if (isEmpty(userInfo.password)) {
            return CAE("Password not provided");
        }

        let payload: TokenPayload | undefined;
        if (isNotEmpty(userInfo.idToken)) {
            const client = new OAuth2Client(CLIENT_ID);

            let ticket = await TOG<LoginTicket>(
                client.verifyIdToken({
                    idToken: userInfo.idToken!,
                    audience: CLIENT_ID,
                })
            );
            if (ticket instanceof ApiError) return ticket;

            payload = ticket.getPayload();
            if (isEmpty(payload)) {
                return CAE("Something went wrong");
            }
            if (isEmpty(payload!.email)) {
                return CAE("Email not provided by google");
            }

            userInfo.email = payload!.email;
        }

        let users = await TOG<User[]>(
            User.find({
                mobileCountryCode: userInfo.mobileCountryCode,
                mobileNumber: userInfo.mobileNumber,
            })
        );
        if (users instanceof ApiError) return users;
        if (users.length > 0) {
            return CAE(
                "Another user account is associated with this mobile number"
            );
        }

        users = await TOG<User[]>(
            User.find({
                email: userInfo.email,
            })
        );
        if (users instanceof ApiError) return users;
        if (users.length > 0) {
            return CAE("Another user account is associated with this email");
        }

        let user = new User();
        user.email = userInfo.email!;
        user.mobileCountryCode = userInfo.mobileCountryCode!;
        user.mobileNumber = userInfo.mobileNumber!;
        user.password = userInfo.password!;

        if (isNotEmpty(userInfo.idToken)) {
            user.emailVerified = true;
            if (isNotEmpty(payload!.given_name)) {
                user.firstName = payload!.given_name!;
            }
            if (isNotEmpty(payload!.family_name)) {
                user.lastName = payload!.family_name!;
            }
            if (isNotEmpty(payload!.picture)) {
                user.picUrl = payload!.picture!;
            }
        } else {
            const mobile =
                userInfo.mobileCountryCode + "" + userInfo.mobileNumber;
            let smsOtp = await TOG<SmsOtp | undefined>(
                SmsOtp.findOne({ mobile: mobile })
            );
            if (smsOtp instanceof ApiError) return smsOtp;

            let emailOtp = await TOG<EmailOtp | undefined>(
                EmailOtp.findOne({ email: userInfo.email })
            );
            if (emailOtp instanceof ApiError) return emailOtp;

            if (
                !(
                    (typeof smsOtp !== "undefined" && smsOtp.verified) ||
                    (typeof emailOtp !== "undefined" && emailOtp.verified)
                )
            ) {
                return CAE("None of the mobile number and email is verified");
            }

            user.mobileVerified =
                typeof smsOtp !== "undefined" && smsOtp.verified;
            user.emailVerified =
                typeof emailOtp !== "undefined" && emailOtp.verified;
        }

        await VE(user);

        let salt = await TOG<string>(bcrypt.genSalt(10));
        if (salt instanceof ApiError) return salt;

        let hash = await TOG<string>(bcrypt.hash(user.password, salt));
        if (hash instanceof ApiError) return hash;

        user.password = hash;

        let res = await TOG<User>(User.save(user));
        if (res instanceof ApiError) {
            return res;
        }

        res = await TOG<User | ApiError>(
            UserAuthService.findUser({
                mobileCountryCode: userInfo.mobileCountryCode,
                mobileNumber: userInfo.mobileNumber,
                email: userInfo.email,
            })
        );
        if (res instanceof ApiError) {
            return res;
        }

        return res;
    };

    static login = async (userInfo: {
        mobileCountryCode?: string;
        mobileNumber?: number;
        email?: string;
        otp?: string;
        password?: string;
    }): Promise<UserLoginResponse | ApiError> => {
        if (
            (isEmpty(userInfo.mobileCountryCode) ||
                isEmpty(userInfo.mobileNumber)) &&
            isEmpty(userInfo.email)
        ) {
            return CAE("Mobile number or email not provided");
        }
        if (isEmpty(userInfo.otp) && isEmpty(userInfo.password)) {
            return CAE("Password or OTP not provided");
        }

        let user = await TOG<User | ApiError>(
            UserAuthService.findUser({
                mobileCountryCode: userInfo.mobileCountryCode,
                mobileNumber: userInfo.mobileNumber,
                email: userInfo.email,
            })
        );
        if (user instanceof ApiError) return user;

        if (isNotEmpty(userInfo.otp)) {
            let err = await TOG<void | ApiError>(
                UserAuthService.verifyOtp(userInfo)
            );
            if (err instanceof ApiError) return err;
        } else {
            user = await TOG<User | ApiError>(
                user.comparePassword(userInfo.password!)
            );
            if (user instanceof ApiError) return user;
        }

        return {
            uuid: user.uuid,
            token: user.getJWT(),
            mobileCountryCode: user.mobileCountryCode,
            mobileNumber: user.mobileNumber,
            email: user.email,
        };
    };

    static loginWithGoogle = async (userInfo: {
        idToken?: string;
    }): Promise<UserLoginResponse | ApiError> => {
        if (isEmpty(userInfo.idToken)) {
            return CAE("id_token not provided");
        }

        const client = new OAuth2Client(CLIENT_ID);

        let ticket = await TOG<LoginTicket>(
            client.verifyIdToken({
                idToken: userInfo.idToken!,
                audience: CLIENT_ID,
            })
        );
        if (ticket instanceof ApiError) return ticket;

        const payload = ticket.getPayload();
        if (isEmpty(payload)) {
            return CAE("Something went wrong");
        }
        if (isEmpty(payload!.email)) {
            return CAE("Email not provided by google");
        }

        let user = await TOG<User | ApiError>(
            UserAuthService.findUser({ email: payload!.email })
        );
        if (user instanceof ApiError) return user;

        return {
            uuid: user.uuid,
            token: user.getJWT(),
            mobileCountryCode: user.mobileCountryCode,
            mobileNumber: user.mobileNumber,
            email: user.email,
        };
    };
}
