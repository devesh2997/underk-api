import { registerDecorator, ValidationOptions } from "class-validator";

export function IsValidAttributeValueType(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidAttributeValueType",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return typeof value === "string" &&
                        (value === 'none') || (value === 'hexcode')
                }
            }
        });
    };
}

export const isValidAttributeValueType = (value: string): boolean => {
    return typeof value === "string" &&
        (value === 'none') || (value === 'hexcode')
}