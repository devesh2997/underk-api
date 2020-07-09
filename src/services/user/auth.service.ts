import { User } from "../../entity/user/User";
import { isEmpty, isNotEmpty } from "class-validator";
import { TE, TO, VE } from "../../utils";
import { SmsOtp } from "../../entity/shared/SmsOtp";
import { SmsService } from "../shared/sms.service";
import { EmailService } from "../shared/email.service";
import { EmailOtp } from "../../entity/shared/EmailOtp";
import { addMinutes, generateOtp } from "underk-utils";
import bcrypt from "bcryptjs";
import { OAuth2Client, LoginTicket, TokenPayload } from "google-auth-library";

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
    }): Promise<User> => {
        if (
            (isEmpty(userInfo.mobileCountryCode) ||
                isEmpty(userInfo.mobileNumber)) &&
            isEmpty(userInfo.email)
        ) {
            TE("Mobile number or email not provided");
        }

        let err: any, users: User[];
        if (isNotEmpty(userInfo.email)) {
            [err, users] = await TO(
                User.find({
                    email: userInfo.email,
                })
            );
        } else {
            [err, users] = await TO(
                User.find({
                    mobileCountryCode: userInfo.mobileCountryCode,
                    mobileNumber: userInfo.mobileNumber,
                })
            );
        }
        if (err) TE(err);

        let user: User | undefined;
        if (users.length === 0) {
            TE("User doesn't exist");
        } else if (users.length === 1) {
            user = users[0];
        } else {
            TE("Critical error");
        }

        return user!;
    };

    static sendOtptoPhoneNumber = async (
        mobileCountryCode?: string,
        mobileNumber?: number
    ): Promise<SendOtpResponse> => {
        if (isEmpty(mobileCountryCode) || isEmpty(mobileNumber)) {
            TE("Mobile number not provided");
        }

        const mobile = mobileCountryCode + "" + mobileNumber;
        const otp = generateOtp();

        let err: any, smsOtp: SmsOtp;
        [err, smsOtp] = await TO(SmsOtp.findOne({ mobile: mobile }));
        if (err) TE(err);

        if (isNotEmpty(smsOtp)) {
            const timeDiffInSeconds =
                (new Date().getTime() - smsOtp.updated_at.getTime()) / 1000;
            if (timeDiffInSeconds < 30) {
                TE("Wait for 30 seconds and try again.");
            }
            smsOtp.otp = otp;
            smsOtp.expiry = addMinutes(new Date(), 20);
            smsOtp.verified = false;
        } else {
            smsOtp = new SmsOtp(mobile, otp, addMinutes(new Date(), 20), false);
        }

        [err, smsOtp] = await TO(smsOtp.save());
        if (err) TE(err);

        const otpMessage = "Your otp from underK is : " + otp;
        [err] = await TO(SmsService.send([mobile], otpMessage));
        if (err) TE(err);

        return {
            mobileCountryCode,
            mobileNumber,
            sentTime: smsOtp.updated_at.getTime(),
            delayUntilResend: 30,
        };
    };

    static sendOtptoEmail = async (
        email?: string
    ): Promise<SendOtpResponse> => {
        if (isEmpty(email)) {
            TE("Email not provided");
        }

        const otp = generateOtp();

        let err: any, emailOtp: EmailOtp;
        [err, emailOtp] = await TO(EmailOtp.findOne({ email: email }));
        if (err) TE(err);

        if (isNotEmpty(emailOtp)) {
            const timeDiffInSeconds =
                (new Date().getTime() - emailOtp.updated_at.getTime()) / 1000;
            if (timeDiffInSeconds < 30) {
                TE("Wait for 30 seconds and try again.");
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

        [err, emailOtp] = await TO(emailOtp.save());
        if (err) TE(err);

        [err] = await TO(
            EmailService.send({
                from: "no-reply@underk.in",
                to: email!,
                subject: "underK OTP for login",
                text: `Your OTP from underK is : ${otp}`,
            })
        );
        if (err) TE(err);

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
    }): Promise<SendOtpResponse> => {
        if (
            (isEmpty(userInfo.mobileCountryCode) ||
                isEmpty(userInfo.mobileNumber)) &&
            isEmpty(userInfo.email)
        ) {
            TE("Mobile number or email not provided");
        }

        let err: any, res: SendOtpResponse;
        if (isNotEmpty(userInfo.email)) {
            [err, res] = await TO(
                UserAuthService.sendOtptoEmail(userInfo.email)
            );
        } else {
            [err, res] = await TO(
                UserAuthService.sendOtptoPhoneNumber(
                    userInfo.mobileCountryCode,
                    userInfo.mobileNumber
                )
            );
        }
        if (err) TE(err);

        return res;
    };

    static verifyEmailOtp = async (
        email?: string,
        otp?: string
    ): Promise<void> => {
        if (isEmpty(email)) {
            TE("Email not provided");
        }
        if (isEmpty(otp)) {
            TE("OTP not provided");
        }

        let err: any, emailOtp: EmailOtp;
        [err, emailOtp] = await TO(EmailOtp.findOne({ email: email }));
        if (err) TE(err);

        if (isEmpty(emailOtp)) {
            TE("Invalid request");
        }
        if (emailOtp.otp !== otp) {
            TE("Invalid OTP");
        }
        if (emailOtp.expiry < new Date()) {
            TE("OTP expired");
        }

        emailOtp.expiry = new Date();
        emailOtp.verified = true;

        [err] = await TO(emailOtp.save());
        if (err) TE(err);
    };

    static verifySmsOtp = async (
        mobileCountryCode?: string,
        mobileNumber?: number,
        otp?: string
    ): Promise<void> => {
        if (isEmpty(mobileCountryCode) || isEmpty(mobileNumber)) {
            TE("Mobile number not provided");
        }
        if (isEmpty(otp)) {
            TE("OTP not provided");
        }

        const mobile = mobileCountryCode + "" + mobileNumber;

        let err: any, smsOtp: SmsOtp;
        [err, smsOtp] = await TO(SmsOtp.findOne({ mobile: mobile }));
        if (err) TE(err);

        if (isEmpty(smsOtp)) {
            TE("Invalid request");
        }
        if (smsOtp.otp !== otp) {
            TE("Invalid OTP");
        }
        if (smsOtp.expiry < new Date()) {
            TE("OTP expired");
        }

        smsOtp.expiry = new Date();
        smsOtp.verified = true;

        [err] = await TO(smsOtp.save());
        if (err) TE(err);
    };

    static verifyOtp = async (userInfo: {
        mobileCountryCode?: string;
        mobileNumber?: number;
        email?: string;
        otp?: string;
    }): Promise<void> => {
        if (
            (isEmpty(userInfo.mobileCountryCode) ||
                isEmpty(userInfo.mobileNumber)) &&
            isEmpty(userInfo.email)
        ) {
            TE("Mobile number or email not provided");
        }
        if (isEmpty(userInfo.otp)) {
            TE("OTP not provided");
        }

        let err: any;
        if (isNotEmpty(userInfo.email)) {
            [err] = await TO(
                UserAuthService.verifyEmailOtp(userInfo.email, userInfo.otp)
            );
        } else {
            [err] = await TO(
                UserAuthService.verifySmsOtp(
                    userInfo.mobileCountryCode,
                    userInfo.mobileNumber,
                    userInfo.otp
                )
            );
        }
        if (err) TE(err);
    };

    static createUser = async (userInfo: {
        mobileCountryCode?: string;
        mobileNumber?: number;
        email?: string;
        password?: string;
        idToken?: string;
    }): Promise<User> => {
        if (
            isEmpty(userInfo.mobileCountryCode) ||
            isEmpty(userInfo.mobileNumber)
        ) {
            TE("Mobile number not provided");
        }
        if (isEmpty(userInfo.email) && isEmpty(userInfo.idToken)) {
            TE("Email or id_token not provided");
        }
        if (isEmpty(userInfo.password)) {
            TE("Password not provided");
        }

        let err: any, payload: TokenPayload | undefined;
        if (isNotEmpty(userInfo.idToken)) {
            const client = new OAuth2Client(CLIENT_ID);

            let err: any, ticket: LoginTicket;
            [err, ticket] = await TO(
                client.verifyIdToken({
                    idToken: userInfo.idToken!,
                    audience: CLIENT_ID,
                })
            );
            if (err) TE(err);

            payload = ticket.getPayload();
            if (isEmpty(payload)) {
                TE("Something went wrong");
            }
            if (isEmpty(payload!.email)) {
                TE("Email not provided by google");
            }

            userInfo.email = payload!.email;
        }

        let users: User[];

        [err, users] = await TO(
            User.find({
                mobileCountryCode: userInfo.mobileCountryCode,
                mobileNumber: userInfo.mobileNumber,
            })
        );
        if (err) TE(err);
        if (users.length > 0) {
            TE("Another user account is associated with this mobile number");
        }

        [err, users] = await TO(
            User.find({
                email: userInfo.email,
            })
        );
        if (err) TE(err);
        if (users.length > 0) {
            TE("Another user account is associated with this email");
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
            let smsOtp: SmsOtp;
            [err, smsOtp] = await TO(SmsOtp.findOne({ mobile: mobile }));
            if (err) TE(err);

            let emailOtp: EmailOtp;
            [err, emailOtp] = await TO(
                EmailOtp.findOne({ email: userInfo.email })
            );
            if (err) TE(err);

            if (
                !(
                    (isNotEmpty(smsOtp) && smsOtp.verified) ||
                    (isNotEmpty(emailOtp) && emailOtp.verified)
                )
            ) {
                TE("None of the mobile number and email is verified");
            }

            user.mobileVerified = isNotEmpty(smsOtp) && smsOtp.verified;
            user.emailVerified = isNotEmpty(emailOtp) && emailOtp.verified;
        }

        await VE(user);

        let salt, hash;
        [err, salt] = await TO(bcrypt.genSalt(10));
        if (err) TE(err.message, true);

        [err, hash] = await TO(bcrypt.hash(user.password, salt));
        if (err) TE(err.message, true);

        user.password = hash;

        [err] = await TO(User.save(user));
        if (err) {
            TE("Some error occurred");
        }

        [err, user] = await TO(
            UserAuthService.findUser({
                mobileCountryCode: userInfo.mobileCountryCode,
                mobileNumber: userInfo.mobileNumber,
                email: userInfo.email,
            })
        );
        if (err) {
            TE("Some error occurred");
        }

        return user;
    };

    static login = async (userInfo: {
        mobileCountryCode?: string;
        mobileNumber?: number;
        email?: string;
        otp?: string;
        password?: string;
    }): Promise<UserLoginResponse> => {
        if (
            (isEmpty(userInfo.mobileCountryCode) ||
                isEmpty(userInfo.mobileNumber)) &&
            isEmpty(userInfo.email)
        ) {
            TE("Mobile number or email not provided");
        }
        if (isEmpty(userInfo.otp) && isEmpty(userInfo.password)) {
            TE("Password or OTP not provided");
        }

        let err: any, user: User;
        [err, user] = await TO(
            UserAuthService.findUser({
                mobileCountryCode: userInfo.mobileCountryCode,
                mobileNumber: userInfo.mobileNumber,
                email: userInfo.email,
            })
        );
        if (err) TE(err);

        if (isNotEmpty(userInfo.otp)) {
            [err] = await TO(UserAuthService.verifyOtp(userInfo));
        } else {
            [err, user] = await TO(user.comparePassword(userInfo.password!));
        }
        if (err) TE(err);

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
    }): Promise<UserLoginResponse> => {
        if (isEmpty(userInfo.idToken)) {
            TE("id_token not provided");
        }

        const client = new OAuth2Client(CLIENT_ID);

        let err: any, ticket: LoginTicket;
        [err, ticket] = await TO(
            client.verifyIdToken({
                idToken: userInfo.idToken!,
                audience: CLIENT_ID,
            })
        );
        if (err) TE(err);

        const payload = ticket.getPayload();
        if (isEmpty(payload)) {
            TE("Something went wrong");
        }
        if (isEmpty(payload!.email)) {
            TE("Email not provided by google");
        }

        let user: User;
        [err, user] = await TO(
            UserAuthService.findUser({ email: payload!.email })
        );
        if (err) TE(err);

        return {
            uuid: user.uuid,
            token: user.getJWT(),
            mobileCountryCode: user.mobileCountryCode,
            mobileNumber: user.mobileNumber,
            email: user.email,
        };
    };
}
