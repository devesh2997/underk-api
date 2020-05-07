import { PolicyJSON, Policy } from "../../entity/admin/Policy";
import { TE, TO, VE } from "../../utils";
import { isEmpty, isNotEmpty } from "class-validator";

export type PolicyRequestInfo = {
    name: string,
    description: string
}

export class PolicyService {
    static get = async (policyInfo: any): Promise<PolicyJSON> | never => {
        let err: any, policy: Policy
        if (isEmpty(policyInfo.id) && isEmpty(policyInfo.name)) {
            TE("Please provid policy id or policy name")
        }

        if (isNotEmpty(policyInfo.id)) {
            [err, policy] = await TO(Policy.findOne({ id: policyInfo.id }))
        } else {
            [err, policy] = await TO(Policy.findOne({ name: policyInfo.name }))
        }
        if (err) TE(err)

        if (isEmpty(policy)) TE("Policy not found")

        return policy.toJSON()
    }

    static getAll = async (): Promise<PolicyJSON[]> => {
        let err: any, policies: Policy[]

        [err, policies] = await TO(Policy.find())

        if (err) TE(err)

        return policies.map(policy => policy.toJSON())
    }

    static delete = async (policyInfo: any): Promise<PolicyJSON> | never => {
        let err: any, policy: Policy
        if (isEmpty(policyInfo.id)) {
            TE("Policy id not provided")
        }

        [err, policy] = await TO(Policy.findOne({ id: policyInfo.id }))

        if (err) TE(err)

        if (isEmpty(policy)) TE("Policy not found")

            ;[err, policy] = await TO(Policy.remove(policy))

        if (err) TE(err)

        return policy.toJSON()
    }

    static create = async (policyInfo: PolicyRequestInfo): Promise<PolicyJSON> => {
        let err: any, policy: Policy, existingPolicy: Policy

        policy = new Policy(policyInfo.name, policyInfo.description)
        VE(policy);

        [err, existingPolicy] = await TO(Policy.findOne({ name: policyInfo.name }))
        if (err) TE(err)
        if (isNotEmpty(existingPolicy)) {
            TE("Policy with given name already exists")
        }

        [err] = await TO(Policy.insert(policy))

        if (err) TE(err)

        return policy.toJSON()
    }
}