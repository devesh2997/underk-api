import { Supplier } from "../../entity/inventory/Supplier";
import { isEmpty } from "class-validator";
import { VE, CAE, TOG } from "../../utils";

export class SupplierService {
    static get = async (supplierInfo: any): Promise<Supplier | ApiError> => {
        if (isEmpty(supplierInfo.suid)) {
            return CAE("suid not provided")
        }

        let res = await TOG(Supplier.findOne({ suid: supplierInfo.suid }))

        if (res instanceof ApiError) return res

        if (typeof res === 'undefined') {
            return CAE("Supplier not found")
        }

        return res
    }

    static getAll = async (): Promise<Supplier[] | ApiError> => {
        let res = await TOG(Supplier.find())

        if (res instanceof ApiError) return res

        return res
    }

    static delete = async (supplierInfo: any): Promise<Supplier | ApiError> => {
        if (isEmpty(supplierInfo.suid)) {
            return CAE("suid not provided")
        }

        let res = await TOG(Supplier.findOne({ suid: supplierInfo.suid }))
        if (res instanceof ApiError) return res

        if (typeof res === 'undefined') {
            return CAE("Supplier not found")
        }

        res = await TOG(res.remove())
        if (res instanceof ApiError) return res

        return res
    }

    static create = async (supplierInfo: any): Promise<Supplier | ApiError> => {
        let supplier = new Supplier(supplierInfo.sku, supplierInfo.firstName, supplierInfo.lastName, supplierInfo.email, supplierInfo.mobileCountryCode, supplierInfo.mobileNumber, supplierInfo.dob, supplierInfo.gender, supplierInfo.picUrl, supplierInfo.address);

        let validationResult = await VE(supplier);
        if (validationResult instanceof ApiError) return validationResult

        let res = await TOG(supplier.save())
        if (res instanceof ApiError) return res

        if (typeof res === 'undefined') {
            return CAE("Some error occured while creating supplier")
        }

        return res
    }


}