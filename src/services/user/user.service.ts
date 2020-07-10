import { User } from "../../entity/user/User";
import { isEmpty, isNotEmpty, isEmail } from "class-validator";
import { CAE, TOG } from "../../utils";
import ApiError from "../../core/errors";

export default class UserService {
    static get = async (userGetInfo: any): Promise<User | ApiError> => {
        if (isEmpty(userGetInfo.uuid)) {
            return CAE("user id not provided");
        }

        let user = await TOG<User | undefined>(
            User.findOne({ uuid: userGetInfo.uuid })
        );
        if (user instanceof ApiError) {
            return user;
        } else if (typeof user === "undefined") {
            return CAE("user not found");
        }

        return user;
    };

    static getAll = async (): Promise<User[] | ApiError> => {
        let users = await TOG<User[]>(User.find());
        if (users instanceof ApiError) {
            return users;
        }

        return users;
    };

    static create = async (userInfo: any): Promise<User | ApiError> => {
        if (
            (isEmpty(userInfo.mobileCountryCode) ||
                isEmpty(userInfo.mobileNumber)) &&
            isEmpty(userInfo.email)
        ) {
            return CAE("Provide mobile number or email");
        }

        if (
            isNotEmpty(userInfo.mobileNumber) &&
            isEmpty(userInfo.mobileCountryCode)
        ) {
            return CAE("Provide mobile country code ");
        }

        if (
            isNotEmpty(userInfo.mobileCountryCode) &&
            isEmpty(userInfo.mobileNumber)
        ) {
            return CAE("Provide mobile number ");
        }

        let user = new User();
        if (isNotEmpty(userInfo.mobileCountryCode)) {
            user.mobileCountryCode = userInfo.mobileCountryCode;
        }
        if (isNotEmpty(userInfo.mobileNumber)) {
            if (isNaN(userInfo.mobileNumber)) {
                userInfo.mobileNumber = Number(userInfo.mobileNumber);
            }
            if (isNaN(userInfo.mobileNumber)) {
                return CAE("Invalid mobile number");
            }
            user.mobileNumber = userInfo.mobileNumber;
        }
        if (isNotEmpty(userInfo.email)) {
            if (!isEmail(userInfo.email)) {
                return CAE("Invalid email");
            }
            user.email = userInfo.email;
        }
        if (isNotEmpty(userInfo.firstName)) {
            user.firstName = userInfo.firstName;
        }
        if (isNotEmpty(userInfo.lastName)) {
            user.lastName = userInfo.lastName;
        }
        if (isNotEmpty(userInfo.dob)) {
            user.dob = new Date(userInfo.dob);
        }
        if (isNotEmpty(userInfo.gender)) {
            user.gender = userInfo.gender;
        }
        if (isNotEmpty(userInfo.picUrl)) {
            user.picUrl = userInfo.picUrl;
        }
        if (isNotEmpty(userInfo.emailVerified)) {
            user.emailVerified = userInfo.emailVerified;
        }
        if (isNotEmpty(userInfo.mobileVerified)) {
            user.mobileVerified = userInfo.mobileVerified;
        }

        if (isEmpty(user.mobileCountryCode) || isEmpty(user.mobileNumber)) {
            if (isNotEmpty(user.mobileVerified)) {
                if (user.mobileVerified)
                    return CAE("Mobile number is empty, cannot be verified");
            }
        }

        if (isEmpty(user.email)) {
            if (isNotEmpty(user.emailVerified)) {
                if (user.emailVerified)
                    return CAE("Email is empty, cannot be verified");
            }
        }

        if (isNotEmpty(user.mobileNumber) && isNotEmpty(user.mobileNumber)) {
            let existingUser = await TOG<User | undefined>(
                User.findOne({
                    mobileCountryCode: user.mobileCountryCode,
                    mobileNumber: user.mobileNumber,
                })
            );
            if (existingUser instanceof ApiError) return existingUser;
            else if (typeof existingUser !== "undefined") {
                return CAE("Mobile number is already in use.");
            }
        }
        if (isNotEmpty(user.email)) {
            let existingUser = await TOG<User | undefined>(
                User.findOne({ email: user.email })
            );
            if (existingUser instanceof ApiError) return existingUser;
            else if (typeof existingUser !== "undefined") {
                return CAE("Email is already in use.");
            }
        }

        let res = await TOG<User>(user.save());
        if (res instanceof ApiError) return res;

        return res;
    };
}
