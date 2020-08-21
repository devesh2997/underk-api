import { registerDecorator, ValidationOptions } from "class-validator";

const validTypes = ["CREDIT", "DEBIT"]

export function IsValidUKoinTransactionType(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidUKoinTransactionType",
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