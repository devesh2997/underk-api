import { SupplierJSON, Supplier } from "../../entity/inventory/Supplier";
import { isEmpty } from "class-validator";
import { TE, TO, VE } from "../../utils";

export class SupplierService {
    static get = async (supplierInfo: any): Promise<SupplierJSON | never> => {
        let err, supplier: Supplier

        if (isEmpty(supplierInfo.suid)) {
            TE("suid not provided")
        }

        [err, supplier] = await TO(Supplier.findOne({ suid: supplierInfo.suid }))

        if (err) TE(err)

        if (typeof supplier === 'undefined') {
            TE("Supplier not found")
        }

        return supplier.toJSON()
    }

    static getAll = async (): Promise<SupplierJSON[]> | never => {
        let err, suppliers: Supplier[]

        [err, suppliers] = await TO(Supplier.find())

        if (err) TE(err)

        if (typeof suppliers === 'undefined') {
            TE("Suppliers not found")
        }

        return suppliers.map(s => s.toJSON())
    }

    static delete = async (supplierInfo: any): Promise<SupplierJSON> | never => {
        let err, supplier: Supplier

        if (isEmpty(supplierInfo.suid)) {
            TE("suid not provided")
        }

        [err, supplier] = await TO(Supplier.findOne({ suid: supplierInfo.suid }))
        if (err) TE(err)

        if (typeof supplier === 'undefined') {
            TE("Supplier not found")
        }

        [err, supplier] = await TO(supplier.remove())
        if (err) TE(err)

        return supplier.toJSON()
    }

    static create = async (supplierInfo: any): Promise<SupplierJSON> | never => {
        let err, supplier: Supplier

        supplier = new Supplier(supplierInfo.sku, supplierInfo.firstName, supplierInfo.lastName, supplierInfo.email, supplierInfo.mobileCountryCode, supplierInfo.mobileNumber, supplierInfo.dob, supplierInfo.gender, supplierInfo.picUrl, supplierInfo.address);

        await VE(supplier);

        [err, supplier] = await TO(supplier.save())
        if (err) TE(err)

        if (typeof supplier === 'undefined') {
            TE("Some error occured while creating supplier")
        }

        return supplier.toJSON()
    }


}