import { Supplier } from "../../entity/catalogue/Supplier";
import { TO, TE, isEmpty } from "../../utils";

export class SupplierService {
    static get = async (supplierInfo: any): Promise<Supplier> | never => {
        let err: any, supp: Supplier

        if (isEmpty(supplierInfo.suid)) {
            TE("Please provide supplier id")
        }
        [err, supp] = await TO(Supplier.findOne({ suid: supplierInfo.suid }))

        if (err) {
            TE(err)
        }

        if (typeof supp === 'undefined') {
            TE("Supplier not found")
        }

        return supp
    }

    static delete = async (supplierInfo: any): Promise<Supplier> | never => {
        let err: any, supp: Supplier

        if (isEmpty(supplierInfo.suid)) {
            TE("Please provide supplier id")
        }
        [err, supp] = await TO(Supplier.findOne({ suid: supplierInfo.suid }))

        if (err) {
            TE(err)
        }

        if (typeof supp === 'undefined') {
            TE("Supplier not found")
        }

        ;[err, supp] = await TO(Supplier.remove(supp))

        if (err) {
            TE(err)
        }

        return supp
    }
}