import { getManager } from "typeorm"
import { TO, TE } from "./utils"
import { Admin } from "./entity/admin/Admin";
import { isEmpty, isNotEmpty } from "class-validator";
import AdminService from "./services/admin/admin.service";
import * as POLICIES from "underk-policies";
import { PolicyService } from "./services/admin/policy.service";
import { PolicyJSON } from "./entity/admin/Policy";

const policyNames = [
    POLICIES.SUPER,
    POLICIES.ADMIN_VIEW,
    POLICIES.ADMIN_PUBLISH,
    POLICIES.EMPLOYEE_VIEW,
    POLICIES.EMPLOYEE_PUBLISH,
    POLICIES.CATALOGUE_VIEW,
    POLICIES.CATALOGUE_PUBLISH
]

export const insertMockData = async (): Promise<void> => {
    let err: any
    let superPolicyId: number = -1

    for (let i = 0; i < policyNames.length; i++) {
        let policy: PolicyJSON
        const policyName = policyNames[i]
        if (policyName === POLICIES.SUPER) {
            [err, policy] = await TO(PolicyService.get({ name: policyName }))
            if (isNotEmpty(policy)) {
                superPolicyId = policy.id
            } else {
                [err, policy] = await TO(PolicyService.create({ name: policyNames[i], description: '' }))
            }
        } else {
            [err, policy] = await TO(PolicyService.create({ name: policyNames[i], description: '' }))
        }
        if (err) console.log(err)
    }

    let superAdmin: Admin
    [err, superAdmin] = await TO(AdminService.delete({ alias: 'superuser'}));
    [err, superAdmin] = await TO(AdminService.create({ alias: 'superuser', password: 'superuser', roleIds: '[]', policyIds: '[' + superPolicyId + ']', euid: undefined }))
    if(err){
        console.log(err)
    }

    console.log(superAdmin)


}