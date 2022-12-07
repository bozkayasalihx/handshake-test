import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from "typeorm";
import { User } from "../models";
import { userOperation } from "../services";
import { UserTypes } from "../types";

@EventSubscriber()
export class UserCreateSubs implements EntitySubscriberInterface<any> {
    async beforeInsert(event: InsertEvent<any>) {
        if (!event.entity.created_by || !event.entity.updated_by) {
            let user: User | null = null;
            try {
                user = await User.findOne({ where: { username: "uncle bob" } });
            } catch (err) {
                const u = userOperation.creatUser({
                    username: "uncle bob",
                    email: "uncle_bob@gmail.com",
                    mobile: "5376852365",
                    password: "uncle_bob@gmail.com",
                    tckn: BigInt("38492384289"),
                    userType: UserTypes.VENDOR_ADMIN,
                });

                user = await u.save();
            }

            event.entity.created_by = user;
            event.entity.updated_by = user;
        }
    }

    async beforeUpdate() {
        //
    }

    async beforeRemove() {
        //
    }
}
