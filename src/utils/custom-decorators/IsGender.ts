import { registerDecorator, ValidationOptions } from "class-validator";


export function IsGender(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isGender",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return typeof value === "string" &&
                        (value === 'M' || value === 'F' || value === 'U' || value === 'N')
                }
            }
        });
    };
}