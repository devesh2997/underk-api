import { Request, Response } from "express";
import { ReE, ReS, TO } from "../../utils";
import { Cart } from "../../entity/user/Cart";
import { CartService } from "../../services/user/cart.service";

export class CartController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;
        let err: string, cart: Cart;

        [err, cart] = await TO(CartService.get(query));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Cart found.",
                result: cart.toJSON(),
            },
            201
        );
    };

    static create = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;
        let err: string, cart: Cart;

        [err, cart] = await TO(CartService.create(query));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Cart created.",
                result: cart.toJSON(),
            },
            201
        );
    };

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const query = req.query;
        let err: string, cart: Cart;

        [err, cart] = await TO(CartService.delete(query));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "cart deleted.",
                result: cart.toJSON(),
            },
            201
        );
    };

    static addItem = async (req: Request, res: Response): Promise<Response> => {
        const body = req.body;
        let err: string, cart: Cart;

        [err, cart] = await TO(CartService.addItem(body));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Item added to cart.",
                result: cart.toJSON(),
            },
            201
        );
    };

    static deleteItem = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const body = req.body;
        let err: string, cart: Cart;

        [err, cart] = await TO(CartService.deleteItem(body));

        if (err) return ReE(res, err, 422);

        return ReS(
            res,
            {
                message: "Item deleted from cart.",
                result: cart.toJSON(),
            },
            201
        );
    };
}
