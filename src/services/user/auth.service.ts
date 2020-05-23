import { UserJSON, User } from "../../entity/user/User"
import { isEmpty, isNotEmpty } from "class-validator"
import { TE, TO, generateOtp, addMinutes, maskEmail } from "../../utils"
import { SmsOtp } from "../../entity/shared/SmsOtp"
import { SmsService } from "../shared/sms.service"
import { EmailService } from "../shared/email.service"
import { EmailOtp } from "../../entity/shared/EmailOtp"

export type UserLoginInfo = {
    mobileCountryCode: string
    mobileNumber: number
    email: number,
    otp: string,
    credential: string,
    uuid: string
}

type UserLoginResponse = {
    uuid?: string,
    token?: string,
    emailVerificationRequired?: boolean,
    email?: string,
    mobileVerificationRequired?: boolean,
    mobile?: string
}

export default class UserAuthService {
    static sendOTP = async (userLoginInfo: UserLoginInfo): Promise<string> => {
        if (isEmpty(userLoginInfo.mobileCountryCode) || isEmpty(userLoginInfo.mobileNumber)) {
            TE("Mobile number not provided")
        }
        let err: any, smsOtp: SmsOtp
        const otp = generateOtp()
        const mobile = userLoginInfo.mobileCountryCode + '' + userLoginInfo.mobileNumber;

        [err, smsOtp] = await TO(SmsOtp.findOne({ mobile: mobile }))

        if (err) {
            TE(err)
        }

        if (isNotEmpty(smsOtp)) {
            const timeDiffInSeconds = (new Date().getTime() - smsOtp.updated_at.getTime()) / 1000
            if (timeDiffInSeconds < 30) {
                //new otp will not be generated if the last otp was generated less than 30 seconds before
                TE('Wait for 30 seconds and try again.')
            }
            smsOtp.otp = otp
            smsOtp.expiry = addMinutes(new Date(), 20)
        } else {
            smsOtp = new SmsOtp(mobile, otp, addMinutes(new Date(), 20))
        }

        [err, smsOtp] = await TO(smsOtp.save())

        if (err) {
            TE(err)
        }

        const otpMessage = "Your otp from underK is : " + otp;
        [err] = await TO(SmsService.send([mobile], otpMessage))

        if (err) {
            TE(err)
        }

        return otp
    }

    static signInWithPhoneNumber = async (userLoginInfo: UserLoginInfo): Promise<UserLoginResponse> => {
        let err: any, user: User | undefined, smsOtp: SmsOtp
        let loginResponse: UserLoginResponse = {}

        if (isEmpty(userLoginInfo.mobileCountryCode) || isEmpty(userLoginInfo.mobileNumber)) {
            TE("Mobile number not provided")
        }

        if (isEmpty(userLoginInfo.otp)) {
            TE("Otp not provided")
        }

        // match otp
        const mobile = userLoginInfo.mobileCountryCode + '' + userLoginInfo.mobileNumber;
        [err, smsOtp] = await TO(SmsOtp.findOne({ mobile: mobile }))

        if (err) {
            TE(err)
        }

        if (isEmpty(smsOtp)) {
            TE("Invalid request")
        }

        if (smsOtp.otp !== userLoginInfo.otp) {
            TE("Invalid OTP")
        }

        if (smsOtp.expiry < new Date()) {
            TE("OTP expired")
        }

        //expire otp after successfull match 
        //because one otp can be used to login only once
        smsOtp.expiry = new Date();
        [err] = await TO(smsOtp.save())

        if (err) {
            TE(err)
        }

        //get user
        let users: User[]
        [err, users] = await TO(User.find({ mobileCountryCode: userLoginInfo.mobileCountryCode, mobileNumber: userLoginInfo.mobileNumber }))
        if (users.length === 0) {
            //Create new user
            user = new User()
            user.mobileCountryCode = userLoginInfo.mobileCountryCode
            user.mobileNumber = userLoginInfo.mobileNumber
            user.mobileVerified = true;
            [err, user] = await TO(user.save())
            if (err) {
                TE(err)
            }
        } else if (users.length === 1) {
            user = users[0]
            console.log(user)
            if (!user.mobileVerified) {
                //mobile linked with existing account but not verified, send otp to email
                loginResponse.emailVerificationRequired = true
                loginResponse.email = maskEmail(user.email)
                loginResponse.uuid = user.uuid
                const otp = generateOtp();
                //save email otp in database
                let emailOtp = new EmailOtp(user.email, otp, addMinutes(new Date(), 20));
                [err] = await TO(emailOtp.save());
                if (err) TE(err);
                //send otp in email
                [err] = await TO(EmailService.send({ from: 'no-reply@underk.in', to: user.email, subject: 'underK OTP for login', text: `Your OTP from underK is : ${otp}` }))
                if (err) {
                    TE(err)
                }
            }
        } else {
            //Duplicate account detected
            //Critical, as this should never happen
            user = undefined
            TE("Critical error")
        }

        if (!loginResponse.emailVerificationRequired) {
            loginResponse.token = user?.getJWT()
            loginResponse.uuid = user?.uuid
        }

        return loginResponse

    }

    static verifyEmailOtpAndSignIn = async (userLoginInfo: UserLoginInfo): Promise<UserLoginResponse> => {
        let err: any, user: User | undefined, emailOtp: EmailOtp
        let loginResponse: UserLoginResponse = {}

        if (isEmpty(userLoginInfo.uuid)) {
            TE("UUID not provided")
        }

        if (isEmpty(userLoginInfo.otp)) {
            TE("Otp not provided")
        }

        let users: User[];
        [err, users] = await TO(User.find({ uuid: userLoginInfo.uuid }))

        if (err) TE(err)
        if (isEmpty(users) || users.length === 0) {
            TE("User not found")
        }
        if (users.length > 1) {
            TE("Critical error occurred with verifying email otp.")
        }
        user = users[0];

        // match otp
        [err, emailOtp] = await TO(EmailOtp.findOne({ email: user?.email }))

        if (err) {
            TE(err)
        }

        if (isEmpty(emailOtp)) {
            TE("Invalid request")
        }

        if (emailOtp.otp !== userLoginInfo.otp) {
            TE("Invalid OTP")
        }

        if (emailOtp.expiry < new Date()) {
            TE("OTP expired")
        }

        //expire otp after successfull match 
        //because one otp can be used to login only once
        emailOtp.expiry = new Date();
        [err] = await TO(emailOtp.save())

        if (err) TE(err)

        //set mobile verified to true and save
        user.mobileVerified = true;

        [err,user] = await TO(user.save())
        if (err) TE(err)

        //prepare and return successful login response
        loginResponse.uuid = user?.uuid
        loginResponse.token = user?.getJWT()

        return loginResponse

    }

}