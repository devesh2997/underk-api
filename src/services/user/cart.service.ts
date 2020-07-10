import { Cart } from "../../entity/user/Cart";
import { isEmpty, isNotEmpty } from "class-validator";
import { User } from "../../entity/user/User";
import { CartItem } from "../../entity/user/CartItem";
import { SKU } from "../../entity/inventory/SKU";
import { CAE, TOG } from "../../utils";
import ApiError from "../../core/errors";

export class CartService {
    static get = async (req: {
        uuid?: string;
        cid?: string;
    }): Promise<Cart | ApiError> => {
        if (isEmpty(req.uuid) || isEmpty(req.cid)) {
            return CAE("uuid or cid not provided");
        }

        let cart: Cart | ApiError | undefined;

        if (isNotEmpty(req.uuid)) {
            cart = await TOG<Cart | undefined>(
                Cart.findOne(
                    { user: { uuid: req.uuid } },
                    { relations: ["user"] }
                )
            );
            if (cart instanceof ApiError) return cart;
        } else {
            cart = await TOG<Cart | undefined>(
                Cart.findOne({ cid: req.cid } /*, { relations: ["user"] }*/)
            );
            if (cart instanceof ApiError) return cart;

            if (typeof cart !== "undefined" && isNotEmpty(cart.user)) {
                return CAE("unauthorized access");
            }
        }

        if (typeof cart === "undefined") {
            cart = await TOG<Cart | ApiError>(
                CartService.create({ uuid: req.uuid, cid: req.cid })
            );
            if (cart instanceof ApiError) return cart;
        }

        return cart;
    };

    static create = async (req: {
        uuid?: string;
        cid?: string;
    }): Promise<Cart | ApiError> => {
        if (isEmpty(req.uuid) || isEmpty(req.cid)) {
            return CAE("uuid or cid not provided");
        }

        let cart: Cart | ApiError | undefined;

        if (isNotEmpty(req.uuid)) {
            let user = await TOG<User | undefined>(
                User.findOne({ uuid: req.uuid })
            );
            if (user instanceof ApiError) return user;
            else if (typeof user === "undefined") {
                return CAE("User doesn't exist");
            }

            cart = await TOG<Cart | undefined>(
                Cart.findOne(
                    { user: { uuid: req.uuid } },
                    { relations: ["user"] }
                )
            );
            if (cart instanceof ApiError) return cart;
            else if (typeof cart !== "undefined") {
                return CAE("Cart already exists");
            }

            cart = new Cart();
            cart.user = user;
        } else {
            cart = await TOG<Cart | undefined>(
                Cart.findOne({ cid: req.cid } /*, { relations: ["user"] }*/)
            );
            if (cart instanceof ApiError) return cart;
            else if (typeof cart !== "undefined") {
                return CAE("Cart already exists");
            }

            cart = new Cart();
            cart.cid = req.cid!;
        }

        cart = await TOG<Cart>(cart.save());
        if (cart instanceof ApiError) {
            return cart;
        }

        // [err, cart] = await TOG<>(
        //     Cart.findOne({ user: { uuid: req.uuid } }, { relations: ["user"] })
        // );
        // if (err) return CAE(err);

        return cart;
    };

    static delete = async (req: {
        uuid?: string;
        cid?: string;
    }): Promise<Cart | ApiError> => {
        if (isEmpty(req.uuid) || isEmpty(req.cid)) {
            return CAE("uuid or cid not provided");
        }

        let cart: Cart | ApiError | undefined;

        if (isNotEmpty(req.uuid)) {
            cart = await TOG<Cart | undefined>(
                Cart.findOne(
                    { user: { uuid: req.uuid } },
                    { relations: ["user"] }
                )
            );
            if (cart instanceof ApiError) return cart;
        } else {
            cart = await TOG<Cart | undefined>(
                Cart.findOne({ cid: req.cid } /*, { relations: ["user"] }*/)
            );
            if (cart instanceof ApiError) return cart;

            if (typeof cart !== "undefined" && isNotEmpty(cart.user)) {
                return CAE("unauthorized access");
            }
        }

        if (typeof cart === "undefined") {
            return CAE("Cart not found");
        }

        cart = await TOG<Cart>(Cart.remove(cart));
        if (cart instanceof ApiError) return cart;

        return cart;
    };

    static addItem = async (req: {
        uuid?: string;
        cid?: string;
        sku?: string;
        quantity?: number;
    }): Promise<Cart | ApiError> => {
        if (isEmpty(req.uuid) || isEmpty(req.cid)) {
            return CAE("uuid or cid not provided");
        }
        if (isEmpty(req.sku)) {
            return CAE("sku not provided");
        }
        if (isEmpty(req.quantity)) {
            return CAE("quantity not provided");
        }

        let cart: Cart | ApiError | undefined;
        cart = await TOG<Cart | ApiError>(
            CartService.get({ uuid: req.uuid, cid: req.cid })
        );
        if (cart instanceof ApiError) return cart;

        if (isEmpty(cart.items)) {
            cart.items = [];
        }

        let sku = await TOG<SKU | undefined>(SKU.findOne({ sku: req.sku }));
        if (sku instanceof ApiError) return sku;
        else if (typeof sku === "undefined") {
            return CAE("sku not found");
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

        cart = await TOG<Cart>(cart.save());
        if (cart instanceof ApiError) {
            return cart;
        }

        // [err, cart] = await TOG<>(
        //     Cart.findOne(
        //         { user: { uuid: req.uuid } },
        //         { relations: ["user", "product"] }
        //     )
        // );
        // if (err) return CAE(err);

        return cart;
    };

    static deleteItem = async (req: {
        uuid?: string;
        cid?: string;
        sku?: string;
    }): Promise<Cart | ApiError> => {
        if (isEmpty(req.uuid) || isEmpty(req.cid)) {
            return CAE("uuid or cid not provided");
        }
        if (isEmpty(req.sku)) {
            return CAE("sku not provided");
        }

        let cart: Cart | ApiError | undefined;
        cart = await TOG<Cart | ApiError>(
            CartService.get({ uuid: req.uuid, cid: req.cid })
        );
        if (cart instanceof ApiError) return cart;

        if (isEmpty(cart.items)) {
            cart.items = [];
        }

        cart.items = cart.items.filter((it) => it.sku.sku !== req.sku);

        cart = await TOG<Cart>(cart.save());
        if (cart instanceof ApiError) {
            return cart;
        }

        // [err, cart] = await TOG<>(
        //     Cart.findOne(
        //         { user: { uuid: req.uuid } },
        //         { relations: ["user", "product"] }
        //     )
        // );
        // if (err) return CAE(err);

        return cart;
    };
}
