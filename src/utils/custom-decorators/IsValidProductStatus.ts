import { registerDecorator, ValidationOptions } from "class-validator";
import * as TYPES from "underk-types";

const validTypes = [TYPES.PRODUCT_STATUS_ACTIVE, TYPES.PRODUCT_STATUS_UNAVAILABLE, TYPES.PRODUCT_STATUS_UNAVAILABLE]

export function IsValidProductStatus(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidProductStatus",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return typeof value === "string" &&
                        validTypes.some(v => v === value)
                }
            }
        });
    };
}