import { vendorToDealerSiteToBuyerSiteOperation } from ".";
import {
    UserEntityRelation,
    VendorToDealerSite,
    VendorToDealerSiteToBuyerSite,
} from "../models";
import formater from "../scripts/formater";
import BaseService from "./BaseService";
import userEntityRelationOperation from "./userEntityRelationOperation";

type EntityReturType = Array<{
    relatedVendorId?: number;
    relatedDealerSiteId?: number;
    relatedBuyerSiteId?: number;
    userId: number;
}>;

type ReturnTypeVDSVS = VendorToDealerSiteToBuyerSite;

type WhichType = Record<string, boolean>;
type InterceptType = ReturnTypeVDSVS | false;

type NestedType = {
    id: number;
    name: string;
    buyer: Record<string, any>;
    dealer: Record<string, any>;
};

export type DataStruct = NestedType;

const BUYERSITE = "buyersite";
const DEALERSITE = "dealersite";

class UserToVdsbs extends BaseService {
    private userId: number = 0;
    private store: Set<Promise<InterceptType[] | false>> = new Set();
    public valid = true;

    public set setUserId(userId: number) {
        this.userId = userId;
    }

    private arranger(userEntitys: UserEntityRelation[]): EntityReturType {
        return userEntitys.map((entity) => {
            return {
                relatedVendorId: entity?.vendorTableRef?.id,
                relatedDealerSiteId: entity?.dealerSiteTableRef?.id,
                relatedBuyerSiteId: entity?.buyerSiteTableRef?.id,
                userId: entity.userId,
            };
        });
    }

    private async findUserEntity() {
        const userEntity = await userEntityRelationOperation.repo.find({
            where: { userId: this.userId },
            relations: {
                buyerSiteTableRef: true,
                dealerSiteTableRef: true,
                vendorTableRef: true,
            },
        });

        if (!userEntity) return false;

        return this.arranger(userEntity);
    }

    public async tableRouter(getAll = false, active = false) {
        const relations = await this.findUserEntity();
        if (!relations) {
            this.valid = false;
            return this;
        }

        for (let i = 0; i < relations.length; i++) {
            const res = relations[i];
            if (res.relatedBuyerSiteId) {
                this.store.add(
                    this.ifItsBuyerSite(res.relatedBuyerSiteId, getAll, active)
                );
            } else if (res.relatedDealerSiteId) {
                this.store.add(
                    this.ifItsDealerSite(
                        res.relatedDealerSiteId,
                        getAll,
                        active
                    )
                );
            } else if (res.relatedVendorId) {
                this.store.add(
                    this.ifItsVendor(res.relatedVendorId, getAll, active)
                );
            }
        }
        return this;
    }

    private async sequence(
        id: number,
        specificIdName: string,
        getAll: boolean,
        active: boolean
    ): Promise<VendorToDealerSiteToBuyerSite[] | false> {
        const vdsQb = this.source
            .getRepository(VendorToDealerSite)
            .createQueryBuilder(`vds`);

        const vdsbsQb = this.source
            .getRepository(VendorToDealerSiteToBuyerSite)
            .createQueryBuilder("vdsbs");

        const vds = (await vdsQb.connection.query(
            `select id  from vds_relations where ${specificIdName} = '${id}'`
        )) as { id: number }[];

        if (vds.length) {
            const last = vds.length - 1;
            const temp: Array<Promise<VendorToDealerSiteToBuyerSite | null>> =
                [];

            let query = "(";
            for (let i = last; i >= 0; i--) {
                if (i == 0) query += `${vds[i].id})`;
                else query += `${vds[i].id},`;
            }

            const allVdsbs = vdsbsQb.where(`vdsbs.vds_rltn_id in ${query}`);

            if (getAll) {
                allVdsbs
                    .leftJoinAndSelect("vdsbs.vToDS", "vds")
                    .leftJoinAndSelect("vdsbs.buyerSite", BUYERSITE)
                    .leftJoinAndSelect(`${BUYERSITE}.buyer`, "buyer")
                    .leftJoinAndSelect("vds.vendor", "vendor")
                    .leftJoinAndSelect("vds.dealerSite", DEALERSITE)
                    .leftJoinAndSelect(`${DEALERSITE}.dealer`, "dealer");
                if (active) {
                    const actives = this.activeRecords();
                    allVdsbs.andWhere(actives);
                }
            } else {
                allVdsbs.select("id", "vdsbs_id");
            }

            return allVdsbs.getMany();
        }

        return false;
    }

    private activeRecords() {
        const tables = ["vds", DEALERSITE, "vendor", BUYERSITE];
        let condition = "";
        let i = 0;
        while (i < tables.length) {
            if (i === tables.length - 1)
                condition += `${tables[i]}.start_date < NOW() AND ${tables[i]}.end_date > NOW()`;
            else
                condition += `${tables[i]}.start_date < NOW() AND ${tables[i]}.end_date > NOW() AND `;
            i++;
        }
        return condition;
    }

    private tsDateToPostgres(date: Date) {
        function zeroPad(d: number) {
            // eslint-diable-next-line prefer-template
            return ("0" + d).slice(-2);
        }

        const parsed = new Date(date);
        return [
            parsed.getUTCFullYear(),
            zeroPad(parsed.getMonth() + 1),
            zeroPad(parsed.getDate()),
            zeroPad(parsed.getHours()),
            zeroPad(parsed.getMinutes()),
            zeroPad(parsed.getSeconds()),
        ].join(" ");
    }

    private ifItsDealerSite(id: number, getAll: boolean, active: boolean) {
        const specificIdName = "dealer_site_id";
        return this.sequence(id, specificIdName, getAll, active);
    }

    private ifItsVendor(id: number, getAll: boolean, active: boolean) {
        const specificIdName = "vendor_id";
        return this.sequence(id, specificIdName, getAll, active);
    }

    private ifItsBuyerSite(
        id: number,
        getAll = false,
        active = false
    ): Promise<ReturnTypeVDSVS[]> {
        const vdsbsQB = vendorToDealerSiteToBuyerSiteOperation.repo
            .createQueryBuilder("vdsbs")
            .where("vdsbs.buyer_site_id = :id", { id });
        if (getAll) {
            vdsbsQB
                .leftJoinAndSelect("vdsbs.vToDS", "vds")
                .leftJoinAndSelect("vds.vendor", "vendor")
                .leftJoinAndSelect("vds.dealerSite", DEALERSITE)
                .leftJoinAndSelect(`${DEALERSITE}.dealer`, "dealer")
                .leftJoinAndSelect("vdsbs.buyerSite", BUYERSITE)
                .leftJoinAndSelect(`${BUYERSITE}.buyer`, "buyer");
            if (active) {
                vdsbsQB.andWhere(this.activeRecords());
            }
            return vdsbsQB.getMany();
        } else if (active) {
            return vdsbsQB
                .andWhere(this.activeRecords())
                .select("vdsbs.id", "vdsbs_id")
                .execute();
        } else {
            return vdsbsQB.select("vdsbs.id", "vdsbs_id").execute();
        }
    }

    public async reformater() {
        const data = await Promise.all(this.store);

        const temp: Array<any> = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i] === false) {
                continue;
            }
            data[i] = data[i] as InterceptType[];
            //@ts-ignore
            for (let j = 0; j < data[i].length; j++) {
                temp.push(data[i][j]);
            }
        }
        this.store = new Set();
        const d = formater.advanceTransformer(temp);
        return d;
    }

    private dfs(
        data:
            | Record<string, string | Record<string, string>>
            | Record<string, any>
    ) {
        let stack: Record<string, any> = {};
        function inner(
            data:
                | Record<string, string | Record<string, string>>
                | Record<string, any>,
            prefix: string | undefined
        ) {
            if (data == null || data == undefined) return;

            const keys = Object.keys(data);

            for (let i = 0; i < keys.length; i++) {
                const cur = data[keys[i]];
                if (typeof cur == "object") {
                    inner(cur, keys[i]);
                } else {
                    console.log("cur", cur);
                }
            }
        }

        inner(data, undefined);
        return stack;
    }

    public async whichColumn(
        data: Record<string, string | Record<string, any>>[]
    ) {
        const stack = this.dfs(data[0]);
        // console.log(JSON.stringify(stack, null, 4));
    }
}

export default new UserToVdsbs();
