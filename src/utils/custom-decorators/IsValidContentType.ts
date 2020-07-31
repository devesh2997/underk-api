import { registerDecorator, ValidationOptions } from "class-validator";


export function IsValidContentType(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidContentType",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string) {
                    value = value.toLowerCase()
                    return typeof value === "string" &&
                        (value === 'image/jpg' || value === 'image/jpeg' || value === 'image/png' || value === 'image/gif' || value === 'image/webp')
                }
            }
        });
    };
}