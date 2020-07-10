import { Role } from "../../entity/admin/Role";
import { isEmpty, isNotEmpty } from "class-validator";
import { CAE, TOG, VE } from "../../utils";
import { Policy } from "../../entity/admin/Policy";
import ApiError from "../../core/errors";

type RoleRequestInfo = {
    id: number;
    name: string;
    description: string;
    policyNames: string[] | string;
};

export class RoleService {
    static get = async (roleInfo: any): Promise<Role | ApiError> => {
        let role: Role;

        if (isEmpty(roleInfo.id)) {
            return CAE("Role id not provided");
        }

        let res = await TOG<Role | undefined>(
            Role.findOne({ id: roleInfo.id }, { relations: ["policies"] })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Role not found");
        }

        role = res;

        return role;
    };

    static getAll = async (): Promise<Role[] | ApiError> => {
        let roles: Role[];

        let res = await TOG<Role[]>(Role.find({ relations: ["policies"] }));
        if (res instanceof ApiError) {
            return res;
        }

        roles = res;

        return roles;
    };

    static delete = async (roleInfo: any): Promise<Role | ApiError> => {
        let role: Role;

        if (isEmpty(roleInfo.id)) {
            return CAE("Role id not provided");
        }

        let res = await TOG<Role | undefined>(
            Role.findOne({ id: roleInfo.id })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Role not found");
        }

        role = res;

        res = await TOG<Role>(Role.remove(role));
        if (res instanceof ApiError) {
            return res;
        }

        role = res;

        return role;
    };

    static create = async (
        roleInfo: RoleRequestInfo
    ): Promise<Role | ApiError> => {
        let role: Role;
        role = new Role(roleInfo.name, roleInfo.description);

        const validationResult = await VE(role);
        if (validationResult instanceof ApiError) return validationResult;

        let res = await TOG<Role | undefined>(
            Role.findOne({ name: roleInfo.name })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res !== "undefined") {
            return CAE("Role with given name already exists");
        }

        if (isNotEmpty(roleInfo.policyNames)) {
            try {
                role.policies = [];

                roleInfo.policyNames = JSON.parse(
                    roleInfo.policyNames as string
                ) as string[];

                for (let i = 0; i < roleInfo.policyNames.length; i++) {
                    const name = roleInfo.policyNames[i];

                    let policy: Policy;
                    let res2 = await TOG<Policy | undefined>(
                        Policy.findOne({ name: name })
                    );
                    if (res2 instanceof ApiError) {
                        return res2;
                    } else if (typeof res2 === "undefined") {
                        return CAE("Policy not found");
                    }

                    policy = res2;

                    role.policies.push(policy);
                }
            } catch (e) {
                return CAE(e);
            }
        }

        res = await TOG<Role>(Role.save(role));
        if (res instanceof ApiError) {
            return res;
        }

        role = res;

        return role;
    };

    static addPolicies = async (
        roleInfo: RoleRequestInfo
    ): Promise<Role | ApiError> => {
        let role: Role;

        if (isEmpty(roleInfo.id)) {
            return CAE("Role id not provided");
        }

        let res = await TOG<Role | undefined>(
            Role.findOne({ id: roleInfo.id }, { relations: ["policies"] })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Role with given id does not exist");
        }

        role = res;

        if (isNotEmpty(roleInfo.policyNames)) {
            try {
                if (isEmpty(role.policies)) {
                    role.policies = [];
                }

                roleInfo.policyNames = JSON.parse(
                    roleInfo.policyNames as string
                ) as string[];

                for (let i = 0; i < roleInfo.policyNames.length; i++) {
                    const name = roleInfo.policyNames[i];
                    const index = role.policies.findIndex(
                        (p) => p.name === name
                    );
                    if (isNotEmpty(index) && index >= 0) continue;

                    let policy: Policy;
                    let res2 = await TOG<Policy | undefined>(
                        Policy.findOne({ name: name })
                    );
                    if (res2 instanceof ApiError) {
                        return res2;
                    } else if (typeof res2 === "undefined") {
                        return CAE("Policy not found");
                    }

                    policy = res2;

                    role.policies.push(policy);
                }
            } catch (e) {
                return CAE(e);
            }
        }

        res = await TOG<Role>(role.save());
        if (res instanceof ApiError) {
            return res;
        }

        role = res;

        return role;
    };

    static deletePolicies = async (
        roleInfo: RoleRequestInfo
    ): Promise<Role | ApiError> => {
        let role: Role;

        if (isEmpty(roleInfo.id)) {
            return CAE("Role id not provided");
        }

        let res = await TOG<Role | undefined>(
            Role.findOne({ id: roleInfo.id }, { relations: ["policies"] })
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Role with given id does not exist");
        }

        role = res;

        if (isNotEmpty(roleInfo.policyNames)) {
            try {
                if (isEmpty(role.policies)) {
                    role.policies = [];
                }

                roleInfo.policyNames = JSON.parse(
                    roleInfo.policyNames as string
                ) as string[];

                for (let i = 0; i < roleInfo.policyNames.length; i++) {
                    const name = roleInfo.policyNames[i];

                    const index = role.policies.findIndex(
                        (p) => p.name === name
                    );
                    if (index >= 0) {
                        role.policies.splice(index, 1);
                    }
                }
            } catch (e) {
                return CAE(e);
            }
        }

        res = await TOG<Role>(Role.save(role));
        if (res instanceof ApiError) {
            return res;
        }

        role = res;

        return role;
    };
}
