import { Admin } from "../../entity/admin/Admin";
import { VE, CAE, TOG } from "../../utils";
import { isNotEmpty, isEmpty } from "class-validator";
import { Employee } from "../../entity/admin/Employee";
import bcrypt from "bcryptjs";
import { Policy } from "../../entity/admin/Policy";
import { Role } from "../../entity/admin/Role";
import ApiError from "../../core/errors";

type AdminCreateUpdateInfo = {
    auid?: string;
    alias: string;
    password: string;
    euid: string | undefined;
    policyNames: string[] | string;
    roleIds: number[] | string;
};

type AdminLoginInfo = {
    alias: string;
    password: string;
};

export type AdminLoginSuccess = {
    auid: string;
    alias: string;
    token: string;
    policies: string[];
};

export default class AdminService {
    static get = async (adminGetInfo: any): Promise<Admin | ApiError> => {
        if (isEmpty(adminGetInfo.auid) && isEmpty(adminGetInfo.alias)) {
            return CAE("Please provide auid or alias");
        }

        let res: ApiError | Admin | undefined;
        if (isNotEmpty(adminGetInfo.auid)) {
            res = await TOG<Admin | undefined>(
                Admin.findOne(
                    { auid: adminGetInfo.auid },
                    { relations: ["employee", "roles", "policies"] }
                )
            );
        } else {
            res = await TOG<Admin | undefined>(
                Admin.findOne(
                    { alias: adminGetInfo.alias },
                    { relations: ["employee", "roles", "policies"] }
                )
            );
        }

        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Admin not found");
        }

        return res;
    };

    static getAll = async (): Promise<Admin[] | ApiError> => {
        let res = await TOG<Admin[]>(
            Admin.find({ relations: ["employee", "roles", "policies"] })
        );

        if (res instanceof ApiError) {
            return res;
        }

        return res;
    };

    static delete = async (adminCreateInfo: any): Promise<Admin | ApiError> => {
        if (isEmpty(adminCreateInfo.auid) && isEmpty(adminCreateInfo.alias)) {
            return CAE("Please provide auid or alias");
        }
        let res: Admin | undefined | ApiError;
        if (isNotEmpty(adminCreateInfo.auid)) {
            res = await TOG<Admin | undefined>(
                Admin.findOne(
                    { auid: adminCreateInfo.auid },
                    { relations: ["employee", "roles", "policies"] }
                )
            );
        } else {
            res = await TOG<Admin | undefined>(
                Admin.findOne(
                    { alias: adminCreateInfo.alias },
                    { relations: ["employee", "roles", "policies"] }
                )
            );
        }

        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Admin not found");
        }

        res = await TOG<Admin>(res.remove());

        if (res instanceof ApiError) return res;

        return res;
    };

    static create = async (
        adminCreateInfo: AdminCreateUpdateInfo
    ): Promise<Admin | ApiError> => {
        let adm: Admin;
        adm = new Admin();
        adm.password = adminCreateInfo.password;
        adm.alias = adminCreateInfo.alias;

        //validate password (check length etc.) and alias length
        const validationResult = await VE(adm);
        if (validationResult instanceof ApiError) return validationResult;

        //check if given alias is available or not
        let existingAdm = await TOG<Admin | undefined>(
            Admin.findOne({ alias: adminCreateInfo.alias })
        );
        if (existingAdm instanceof ApiError) {
            return existingAdm;
        } else if (typeof existingAdm !== "undefined") {
            return CAE("Alias is already in use.");
        }

        //check if given employee id exists and it is not already linked with another account.
        if (isNotEmpty(adminCreateInfo.euid)) {
            let emp = await TOG<Employee | undefined>(
                Employee.findOne(
                    { euid: adminCreateInfo.euid },
                    { relations: ["admin"] }
                )
            );
            if (emp instanceof ApiError) {
                return emp;
            } else if (typeof emp === "undefined") {
                return CAE("Employee with given euid not found");
            }
            if (isNotEmpty(emp.admin)) {
                return CAE("Given euid is already linked with other admin");
            }

            adm.employee = emp;
        }

        if (isNotEmpty(adminCreateInfo.policyNames)) {
            try {
                adm.policies = [];

                adminCreateInfo.policyNames = JSON.parse(
                    adminCreateInfo.policyNames as string
                ) as string[];

                for (let i = 0; i < adminCreateInfo.policyNames.length; i++) {
                    const name = adminCreateInfo.policyNames[i];

                    let policy = await TOG<Policy | undefined>(
                        Policy.findOne({ name: name })
                    );
                    if (policy instanceof ApiError) {
                        return policy;
                    } else if (typeof policy === "undefined") {
                        return CAE("Policy not found");
                    }

                    adm.policies.push(policy);
                }
            } catch (e) {
                return CAE(e);
            }
        }

        if (isNotEmpty(adminCreateInfo.roleIds)) {
            try {
                adm.roles = [];

                adminCreateInfo.roleIds = JSON.parse(
                    adminCreateInfo.roleIds as string
                ) as number[];
                adminCreateInfo.roleIds = adminCreateInfo.roleIds.map((id) =>
                    Number(id)
                );

                for (let i = 0; i < adminCreateInfo.roleIds.length; i++) {
                    const id = adminCreateInfo.roleIds[i];

                    let role = await TOG<Role | undefined>(
                        Role.findOne({ id: id })
                    );
                    if (role instanceof ApiError) {
                        return role;
                    } else if (typeof role === "undefined") {
                        return CAE("Role not found");
                    }

                    adm.roles.push(role);
                }
            } catch (e) {
                return CAE(e);
            }
        }

        //hash password before storing
        let salt = await TOG<string>(bcrypt.genSalt(10));
        if (salt instanceof ApiError) {
            return salt;
        }

        let hash = await TOG<string>(bcrypt.hash(adm.password, salt));
        if (hash instanceof ApiError) {
            return hash;
        }

        adm.password = hash;

        let res: ApiError | Admin | undefined;
        res = await TOG<Admin>(Admin.save(adm));
        if (res instanceof ApiError) {
            return res;
        }

        res = await TOG<Admin | undefined>(
            Admin.findOne(
                { alias: adminCreateInfo.alias },
                { relations: ["employee", "policies", "roles"] }
            )
        );
        if (res instanceof ApiError) {
            return res;
        } else if (typeof res === "undefined") {
            return CAE("Admin not found");
        }

        return res;
    };

    static update = async (
        reqUser: string,
        adminUpdateInfo: AdminCreateUpdateInfo
    ): Promise<Admin | ApiError> => {
        if (isEmpty(adminUpdateInfo.auid)) {
            return CAE("auid not provided");
        }
        if (reqUser === adminUpdateInfo.auid) {
            return CAE("invalid request");
        }

        let adm = await TOG<Admin | undefined>(
            Admin.findOne(
                { auid: adminUpdateInfo.auid },
                { relations: ["roles", "policies", "employee"] }
            )
        );
        if (adm instanceof ApiError) {
            return adm;
        } else if (typeof adm === "undefined") {
            return CAE("Admin not found");
        }

        if (isNotEmpty(adminUpdateInfo.alias)) {
            adm.alias = adminUpdateInfo.alias;

            //validate alias length
            const validationResult = await VE(adm);
            if (validationResult instanceof ApiError) return validationResult;

            //check if given alias is available or not
            let existingAdm = await TOG<Admin | undefined>(
                Admin.findOne({ alias: adminUpdateInfo.alias })
            );
            if (existingAdm instanceof ApiError) {
                return existingAdm;
            } else if (typeof existingAdm !== "undefined") {
                return CAE("Alias is already in use.");
            }
        }

        //check if given employee id exists and it is not already linked with another account.
        if (isNotEmpty(adminUpdateInfo.euid)) {
            let emp = await TOG<Employee | undefined>(
                Employee.findOne(
                    { euid: adminUpdateInfo.euid },
                    { relations: ["admin"] }
                )
            );
            if (emp instanceof ApiError) {
                return emp;
            } else if (typeof emp === "undefined") {
                return CAE("Employee with given euid not found");
            }
            if (isNotEmpty(emp.admin)) {
                return CAE("Given euid is already linked with other admin");
            }

            adm.employee = emp;
        }

        if (isNotEmpty(adminUpdateInfo.policyNames)) {
            try {
                adm.policies = [];

                adminUpdateInfo.policyNames = JSON.parse(
                    adminUpdateInfo.policyNames as string
                ) as string[];

                for (let i = 0; i < adminUpdateInfo.policyNames.length; i++) {
                    const name = adminUpdateInfo.policyNames[i];

                    let policy = await TOG<Policy | undefined>(
                        Policy.findOne({ name: name })
                    );
                    if (policy instanceof ApiError) {
                        return policy;
                    } else if (typeof policy === "undefined") {
                        return CAE("Policy not found");
                    }

                    adm.policies.push(policy);
                }
            } catch (e) {
                return CAE(e);
            }
        }

        if (isNotEmpty(adminUpdateInfo.roleIds)) {
            try {
                adm.roles = [];

                adminUpdateInfo.roleIds = JSON.parse(
                    adminUpdateInfo.roleIds as string
                ) as number[];
                adminUpdateInfo.roleIds = adminUpdateInfo.roleIds.map((id) =>
                    Number(id)
                );

                for (let i = 0; i < adminUpdateInfo.roleIds.length; i++) {
                    const id = adminUpdateInfo.roleIds[i];

                    let role = await TOG<Role | undefined>(
                        Role.findOne({ id: id })
                    );
                    if (role instanceof ApiError) {
                        return role;
                    } else if (typeof role === "undefined") {
                        return CAE("Role not found");
                    }

                    adm.roles.push(role);
                }
            } catch (e) {
                return CAE(e);
            }
        }

        adm = await TOG<Admin>(adm.save());
        if (adm instanceof ApiError) {
            return adm;
        }

        return adm;
    };

    static login = async (
        loginInfo: AdminLoginInfo
    ): Promise<AdminLoginSuccess | ApiError> => {
        if (isEmpty(loginInfo.alias) || isEmpty(loginInfo.password)) {
            return CAE("Alias or password not provided");
        }

        let adm = await TOG<Admin | undefined>(
            Admin.findOne(
                { alias: loginInfo.alias },
                { relations: ["policies", "roles"] }
            )
        );
        if (adm instanceof ApiError) {
            return adm;
        } else if (typeof adm === "undefined") {
            return CAE("Admin not found");
        }

        adm = await TOG(adm.comparePassword(loginInfo.password));
        if (adm instanceof ApiError) {
            return adm;
        }

        const token = adm.getJWT();

        let policies: string[] = adm.policies.map((policy) => policy.name);
        for (let i = 0; i < adm.roles.length; i++) {
            const role = adm.roles[i];
            for (let j = 0; j < role.policies.length; j++) {
                policies.push(role.policies[j].name);
            }
        }

        return {
            auid: adm.auid,
            alias: adm.alias,
            token: token,
            policies: policies,
        };
    };
}
