import { Wishlist } from "../../entity/user/Wishlist";
import { isEmpty, isNotEmpty } from "class-validator";
import { CAE, TOG } from "../../utils";
import { User } from "../../entity/user/User";
import { Product } from "../../entity/catalogue/Product";
import ApiError from "../../core/errors";

export class WishlistService {
    static get = async (req: {
        uuid?: string;
    }): Promise<Wishlist | ApiError> => {
        if (isEmpty(req.uuid)) {
            return CAE("uuid not provided");
        }

        let wishlist = await TOG<Wishlist | undefined>(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user", "product"] }
            )
        );
        if (wishlist instanceof ApiError) return wishlist;

        if (isEmpty(wishlist)) {
            wishlist = await TOG<Wishlist | ApiError>(
                WishlistService.create({ uuid: req.uuid })
            );
            if (wishlist instanceof ApiError) return wishlist;
        }

        wishlist = await TOG<Wishlist | undefined>(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user", "product"] }
            )
        );
        if (wishlist instanceof ApiError) return wishlist;
        else if (typeof wishlist === "undefined") {
            return CAE("Wishlist not found");
        }

        return wishlist;
    };

    static create = async (req: {
        uuid?: string;
    }): Promise<Wishlist | ApiError> => {
        if (isEmpty(req.uuid)) {
            return CAE("uuid not provided");
        }

        let user = await TOG<User | undefined>(
            User.findOne({ uuid: req.uuid })
        );
        if (user instanceof ApiError) return user;
        else if (typeof user === "undefined") {
            return CAE("User doesn't exist");
        }

        let wishlist = await TOG<Wishlist | undefined>(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user"] }
            )
        );
        if (wishlist instanceof ApiError) return wishlist;
        else if (typeof user !== "undefined") {
            return CAE("Wishlist already exists");
        }

        wishlist = new Wishlist();
        wishlist.user = user;
        wishlist = await TOG<Wishlist>(wishlist.save());
        if (wishlist instanceof ApiError) {
            return wishlist;
        }

        wishlist = await TOG<Wishlist | undefined>(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user"] }
            )
        );
        if (wishlist instanceof Wishlist) return wishlist;
        else if (typeof wishlist === "undefined") {
            return CAE("Wishlist not found");
        }

        return wishlist;
    };

    static delete = async (req: {
        uuid?: string;
    }): Promise<Wishlist | ApiError> => {
        if (isEmpty(req.uuid)) {
            return CAE("uuid not provided");
        }

        let user = await TOG<User | undefined>(
            User.findOne({ uuid: req.uuid })
        );
        if (user instanceof ApiError) return user;
        else if (typeof user === "undefined") {
            return CAE("User doesn't exist");
        }

        let wishlist = await TOG<Wishlist | undefined>(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user"] }
            )
        );
        if (wishlist instanceof ApiError) return wishlist;
        else if (typeof wishlist === "undefined") {
            return CAE("Wishlist not found");
        }

        wishlist = await TOG<Wishlist>(Wishlist.remove(wishlist));
        if (wishlist instanceof ApiError) return wishlist;

        return wishlist;
    };

    static addProducts = async (req: {
        uuid?: string;
        productIds: string[];
    }): Promise<Wishlist | ApiError> => {
        if (isEmpty(req.uuid)) {
            return CAE("uuid not provided");
        }

        let wishlist: Wishlist | ApiError | undefined;
        wishlist = await TOG<Wishlist | ApiError>(
            WishlistService.get({ uuid: req.uuid })
        );
        if (wishlist instanceof ApiError) return wishlist;

        if (isNotEmpty(req.productIds)) {
            if (isEmpty(wishlist.products)) {
                wishlist.products = [];
            }

            for (let i = 0; i < req.productIds.length; i++) {
                const pid = req.productIds[i];

                const index = wishlist.products.findIndex((p) => p.pid === pid);
                if (index >= 0) continue;

                let product = await TOG<Product | undefined>(
                    Product.findOne({ pid })
                );
                if (product instanceof ApiError) return product;
                else if (typeof product === "undefined") {
                    return CAE("Product not found");
                }

                wishlist.products.push(product);
            }
        }

        wishlist = await TOG<Wishlist>(wishlist.save());
        if (wishlist instanceof ApiError) {
            return wishlist;
        }

        wishlist = await TOG<Wishlist | undefined>(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user", "product"] }
            )
        );
        if (wishlist instanceof ApiError) return wishlist;
        else if (typeof wishlist === "undefined") {
            return CAE("Wishlist not found");
        }

        return wishlist;
    };

    static deleteProducts = async (req: {
        uuid?: string;
        productIds: string[];
    }): Promise<Wishlist | ApiError> => {
        if (isEmpty(req.uuid)) {
            return CAE("uuid not provided");
        }

        let wishlist: Wishlist | ApiError | undefined;
        wishlist = await TOG<Wishlist | ApiError>(
            WishlistService.get({ uuid: req.uuid })
        );
        if (wishlist instanceof ApiError) return wishlist;

        if (isNotEmpty(req.productIds)) {
            if (isEmpty(wishlist.products)) {
                wishlist.products = [];
            }

            for (let i = 0; i < req.productIds.length; i++) {
                const pid = req.productIds[i];

                const index = wishlist.products.findIndex((p) => p.pid === pid);
                if (index >= 0) {
                    wishlist.products.splice(index, 1);
                }
            }
        }

        wishlist = await TOG<Wishlist>(wishlist.save());
        if (wishlist instanceof ApiError) {
            return wishlist;
        }

        wishlist = await TOG<Wishlist | undefined>(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user", "product"] }
            )
        );
        if (wishlist instanceof ApiError) return wishlist;
        else if (typeof wishlist === "undefined") {
            return CAE("Wishlist not found");
        }

        return wishlist;
    };
}
