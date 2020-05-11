import { AdminJSON, Admin } from "../../entity/admin/Admin"
import { TE, TO, VE } from "../../utils"
import { isNotEmpty, isEmpty } from "class-validator"
import { Employee } from "../../entity/admin/Employee"
import bcrypt from "bcryptjs"
import { Policy } from "../../entity/admin/Policy"

type AdminCreateInfo = {
    alias: string
    password: string,
    euid: string | undefined,
    policyIds: number[] | string,
    roleIds: number[] | string
}

type AdminLoginInfo = {
    alias: string,
    password: string
}

export type AdminLoginSuccess = {
    auid: string,
    alias: string,
    token: string,
    policies: string[]
}

export default class AdminService {

    static get = async (adminGetInfo: any): Promise<AdminJSON> | never => {
        let err: any, adm: Admin | undefined

        if (isEmpty(adminGetInfo.auid) && isEmpty(adminGetInfo.alias)) {
            TE("Please provide auid or alias")
        }
        if (isNotEmpty(adminGetInfo.auid)) {
            [err, adm] = await TO(Admin.findOne({ auid: adminGetInfo.auid }, { relations: ['employee', 'roles', 'policies'] }))
        } else {
            [err, adm] = await TO(Admin.findOne({ alias: adminGetInfo.alias }, { relations: ['employee', 'roles', 'policies'] }))
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

    static getAll = async (): Promise<AdminJSON[]> | never => {
        let err: any, adms: Admin[]

        [err, adms] = await TO(Admin.find({ relations: ['employee', 'roles', 'policies'] }))

        if (err) {
            TE(err)
        }

        if (typeof adms === 'undefined') {
            TE("Admin not found")
        }


        return adms.map(adm => adm.toJSON())
    }

    static delete = async (adminCreateInfo: any): Promise<AdminJSON> | never => {
        let err: any, adm: Admin | undefined

        if (isEmpty(adminCreateInfo.auid) && isEmpty(adminCreateInfo.alias)) {
            TE("Please provide auid or alias")
        }
        if (isNotEmpty(adminCreateInfo.auid)) {
            [err, adm] = await TO(Admin.findOne({ auid: adminCreateInfo.auid }, { relations: ['employee', 'roles', 'policies'] }))
        } else {
            [err, adm] = await TO(Admin.findOne({ alias: adminCreateInfo.alias }, { relations: ['employee', 'roles', 'policies'] }))
        }

        if (isEmpty(adm)) {
            TE("Admin not found")
        }

        [err, adm] = await TO(Admin.remove(adm as Admin))

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

        if (isNotEmpty(adminCreateInfo.policyIds)) {
            try {
                adm.policies = []
                adminCreateInfo.policyIds = JSON.parse(adminCreateInfo.policyIds as string) as number[]
                adminCreateInfo.policyIds = adminCreateInfo.policyIds.map(id => Number(id))
                for (let i = 0; i < adminCreateInfo.policyIds.length; i++) {
                    const id = adminCreateInfo.policyIds[i]
                    let policy: Policy
                    [err, policy] = await TO(Policy.findOne({ id: id }))
                    if (err) TE(err)
                    adm.policies.push(policy)
                }
            } catch (e) {
                TE(e)
            }
        }

        console.log(adm)


        //hash password before storing
        let salt, hash
        [err, salt] = await TO(bcrypt.genSalt(10));
        if (err) TE(err.message, true);

        [err, hash] = await TO(bcrypt.hash(adm.password, salt));
        if (err) TE(err.message, true);

        adm.password = hash;

        [err] = await TO(Admin.save(adm))
        if (err) {
            TE("Some error occurred")
        }

        ;[err, adm] = await TO(Admin.findOne({ alias: adminCreateInfo.alias }, { relations: ['employee', 'policies', 'roles'] }))
        if (err) {
            TE("Some error occurred")
        }

        return adm.toJSON()

    }

    static login = async (loginInfo: AdminLoginInfo): Promise<AdminLoginSuccess> | never => {
        let err: any, adm: Admin
        if (isEmpty(loginInfo.alias) || isEmpty(loginInfo.password)) {
            TE("Alias or password not provided")
        }

        [err, adm] = await TO(Admin.findOne({ alias: loginInfo.alias }, { relations: ['policies', 'roles'] }))

        if (err || isEmpty(adm)) {
            TE("Login unsuccessfull")
        }

        [err, adm] = await TO(adm.comparePassword(loginInfo.password))

        const token = adm.getJWT()

        let policies: string[] = adm.policies.map(policy => policy.name)
        for (let i = 0; i < adm.roles.length; i++) {
            const role = adm.roles[i]
            for (let j = 0; j < role.policies.length; j++) {
                policies.push(role.policies[j].name)
            }
        }


        return {
            auid: adm.auid,
            alias: adm.alias,
            token: token,
            policies: policies
        }
    }

}