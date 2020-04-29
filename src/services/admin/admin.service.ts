import { AdminJSON, Admin } from "../../entity/admin/Admin"
import { isEmpty, TE, TO, VE } from "../../utils"
import { isNotEmpty } from "class-validator"
import { Employee } from "../../entity/admin/Employee"
import bcrypt from "bcryptjs"

type AdminCreateInfo = {
    alias: string
    password: string,
    euid: string,
}

type LoginInfo = {
    alias: string,
    password: string
}

export type AdminLoginSuccess = {
    auid: string,
    alias: string,
    token: string
}

export default class AdminService {

    static get = async (AdminCreateInfo: any): Promise<AdminJSON> | never => {
        let err: any, adm: Admin | undefined

        if (isEmpty(AdminCreateInfo.auid)) {
            TE("auid not provided")
        } else {
            [err, adm] = await TO(Admin.findOne({ auid: AdminCreateInfo.auid }, { relations: ['employee'] }))
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

    static delete = async (AdminCreateInfo: any): Promise<AdminJSON> | never => {
        let err: any, adm: Admin | undefined

        if (isEmpty(AdminCreateInfo.auid)) {
            TE("auid not provided")
        } else {
            [err, adm] = await TO(Admin.findOne({ auid: AdminCreateInfo.auid }))
            if (err || isEmpty(adm)) {
                TE("Admin not found")
            }
            ;[err, adm] = await TO(Admin.remove(adm as Admin))
        }

        if (err) {
            TE(err)
        }
        adm = adm as Admin
        return adm.toJSON()
    }

    static create = async (adminCreateInfo: AdminCreateInfo): Promise<AdminJSON> | never => {
        let err: any, adm: Admin

        adm = new Admin()
        adm.password = adminCreateInfo.password
        adm.alias = adminCreateInfo.alias


        //validate password (check length etc.) and alias length
        await VE(adm)

        //check if given alias is available or not
        let existingAdm: Admin
        [err, existingAdm] = await TO(Admin.findOne({ alias: adminCreateInfo.alias }))
        if (existingAdm) {
            TE("Alias is already in use.")
        }

        //check if given employee id exists and it is not already linked with another account.
        let emp: Employee | undefined
        if (isNotEmpty(adminCreateInfo.euid)) {
            [err, emp] = await TO(Employee.findOne({ euid: adminCreateInfo.euid }, { relations: ['admin'] }))
            if (err || !emp) {
                TE("Employee with given euid not found")
            }
            if (emp) {
                if (isNotEmpty(emp.admin)) {
                    TE("Given euid is already linked with other admin")
                }
            }
        }

        if (typeof emp !== 'undefined') {
            adm.employee = emp
        }


        //hash password before storing
        let salt, hash
        [err, salt] = await TO(bcrypt.genSalt(10));
        if (err) TE(err.message, true);

        [err, hash] = await TO(bcrypt.hash(adm.password, salt));
        if (err) TE(err.message, true);

        adm.password = hash;

        [err] = await TO(Admin.insert(adm))
        if (err) {
            TE("Some error occurred")
        }

        ;[err, adm] = await TO(Admin.findOne({ alias: adminCreateInfo.alias }, { relations: ['employee'] }))
        if (err) {
            TE("Some error occurred")
        }

        return adm.toJSON()

    }

    static login = async (loginInfo: LoginInfo): Promise<AdminLoginSuccess> | never => {
        let err: any, adm: Admin
        if (isEmpty(loginInfo.alias) || isEmpty(loginInfo.password)) {
            TE("Alias or password not provided")
        }

        [err, adm] = await TO(Admin.findOne({ alias: loginInfo.alias }))

        if (err || isEmpty(adm)) {
            TE("Login unsuccessfull")
        }

        [err, adm] = await TO(adm.comparePassword(loginInfo.password))

        const token = adm.getJWT()

        return {
            auid: adm.auid,
            alias: adm.alias,
            token: token
        }
    }

}