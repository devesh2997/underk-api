import { AdminJSON, Admin } from "src/entity/admin/Admin";
import { isEmpty, TE, TO } from "src/utils";


export class AdminService {

    static get = async (adminInfo: any): Promise<AdminJSON> | never => {
        let err: any, adm: Admin | undefined

        if (isEmpty(adminInfo.auid)) {
            TE("auid not provided")
        } else {
            [err, adm] = await TO(Admin.findOne({ auid: adminInfo.auid }))
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