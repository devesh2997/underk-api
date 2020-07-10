import { Policy } from "../../entity/admin/Policy";
import { CAE, TOG, VE } from "../../utils";
import { isEmpty } from "class-validator";
import ApiError from "../../core/errors";

export type PolicyRequestInfo = {
    name: string;
    description: string;
};

export class PolicyService {
    static get = async (policyInfo: any): Promise<Policy | ApiError> => {
        let policy: Policy;

        if (isEmpty(policyInfo.name)) {
            return CAE("Please provid policy id or policy name");
        }

        let res = await TOG<Policy | undefined>(
            Policy.findOne({ name: policyInfo.name })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Policy not found");
        }

        policy = res;

        return policy;
    };

    static getAll = async (): Promise<Policy[] | ApiError> => {
        let policies: Policy[];

        let res = await TOG<Policy[]>(Policy.find());
        if (res instanceof ApiError) {
            return res;
        }

        policies = res;

        return policies;
    };

    static delete = async (policyInfo: any): Promise<Policy | ApiError> => {
        let policy: Policy;
        if (isEmpty(policyInfo.id)) {
            return CAE("Policy id not provided");
        }

        let res = await TOG<Policy | undefined>(
            Policy.findOne({ id: policyInfo.id })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Policy not found");
        }

        policy = res;

        res = await TOG<Policy>(Policy.remove(policy));
        if (res instanceof ApiError) {
            return res;
        }

        policy = res;

        return policy;
    };

    static create = async (
        policyInfo: PolicyRequestInfo
    ): Promise<Policy | ApiError> => {
        let policy: Policy;
        policy = new Policy(policyInfo.name, policyInfo.description);

        const validationResult = await VE(policy);
        if (validationResult instanceof ApiError) return validationResult;

        let res = await TOG<Policy | undefined>(
            Policy.findOne({ name: policyInfo.name })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res !== "undefined") {
            return CAE("Policy with given name already exists");
        }

        res = await TOG<Policy>(Policy.save(policy));
        if (res instanceof ApiError) {
            return res;
        }

        return policy;
    };
}
