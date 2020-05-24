import { User, UserJSON } from "../../entity/user/User"
import { isEmpty, isNotEmpty, isEmail } from "class-validator"
import { TE, TO, isNotEmptyString } from "../../utils"

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

    static getAll = async (): Promise<UserJSON[]> => {
        let err: any, users: User[]

        [err, users] = await TO(User.find())

        if (err) {
            TE(err)
        }

        return users.map(u => u.toJSON())
    }

    static create = async (userInfo: any): Promise<UserJSON> => {
        let err: any, user: User

        console.log(userInfo)

        if ((isEmpty(userInfo.mobileCountryCode) || isEmpty(userInfo.mobileNumber)) && isEmpty(userInfo.email)) {
            TE("Provide mobile number or email")
        }

        if (isNotEmpty(userInfo.mobileNumber) && isEmpty(userInfo.mobileCountryCode)) {
            TE("Provide mobile country code ")
        }

        if (isNotEmpty(userInfo.mobileCountryCode) && isEmpty(userInfo.mobileNumber)) {
            TE("Provide mobile number ")
        }

        user = new User()
        if (isNotEmptyString(userInfo.mobileCountryCode)) {
            user.mobileCountryCode = userInfo.mobileCountryCode
        }
        if (isNotEmpty(userInfo.mobileNumber)) {
            if (isNaN(userInfo.mobileNumber)) {
                userInfo.mobileNumber = Number(userInfo.mobileNumber)
            }
            if (isNaN(userInfo.mobileNumber)) {
                TE("Invalid mobile number")
            }
            user.mobileNumber = userInfo.mobileNumber
        }
        if (isNotEmptyString(userInfo.email)) {
            if (!isEmail(userInfo.email)) {
                TE("Invalid email")
            }
            user.email = userInfo.email
        }
        if (isNotEmptyString(userInfo.firstName)) {
            user.firstName = userInfo.firstName
        }
        if (isNotEmptyString(userInfo.lastName)) {
            user.lastName = userInfo.lastName
        } if (isNotEmptyString(userInfo.dob)) {
            user.dob = new Date(userInfo.dob)
        }
        if (isNotEmptyString(userInfo.gender)) {
            user.gender = userInfo.gender
        }
        if (isNotEmptyString(userInfo.picUrl)) {
            user.picUrl = userInfo.picUrl
        }
        if (isNotEmpty(userInfo.emailVerified)) {
            user.emailVerified = userInfo.emailVerified
        }
        if (isNotEmpty(userInfo.mobileVerified)) {
            user.mobileVerified = userInfo.mobileVerified
        }

        if (isEmpty(user.mobileCountryCode) || isEmpty(user.mobileNumber)) {
            if (isNotEmpty(user.mobileVerified)) {
                if (user.mobileVerified)
                    TE("Mobile number is empty, cannot be verified")
            }
        }

        if (isEmpty(user.email)) {
            if (isNotEmpty(user.emailVerified)) {
                if (user.emailVerified)
                    TE("Email is empty, cannot be verified")
            }
        }

        let existingUser: User
        if (isNotEmpty(user.mobileNumber) && isNotEmpty(user.mobileNumber)) {
            [err, existingUser] = await TO(User.findOne({ mobileCountryCode: user.mobileCountryCode, mobileNumber: user.mobileNumber }))
            if (err) TE(err)
            if (isNotEmpty(existingUser)) {
                TE("Mobile number is already in use.")
            }
        }
        if (isNotEmpty(user.email)) {
            [err, existingUser] = await TO(User.findOne({ email: user.email }))
            if (err) TE(err)
            if (isNotEmpty(existingUser)) {
                TE("Email is already in use.")
            }
        }

        [err, user] = await TO(user.save())
        if (err) TE(err)

        return user.toJSON()
    }
}