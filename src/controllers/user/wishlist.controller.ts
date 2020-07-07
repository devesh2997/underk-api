import { Request, Response } from "express";
import { ReE, ReS, TO } from "../../utils";
import { WishlistService } from "../../services/user/wishlist.service";
import { Wishlist } from "../../entity/user/Wishlist";

export class WishlistController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;
        let err: string, wishlist: Wishlist;

        [err, wishlist] = await TO(WishlistService.get(query));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Wishlist found.",
                result: wishlist.toJSON(),
            },
            201
        );
    };

    static create = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;
        let err: string, wishlist: Wishlist;

        [err, wishlist] = await TO(WishlistService.create(query));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Wishlist created.",
                result: wishlist.toJSON(),
            },
            201
        );
    };

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;
        let err: string, wishlist: Wishlist;

        [err, wishlist] = await TO(WishlistService.delete(query));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Wishlist deleted.",
                result: wishlist.toJSON(),
            },
            201
        );
    };

    static addProducts = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;
        let err: string, wishlist: Wishlist;

        [err, wishlist] = await TO(WishlistService.addProducts(body));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Products added to wishlist.",
                result: wishlist.toJSON(),
            },
            201
        );
    };

    static deleteProducts = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;
        let err: string, wishlist: Wishlist;

        [err, wishlist] = await TO(WishlistService.deleteProducts(body));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Products deleted from wishlist.",
                result: wishlist.toJSON(),
            },
            201
        );
    };
}
