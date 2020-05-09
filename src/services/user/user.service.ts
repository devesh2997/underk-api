import { UserJSON, User } from "../../entity/user/User"
import { isEmpty } from "class-validator"
import { TE, TO } from "../../utils"

type UserLoginInfo = {
    mobileCountryCode: string
    mobileNumber: number
    email: number
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
}