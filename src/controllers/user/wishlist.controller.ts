import { Request, Response } from "express";
import { ReE, ReS, TOG } from "../../utils";
import { WishlistService } from "../../services/user/wishlist.service";
import { Wishlist } from "../../entity/user/Wishlist";

export class WishlistController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Wishlist | ApiError>(WishlistService.get(query));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Wishlist found.",
                result: result.toJSON(),
            },
            201
        );
    };

    static create = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Wishlist | ApiError>(
            WishlistService.create(query)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Wishlist created.",
                result: result.toJSON(),
            },
            201
        );
    };

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Wishlist | ApiError>(
            WishlistService.delete(query)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Wishlist deleted.",
                result: result.toJSON(),
            },
            201
        );
    };

    static addProducts = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;

        let result = await TOG<Wishlist | ApiError>(
            WishlistService.addProducts(body)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Products added to wishlist.",
                result: result.toJSON(),
            },
            201
        );
    };

    static deleteProducts = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;

        let result = await TOG<Wishlist | ApiError>(
            WishlistService.deleteProducts(body)
        );
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Products deleted from wishlist.",
                result: result.toJSON(),
            },
            201
        );
    };
}
