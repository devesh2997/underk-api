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
                        (value === 'image' || value === 'video' || value === 'gif')
                }
            }
        });
    };
}