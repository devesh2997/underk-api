import { registerDecorator, ValidationOptions } from "class-validator";


export function IsValidAssetType(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidAssetType",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string) {
                    value = value.toLowerCase()
                    return typeof value === "string" &&
                        (value === 'preview' || value === 'thumbnail' || value === 'original')
                }
            }
        });
    };
}