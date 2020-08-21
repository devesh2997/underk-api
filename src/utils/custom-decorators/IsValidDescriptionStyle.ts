import { registerDecorator, ValidationOptions } from "class-validator";

const validTypes = ["D1", "D2", "D3"]

export function IsValidDescriptionStyle(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidDescriptionStyle",
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