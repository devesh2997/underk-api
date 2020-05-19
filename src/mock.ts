import { TO } from "./utils"
import { Admin } from "./entity/admin/Admin";
import { isNotEmpty, isEmpty } from "class-validator";
import AdminService from "./services/admin/admin.service";
import * as POLICIES from "underk-policies";
import { PolicyService } from "./services/admin/policy.service";
import { PolicyJSON } from "./entity/admin/Policy";

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
        let policy: PolicyJSON
        [err, policy] = await TO(PolicyService.get({ name: policies[i].name }))
        if (isEmpty(policy)) {
            [err, policy] = await TO(PolicyService.create({ name: policies[i].name, description: policies[i].description }))
        }
        if (err) console.log(err)
    }

    let superAdmin: Admin
    [err, superAdmin] = await TO(AdminService.get({ alias: 'superuser' }))
    if (isNotEmpty(superAdmin)) {
        console.log(superAdmin)
        return
    }
    [err, superAdmin] = await TO(AdminService.delete({ alias: 'superuser' }));
    [err, superAdmin] = await TO(AdminService.create({ alias: 'superuser', password: 'superuser', roleIds: '[]', policyNames: '["SUPER"]', euid: undefined }))
    if (err) {
        console.log(err)
    }

    console.log(superAdmin)


}