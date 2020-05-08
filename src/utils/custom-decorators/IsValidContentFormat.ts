import { registerDecorator, ValidationOptions } from "class-validator";


export function IsValidContentFormat(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidContentFormat",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string) {
                    value = value.toLowerCase()
                    return typeof value === "string" &&
                        (value === 'jgp' || value === 'jpeg' || value === 'png'|| value === 'webp')
                }
            }
        });
    };
}