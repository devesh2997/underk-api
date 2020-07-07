import { Wishlist } from "../../entity/user/Wishlist";
import { isEmpty, isNotEmpty } from "class-validator";
import { TE, TO } from "../../utils";
import { User } from "../../entity/user/User";
import { Product } from "../../entity/catalogue/Product";

export class WishlistService {
    static get = async (req: { uuid?: string }): Promise<Wishlist> => {
        if (isEmpty(req.uuid)) {
            TE("uuid not provided");
        }

        let err: any, wishlist: Wishlist;
        [err, wishlist] = await TO(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user", "product"] }
            )
        );
        if (err) TE(err);

        if (isEmpty(wishlist)) {
            [err, wishlist] = await TO(
                WishlistService.create({ uuid: req.uuid })
            );
            if (err) TE(err);
        }

        [err, wishlist] = await TO(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user", "product"] }
            )
        );
        if (err) TE(err);

        return wishlist;
    };

    static create = async (req: { uuid?: string }): Promise<Wishlist> => {
        if (isEmpty(req.uuid)) {
            TE("uuid not provided");
        }

        let err: any, wishlist: Wishlist;

        let user: User;
        [err, user] = await TO(User.findOne({ uuid: req.uuid }));
        if (err) TE(err);

        if (isEmpty(user)) {
            TE("User doesn't exist");
        }

        [err, wishlist] = await TO(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user"] }
            )
        );
        if (err) TE(err);

        if (isNotEmpty(wishlist)) {
            TE("Wishlist already exists");
        }

        wishlist = new Wishlist();
        wishlist.user = user;
        [err, wishlist] = await TO(wishlist.save());
        if (err) {
            TE("Some error occurred");
        }

        [err, wishlist] = await TO(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user"] }
            )
        );
        if (err) TE(err);

        return wishlist;
    };

    static delete = async (req: { uuid?: string }): Promise<Wishlist> => {
        if (isEmpty(req.uuid)) {
            TE("uuid not provided");
        }

        let err: any, wishlist: Wishlist;

        let user: User;
        [err, user] = await TO(User.findOne({ uuid: req.uuid }));
        if (err) TE(err);

        if (isEmpty(user)) {
            TE("User doesn't exist");
        }

        [err, wishlist] = await TO(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user"] }
            )
        );
        if (err) TE(err);

        if (isEmpty(wishlist)) {
            TE("Wishlist not found");
        }

        [err, wishlist] = await TO(Wishlist.remove(wishlist));
        if (err) TE(err);

        return wishlist;
    };

    static addProducts = async (req: {
        uuid?: string;
        productIds: string[];
    }): Promise<Wishlist> => {
        if (isEmpty(req.uuid)) {
            TE("uuid not provided");
        }

        let err: any, wishlist: Wishlist;
        [err, wishlist] = await TO(WishlistService.get({ uuid: req.uuid }));
        if (err) TE(err);

        if (isNotEmpty(req.productIds)) {
            if (isEmpty(wishlist.products)) {
                wishlist.products = [];
            }

            for (let i = 0; i < req.productIds.length; i++) {
                const pid = req.productIds[i];

                const index = wishlist.products.findIndex((p) => p.pid === pid);
                if (index >= 0) continue;

                let product: Product;
                [err, product] = await TO(Product.findOne({ pid }));
                if (err) TE(err);

                wishlist.products.push(product);
            }
        }

        [err, wishlist] = await TO(wishlist.save());
        if (err) {
            TE("Some error occurred");
        }

        [err, wishlist] = await TO(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user", "product"] }
            )
        );
        if (err) TE(err);

        return wishlist;
    };

    static deleteProducts = async (req: {
        uuid?: string;
        productIds: string[];
    }): Promise<Wishlist> => {
        if (isEmpty(req.uuid)) {
            TE("uuid not provided");
        }

        let err: any, wishlist: Wishlist;
        [err, wishlist] = await TO(WishlistService.get({ uuid: req.uuid }));
        if (err) TE(err);

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

        [err, wishlist] = await TO(wishlist.save());
        if (err) {
            TE("Some error occurred");
        }

        [err, wishlist] = await TO(
            Wishlist.findOne(
                { user: { uuid: req.uuid } },
                { relations: ["user", "product"] }
            )
        );
        if (err) TE(err);

        return wishlist;
    };
}
