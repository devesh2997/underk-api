import { Role, RoleJSON } from "../../entity/admin/Role"
import { isEmpty, isNotEmpty } from "class-validator"
import { TE, TO, VE } from "../../utils"
import { Policy } from "../../entity/admin/Policy"

type RoleRequestInfo = {
    id: number,
    name: string,
    description: string,
    policyNames: string[] | string
}

export class RoleService {
    static get = async (roleInfo: any): Promise<RoleJSON> | never => {
        let err: any, role: Role
        if (isEmpty(roleInfo.id)) {
            TE("Role id not provided")
        }

        [err, role] = await TO(Role.findOne({ id: roleInfo.id }, { relations: ['policies'] }))

        if (err) TE(err)

        if (isEmpty(role)) TE("Role not found")

        return role.toJSON()
    }

    static getAll = async (): Promise<RoleJSON[]> => {
        let err: any, policies: Role[]

        [err, policies] = await TO(Role.find())

        if (err) TE(err)

        return policies.map(role => role.toJSON())
    }

    static delete = async (roleInfo: any): Promise<RoleJSON> | never => {
        let err: any, role: Role
        if (isEmpty(roleInfo.id)) {
            TE("Role id not provided")
        }

        [err, role] = await TO(Role.findOne({ id: roleInfo.id }))

        if (err) TE(err)

        if (isEmpty(role)) TE("Role not found")

            ;[err, role] = await TO(Role.remove(role))

        if (err) TE(err)

        return role.toJSON()
    }

    static create = async (roleInfo: RoleRequestInfo): Promise<RoleJSON> => {
        let err: any, role: Role, existingRole: Role

        role = new Role(roleInfo.name, roleInfo.description)
        VE(role);

        [err, existingRole] = await TO(Role.findOne({ name: roleInfo.name }))
        if (err) TE(err)
        if (isNotEmpty(existingRole)) {
            TE("Role with given name already exists")
        }

        if (isNotEmpty(roleInfo.policyNames)) {
            try {
                role.policies = []
                roleInfo.policyNames = JSON.parse(roleInfo.policyNames as string)
                for (let i = 0; i < roleInfo.policyNames.length; i++) {
                    const name = roleInfo.policyNames[i]
                    let policy: Policy
                    [err, policy] = await TO(Policy.findOne({ name: name }))
                    if (err) TE(err)
                    role.policies.push(policy)

                }

            } catch (e) {
                TE(e)
            }
        }

        [err] = await TO(Role.save(role))

        if (err) TE(err)

        return role.toJSON()
    }

    static addPolicies = async (roleInfo: RoleRequestInfo): Promise<RoleJSON> => {
        let err: any, role: Role

        if (isEmpty(roleInfo.id)) {
            TE("Role id not provided")
        }

        [err, role] = await TO(Role.findOne({ id: roleInfo.id }, { relations: ['policies'] }))
        if (err) TE(err)
        if (isEmpty(role)) {
            TE("Role with given id does not exist")
        }

        if (isNotEmpty(roleInfo.policyNames)) {
            try {
                if (isEmpty(role.policies)) {
                    role.policies = []
                }
                roleInfo.policyNames = JSON.parse(roleInfo.policyNames as string)
                for (let i = 0; i < roleInfo.policyNames.length; i++) {
                    const name = roleInfo.policyNames[i]
                    const index = role.policies.findIndex(p => p.name === name)
                    if (isNotEmpty(index) && index >= 0)
                        continue
                    let policy: Policy
                    [err, policy] = await TO(Policy.findOne({ name: name }))
                    if (err) TE(err)
                    role.policies.push(policy)
                }

            } catch (e) {
                TE(e)
            }
        }

        [err, role] = await TO(role.save())

        if (err) TE(err)

        return role.toJSON()
    }

    static deletePolicies = async (roleInfo: RoleRequestInfo): Promise<RoleJSON> => {
        let err: any, role: Role

        if (isEmpty(roleInfo.id)) {
            TE("Role id not provided")
        }

        [err, role] = await TO(Role.findOne({ id: roleInfo.id }, { relations: ['policies'] }))
        if (err) TE(err)
        if (isEmpty(role)) {
            TE("Role with given id does not exist")
        }

        if (isNotEmpty(roleInfo.policyNames)) {
            try {
                if (isEmpty(role.policies)) {
                    console.log('policies empty')
                    role.policies = []
                }
                roleInfo.policyNames = JSON.parse(roleInfo.policyNames as string)
                for (let i = 0; i < roleInfo.policyNames.length; i++) {
                    const name = roleInfo.policyNames[i]
                    let policy: Policy
                    [err, policy] = await TO(Policy.findOne({ name: name }))
                    if (err) TE(err)
                    const index = role.policies.findIndex(p => p.name === policy.name)
                    console.log(index)
                    if (isNotEmpty(index) && index >= 0) {
                        role.policies.splice(index, 1)
                    }
                }

            } catch (e) {
                TE(e)
            }
        }

        [err, role] = await TO(Role.save(role))

        if (err) TE(err)

        return role.toJSON()
    }
}