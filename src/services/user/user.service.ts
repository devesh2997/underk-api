import { UserJSON, User } from "../../entity/user/User"
import { isEmpty } from "class-validator"
import { TE, TO } from "../../utils"

type UserLoginInfo = {
    mobileCountryCode: string
    mobileNumber: number
    email: number,
    otp: number,
    credential: string
}

type UserLoginResponse = {
    uuid: string,
    token: string,
    success: false
}

export default class UserService {
    static get = async (userGetInfo: any): Promise<UserJSON> => {
        let err: any, user: User

        if (isEmpty(userGetInfo.uuid)) {
            TE("user id not provided")
        }

        [err, user] = await TO(User.findOne({ uuid: userGetInfo.uuid }))

        if (err) {
            TE(err)
        }

        return user.toJSON()
    }

    static sendOTP = async (userLoginInfo: UserLoginInfo): Promise<boolean> => {
        //TODO send otp 

        return true
    }

    static signInWithPhoneNumber = async (userLoginInfo: UserLoginInfo): Promise<UserLoginResponse> => {
        let err: any, user: User

        if (isEmpty(userLoginInfo.mobileCountryCode) || isEmpty(userLoginInfo.mobileNumber)) {
            TE("Mobile number not provided")
        }

        if (isEmpty(userLoginInfo.otp)) {
            TE("Otp not provided")
        }

        //TODO match otp

        let users: User[]
        [err, users] = await TO(User.find({ mobileCountryCode: userLoginInfo.mobileCountryCode, mobileNumber: userLoginInfo.mobileNumber }))

        if(users.length === 0){
            //Create new user and send back jwt token
            user = new User()
            user.mobileCountryCode = userLoginInfo.mobileCountryCode
            user.mobileNumber = userLoginInfo.mobileNumber
        }else if(users.length ===1){
            user = users[1]
            if(user.mobileVerified){
                //Successfull login, send back token
            }else{
                //Send otp to email id 
            }
        }else{
            //Duplicate account detected
            //Critical, as this should never happen
        }

    }
}