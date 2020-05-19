import { Request, Response } from "express"
import { isEmpty } from "class-validator"
import POLICIES from "underk-policies";

const policyChecker = (allowedPolicies: string[]) => {
    return (req: Request, res: Response, next: Function) => {
        const user: any = req.user
        if (isEmpty(user) || isEmpty(user.policies)) {
            res.sendStatus(401)
        }
        const userPolicies: string[] = user.policies
        console.log(userPolicies)
        if (userPolicies.indexOf(POLICIES.SUPER.name)>=0) {
            next()
        } else if (allowedPolicies.some((p) => userPolicies.indexOf(p) >= 0)) {
            next()
        } else {
            res.sendStatus(401)
        }
    }
}

export default policyChecker