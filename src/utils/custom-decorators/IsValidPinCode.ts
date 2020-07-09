import { registerDecorator, ValidationOptions } from "class-validator";

export function IsValidPincode(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidPincode",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: number) {
                    return typeof value === "number" &&
                        (value > 10000)
                }
            }
        });
    };
}

export const isValidPincode = (value: number): boolean => {
    return typeof value === "number" &&
        (value > 10000)
}