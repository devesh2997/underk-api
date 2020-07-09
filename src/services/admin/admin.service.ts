import { AdminJSON, Admin } from "../../entity/admin/Admin"
import { VE, CAE, TOG } from "../../utils"
import { isNotEmpty, isEmpty } from "class-validator"
import { Employee } from "../../entity/admin/Employee"
import bcrypt from "bcryptjs"
import { Policy } from "../../entity/admin/Policy"
import { Role } from "../../entity/admin/Role"

type AdminCreateUpdateInfo = {
    auid?: string,
    alias: string
    password: string,
    euid: string | undefined,
    policyNames: string[] | string,
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

    static get = async (adminGetInfo: any): Promise<Admin | ApiError> => {

        if (isEmpty(adminGetInfo.auid) && isEmpty(adminGetInfo.alias)) {
            return CAE("Please provide auid or alias")
        }

        let res: ApiError | Admin | undefined
        if (isNotEmpty(adminGetInfo.auid)) {
            res = await TOG<Admin | undefined>(Admin.findOne({ auid: adminGetInfo.auid }, { relations: ['employee', 'roles', 'policies'] }))
        } else {
            res = await TOG<Admin | undefined>(Admin.findOne({ alias: adminGetInfo.alias }, { relations: ['employee', 'roles', 'policies'] }))
        }

        if (res instanceof ApiError) return res

        if (typeof res === 'undefined') {
            return CAE("Admin not found")
        }

        return res
    }

    static getAll = async (): Promise<Admin[] | ApiError> => {
        let res = await TOG<Admin[]>(Admin.find({ relations: ['employee', 'roles', 'policies'] }))

        if (res instanceof ApiError) {
            return res
        }

        return res
    }

    static delete = async (adminCreateInfo: any): Promise<Admin | ApiError> => {
        if (isEmpty(adminCreateInfo.auid) && isEmpty(adminCreateInfo.alias)) {
            return CAE("Please provide auid or alias")
        }
        let res: Admin | undefined | ApiError
        if (isNotEmpty(adminCreateInfo.auid)) {
            res = await TOG<Admin | undefined>(Admin.findOne({ auid: adminCreateInfo.auid }, { relations: ['employee', 'roles', 'policies'] }))
        } else {
            res = await TOG<Admin | undefined>(Admin.findOne({ alias: adminCreateInfo.alias }, { relations: ['employee', 'roles', 'policies'] }))
        }

        if (res instanceof ApiError) {
            return res
        }

        if (typeof res === 'undefined') {
            return CAE("Admin not found")
        }

        res = await TOG<Admin>(res.remove())

        if (res instanceof ApiError) return res

        return res
    }

    static create = async (adminCreateInfo: AdminCreateUpdateInfo): Promise<Admin | ApiError> => {
        let err: any, adm: Admin

        adm = new Admin()
        adm.password = adminCreateInfo.password
        adm.alias = adminCreateInfo.alias

        //validate password (check length etc.) and alias length
        await VE(adm)

        //check if given alias is available or not
        let existingAdm = await TOG<Admin | undefined>(Admin.findOne({ alias: adminCreateInfo.alias }))
        if (existingAdm instanceof ApiError) {
            return existingAdm
        }
        if(typeof existingAdm !== 'undefined'){
            return CAE("Alias is already in use.")
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

        if (isNotEmpty(adminCreateInfo.policyNames)) {
            try {
                adm.policies = []
                adminCreateInfo.policyNames = JSON.parse(adminCreateInfo.policyNames as string) as string[]
                for (let i = 0; i < adminCreateInfo.policyNames.length; i++) {
                    const name = adminCreateInfo.policyNames[i]
                    let policy: Policy
                    [err, policy] = await TO(Policy.findOne({ name: name }))
                    if (err) TE(err)
                    adm.policies.push(policy)
                }
            } catch (e) {
                TE(e)
            }
        }

        if (isNotEmpty(adminCreateInfo.roleIds)) {
            try {
                adm.roles = []
                adminCreateInfo.roleIds = JSON.parse(adminCreateInfo.roleIds as string) as number[]
                adminCreateInfo.roleIds = adminCreateInfo.roleIds.map(id => Number(id))
                for (let i = 0; i < adminCreateInfo.roleIds.length; i++) {
                    const id = adminCreateInfo.roleIds[i]
                    let role: Role
                    [err, role] = await TO(Role.findOne({ id: id }))
                    if (err) TE(err)
                    adm.roles.push(role)
                }
            } catch (e) {
                TE(e)
            }
        }


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

    static update = async (reqUser: string, adminUpdateInfo: AdminCreateUpdateInfo): Promise<AdminJSON> | never => {
        let err: any, adm: Admin

        if (isEmpty(adminUpdateInfo.auid)) {
            TE("auid not provided")
        }
        if (reqUser === adminUpdateInfo.auid) {
            TE("invalid request")
        }

        [err, adm] = await TO(Admin.findOne({ auid: adminUpdateInfo.auid }, { relations: ['roles', 'policies', 'employee'] }))

        if (isNotEmpty(adminUpdateInfo.alias)) {
            adm.alias = adminUpdateInfo.alias
            //validate alias length
            await VE(adm)
            //check if given alias is available or not
            let existingAdm: Admin
            [err, existingAdm] = await TO(Admin.findOne({ alias: adminUpdateInfo.alias }))
            if (existingAdm) {
                TE("Alias is already in use.")
            }
        }


        //check if given employee id exists and it is not already linked with another account.
        let emp: Employee | undefined
        if (isNotEmpty(adminUpdateInfo.euid)) {
            [err, emp] = await TO(Employee.findOne({ euid: adminUpdateInfo.euid }, { relations: ['admin'] }))
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

        if (isNotEmpty(adminUpdateInfo.policyNames)) {
            try {
                adm.policies = []
                adminUpdateInfo.policyNames = JSON.parse(adminUpdateInfo.policyNames as string) as string[]
                for (let i = 0; i < adminUpdateInfo.policyNames.length; i++) {
                    const name = adminUpdateInfo.policyNames[i]
                    let policy: Policy
                    [err, policy] = await TO(Policy.findOne({ name: name }))
                    if (err) TE(err)
                    adm.policies.push(policy)
                }
            } catch (e) {
                TE(e)
            }
        }

        if (isNotEmpty(adminUpdateInfo.roleIds)) {
            try {
                adm.roles = []
                adminUpdateInfo.roleIds = JSON.parse(adminUpdateInfo.roleIds as string) as number[]
                adminUpdateInfo.roleIds = adminUpdateInfo.roleIds.map(id => Number(id))
                for (let i = 0; i < adminUpdateInfo.roleIds.length; i++) {
                    const id = adminUpdateInfo.roleIds[i]
                    let role: Role
                    [err, role] = await TO(Role.findOne({ id: id }))
                    if (err) TE(err)
                    adm.roles.push(role)
                }
            } catch (e) {
                TE(e)
            }
        }

        [err, adm] = await TO(adm.save())
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