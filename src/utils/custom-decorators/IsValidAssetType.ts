import { registerDecorator, ValidationOptions } from "class-validator";


export function IsValidAssetType(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidAssestType",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return typeof value === "string" &&
                        (value === 'preview' || value === 'thumbnail' || value === 'placeholder' || value === 'main')
                }
            }
        });
    };
}