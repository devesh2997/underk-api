import { TOG } from './../../utils/index';
import ApiError from "../../core/errors";
import Description, { DescriptionJSON } from "../../entity/catalogue/Description";
import { CAE } from "../../utils";
import { isEmpty } from "class-validator";

export class DescriptionService {
    static get = async (descriptionId: number): Promise<Description | ApiError> => {
        if (isEmpty(descriptionId)) {
            return CAE("Description id not provided");
        }

        let description = await TOG<Description | undefined>(Description.findOne({ id: descriptionId }));

        if (description instanceof ApiError) {
            return description
        }

        if (typeof description === 'undefined') {
            return CAE("Description Not Found")
        }

        return description;
    }

    static delete = async (descriptionId: number): Promise<Description | ApiError> => {
        if (isEmpty(descriptionId)) {
            return CAE("Description id not provided");
        }

        let description = await TOG<Description | undefined>(Description.findOne({ id: descriptionId }));

        if (description instanceof ApiError) {
            return description
        }

        if (typeof description === 'undefined') {
            return CAE("Description Not Found")
        }

        description = await TOG<Description>(description.remove())

        if (description instanceof ApiError) {
            return description
        }

        return description

    }

    static create = async (descriptionJSON: DescriptionJSON): Promise<Description | ApiError> => {

    }


    private getDescriptionFromJSON = (descriptionJSON: DescriptionJSON)
}