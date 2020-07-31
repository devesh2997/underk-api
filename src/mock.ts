import { TOG } from "./utils"
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

    for (let i = 0; i < policies.length; i++) {
        let policy = await TOG(PolicyService.get({ name: policies[i].name }))
        if (policy instanceof ApiError) {
            policy = await TOG(PolicyService.create({ name: policies[i].name, description: policies[i].description }))
        }
        console.log('2' + policy)
    }

    let superAdmin = await TOG(AdminService.get({ alias: 'superuser' }))

    if (superAdmin instanceof ApiError) {
        superAdmin = await TOG(AdminService.create({ alias: 'superuser', password: 'superuser', roleIds: '[]', policyNames: '["SUPER"]', euid: undefined }))
    }

    if (superAdmin instanceof ApiError) {
        console.log('4' + superAdmin)
    } else {
        console.log(superAdmin)
    }




}