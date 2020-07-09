import { Cart } from "../../entity/user/Cart";
import { isEmpty, isNotEmpty } from "class-validator";
import { TE, TO } from "../../utils";
import { User } from "../../entity/user/User";
import { CartItem } from "../../entity/user/CartItem";
import { SKU } from "../../entity/inventory/SKU";

export class CartService {
    static get = async (req: {
        uuid?: string;
        cid?: string;
    }): Promise<Cart> => {
        if (isEmpty(req.uuid) || isEmpty(req.cid)) {
            TE("uuid or cid not provided");
        }

        let err: any, cart: Cart;

        if (isNotEmpty(req.uuid)) {
            [err, cart] = await TO(
                Cart.findOne(
                    { user: { uuid: req.uuid } },
                    { relations: ["user"] }
                )
            );
            if (err) TE(err);
        } else {
            [err, cart] = await TO(
                Cart.findOne({ cid: req.cid } /*, { relations: ["user"] }*/)
            );
            if (err) TE(err);

            if (isNotEmpty(cart) && isNotEmpty(cart.user)) {
                TE("unauthorized access");
            }
        }

        if (isEmpty(cart)) {
            [err, cart] = await TO(
                CartService.create({ uuid: req.uuid, cid: req.cid })
            );
            if (err) TE(err);
        }

        return cart;
    };

    static create = async (req: {
        uuid?: string;
        cid?: string;
    }): Promise<Cart> => {
        if (isEmpty(req.uuid) || isEmpty(req.cid)) {
            TE("uuid or cid not provided");
        }

        let err: any, cart: Cart;

        if (isNotEmpty(req.uuid)) {
            let user: User;
            [err, user] = await TO(User.findOne({ uuid: req.uuid }));
            if (err) TE(err);

            if (isEmpty(user)) {
                TE("User doesn't exist");
            }

            [err, cart] = await TO(
                Cart.findOne(
                    { user: { uuid: req.uuid } },
                    { relations: ["user"] }
                )
            );
            if (err) TE(err);

            if (isNotEmpty(cart)) {
                TE("Cart already exists");
            }

            cart = new Cart();
            cart.user = user;
        } else {
            [err, cart] = await TO(
                Cart.findOne({ cid: req.cid } /*, { relations: ["user"] }*/)
            );
            if (err) TE(err);

            if (isNotEmpty(cart)) {
                TE("Cart already exists");
            }

            cart = new Cart();
            cart.cid = req.cid!;
        }

        [err, cart] = await TO(cart.save());
        if (err) {
            TE("Some error occurred");
        }

        // [err, cart] = await TO(
        //     Cart.findOne({ user: { uuid: req.uuid } }, { relations: ["user"] })
        // );
        // if (err) TE(err);

        return cart;
    };

    static delete = async (req: {
        uuid?: string;
        cid?: string;
    }): Promise<Cart> => {
        if (isEmpty(req.uuid) || isEmpty(req.cid)) {
            TE("uuid or cid not provided");
        }

        let err: any, cart: Cart;

        if (isNotEmpty(req.uuid)) {
            [err, cart] = await TO(
                Cart.findOne(
                    { user: { uuid: req.uuid } },
                    { relations: ["user"] }
                )
            );
            if (err) TE(err);
        } else {
            [err, cart] = await TO(
                Cart.findOne({ cid: req.cid } /*, { relations: ["user"] }*/)
            );
            if (err) TE(err);

            if (isNotEmpty(cart) && isNotEmpty(cart.user)) {
                TE("unauthorized access");
            }
        }

        if (isEmpty(cart)) {
            TE("Cart not found");
        }

        [err, cart] = await TO(Cart.remove(cart));
        if (err) TE(err);

        return cart;
    };

    static addItem = async (req: {
        uuid?: string;
        cid?: string;
        sku?: string;
        quantity?: number;
    }): Promise<Cart> => {
        if (isEmpty(req.uuid) || isEmpty(req.cid)) {
            TE("uuid or cid not provided");
        }
        if (isEmpty(req.sku)) {
            TE("sku not provided");
        }
        if (isEmpty(req.quantity)) {
            TE("quantity not provided");
        }

        let err: any, cart: Cart;
        [err, cart] = await TO(
            CartService.get({ uuid: req.uuid, cid: req.cid })
        );
        if (err) TE(err);

        if (isEmpty(cart.items)) {
            cart.items = [];
        }

        let sku: SKU;
        [err, sku] = await TO(SKU.findOne({ sku: req.sku }));
        if (err) TE(err);

        if (isEmpty(sku)) {
            TE("sku not found");
        }

        let idx,
            flag = false;
        for (idx = 0; idx < cart.items.length; idx++) {
            if (cart.items[idx].sku.sku) {
                flag = true;
                break;
            }
        }
        if (flag) {
            cart.items[idx].quantity = req.quantity!;
        } else {
            cart.items.push(new CartItem(sku, req.quantity!));
        }

        [err, cart] = await TO(cart.save());
        if (err) {
            TE("Some error occurred");
        }

        // [err, cart] = await TO(
        //     Cart.findOne(
        //         { user: { uuid: req.uuid } },
        //         { relations: ["user", "product"] }
        //     )
        // );
        // if (err) TE(err);

        return cart;
    };

    static deleteItem = async (req: {
        uuid?: string;
        cid?: string;
        sku?: string;
    }): Promise<Cart> => {
        if (isEmpty(req.uuid) || isEmpty(req.cid)) {
            TE("uuid or cid not provided");
        }
        if (isEmpty(req.sku)) {
            TE("sku not provided");
        }

        let err: any, cart: Cart;
        [err, cart] = await TO(
            CartService.get({ uuid: req.uuid, cid: req.cid })
        );
        if (err) TE(err);

        if (isEmpty(cart.items)) {
            cart.items = [];
        }

        cart.items = cart.items.filter((it) => it.sku.sku !== req.sku);

        [err, cart] = await TO(cart.save());
        if (err) {
            TE("Some error occurred");
        }

        // [err, cart] = await TO(
        //     Cart.findOne(
        //         { user: { uuid: req.uuid } },
        //         { relations: ["user", "product"] }
        //     )
        // );
        // if (err) TE(err);

        return cart;
    };
}
