import { AdminJSON, Admin } from "src/entity/admin/Admin";
import { isEmpty, TE, TO } from "src/utils";
import { isNotEmpty } from "class-validator";


export class AdminService {

    static get = async (adminInfo: any): Promise<AdminJSON> | never => {
        let err: any, adm: Admin | undefined

        if (isEmpty(adminInfo.auid)) {
            TE("auid not provided")
        }

        if (isNotEmpty(adminInfo.auid)) {
            [err, adm] = await TO(Admin.findOne({ auid: adminInfo.auid }))
        } else {
            adm = undefined
        }

        if (err) {
            TE(err)
        }

        if (typeof adm === 'undefined') {
            TE("Admin not found")
        }

        adm = adm as Admin

        return adm.toJSON() as AdminJSON
    }

}