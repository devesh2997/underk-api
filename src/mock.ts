import { TOG } from "./utils"
import { isNotEmpty } from "class-validator";
import AdminService from "./services/admin/admin.service";
import * as POLICIES from "underk-policies";
import { PolicyService } from "./services/admin/policy.service";
import ApiError from "./core/errors";

const policies = [
    POLICIES.SUPER,
    POLICIES.ADMIN_VIEW,
    POLICIES.ADMIN_PUBLISH,
    POLICIES.EMPLOYEE_VIEW,
    POLICIES.EMPLOYEE_PUBLISH,
    POLICIES.CATALOGUE_VIEW,
    POLICIES.CATALOGUE_PUBLISH,
    POLICIES.EMAIL_PUBLISH,
    POLICIES.EMAIL_VIEW,
    POLICIES.SMS_PUBLISH,
    POLICIES.SMS_VIEW
]

export const insertMockData = async (): Promise<void> => {
    let err: any

    for (let i = 0; i < policies.length; i++) {
        let policy = await TOG(PolicyService.get({ name: policies[i].name }))
        if (policy instanceof ApiError) {
            console.log(err)
        } else {
            policy = await TOG(PolicyService.create({ name: policies[i].name, description: policies[i].description }))
        }
        if (err) console.log(err)
    }

    let superAdmin = await TOG(AdminService.get({ alias: 'superuser' }))
    if (isNotEmpty(superAdmin)) {
        console.log(superAdmin)
        return
    }

    superAdmin = await TOG(AdminService.delete({ alias: 'superuser' }));

    superAdmin = await TOG(AdminService.create({ alias: 'superuser', password: 'superuser', roleIds: '[]', policyNames: '["SUPER"]', euid: undefined }))
    if (err) {
        console.log(err)
    }

    console.log(superAdmin)


}