import { ExtractJwt, Strategy } from "passport-jwt";
import CONFIG from "../config/config";
import { TO } from "../utils";
import { Admin } from "../entity/admin/Admin";

export const PassportStrategies = (passport: any) => {
    let opts: any = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    opts.secretOrKey = CONFIG.jwt_encryption

    passport.use(
        'admin-jwt',
        new Strategy(opts, async function (jwt_payload, done) {
            console.log(jwt_payload)
            let err, admin: Admin
            [err, admin] = await TO(Admin.findOne({ auid: jwt_payload.auid }, { relations: ['policies', 'roles'] }))

            if (err) return done(err, false)

            if (admin) {
                console.log(admin.policies)
                let policies: string[] = admin.policies.map(policy => policy.name)
                for (let i = 0; i < admin.roles.length; i++) {
                    const role = admin.roles[i]
                    for (let j = 0; j < role.policies.length; j++) {
                        policies.push(role.policies[j].name)
                    }
                }
                return done(null, {
                    auid: admin.auid,
                    alias: admin.alias,
                    policies: policies
                })
            } else {
                return done(null, false)
            }
        })
    )
}