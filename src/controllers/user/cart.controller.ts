import { Request, Response } from "express";
import { ReE, ReS, TOG } from "../../utils";
import { Cart } from "../../entity/user/Cart";
import { CartService } from "../../services/user/cart.service";

export class CartController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Cart | ApiError>(CartService.get(query));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Cart found.",
                result: result.toJSON(),
            },
            201
        );
    };

    static create = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Cart | ApiError>(CartService.create(query));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Cart created.",
                result: result.toJSON(),
            },
            201
        );
    };

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;

        let result = await TOG<Cart | ApiError>(CartService.delete(query));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "cart deleted.",
                result: result.toJSON(),
            },
            201
        );
    };

    static addItem = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;

        let result = await TOG<Cart | ApiError>(CartService.addItem(body));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Item added to cart.",
                result: result.toJSON(),
            },
            201
        );
    };

    static deleteItem = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;

        let result = await TOG<Cart | ApiError>(CartService.deleteItem(body));
        if (result instanceof ApiError) return ReE(res, result, 422);

        return ReS(
            res,
            {
                message: "Item deleted from cart.",
                result: result.toJSON(),
            },
            201
        );
    };
}
