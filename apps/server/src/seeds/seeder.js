//eslint-
const { faker } = require("@faker-js/faker");

const axios = require("axios");
const { hashSync } = require("bcryptjs");
const { HighlightSpanKind } = require("typescript");
const { Worker } = require("worker_threads");

class Seeder {
    request = axios.create({ baseURL: "http://localhost:9000/api" });

    fake = faker;

    userRoute = "/register";

    vendorRoute = "/vendor/create-vendor";

    dealerRoute = "/dealer/create-dealer";

    dealerSiteRoute = "/dealer-site/create-dealersite";

    buyerRoute = "/buyer/create-buyer";

    buyerSiteRoute = "/buyer-site/create-buyersite";

    vdsRoute = "/relations/vds-relations";

    vdsbsRoute = "/relations/vdsbs-relations";

    userentityRoute = "/relations/create-user-entity";

    runService(data) {
        return new Promise((resolve, reject) => {
            const worker = new Worker("./worker.js", { workerData: data });
            worker.on("message", resolve);
            worker.on("error", reject);
            worker.on("exit", (code) => {
                if (code !== 0)
                    reject(
                        new Error(
                            `Stopped the Worker Thread with the exit code: ${code}`
                        )
                    );
            });
        });
    }

    // userGen().then(vendorGen).then(buyerGen).then(buyerSiteGen);

    user() {
        const types = ["SA", "V", "VA", "B", "BA", "D", "DA"];
        const random = Math.floor(Math.random() * types.length);
        const id = this.fake.random.numeric(11);
        const data = {
            email: this.fake.internet.email(),
            mobile: this.fake.random.numeric(11),
            password: "google",
            tckn: id,
            username: this.fake.random.alpha(5),
            userType: types[random],
        };
        return data;
    }

    vendor() {
        const data = {
            name: this.fake.random.word(),
            taxNo: this.fake.random.alpha(10),
            externalVCode: this.fake.random.alphaNumeric(20),
        };
        return data;
    }

    userEntity() {
        const random = Math.floor(Math.random() * 3);
        const obj = new Set([
            ["buyerSiteTableRef", null],
            ["dealerSiteTableRef", null],
            ["vendorTableRef", null],
        ]);
        Array.from(obj)[random][1] = this.randomId();
        const newObj = Object.fromEntries(obj);

        obj.entries()[random];
        const data = {
            ...newObj,
            userId: this.randomId(),
            start_date: this.fake.date.between(
                "2020-01-01T00:00:00.000Z",
                "2022-01-01T00:00:00.000Z"
            ),
            end_date: this.fake.date.between(
                "2020-01-01T00:00:00.000Z",
                "2022-01-01T00:00:00.000Z"
            ),
        };

        return data;
    }

    buyerAndDealer() {
        const data = {
            name: this.fake.random.word(),
            taxNo: parseInt(this.fake.random.numeric(10), 10),
            start_date: this.fake.date.between(
                "2020-01-01T00:00:00.000Z",
                "2022-01-01T00:00:00.000Z"
            ),
            end_date: this.fake.date.between(
                "2020-01-01T00:00:00.000Z",
                "2022-01-01T00:00:00.000Z"
            ),
        };

        return data;
    }

    randomId() {
        const randomId = Math.ceil(Math.random() * 200);
        return randomId;
    }

    vdsRelation() {
        const data = {
            vendorId: this.randomId(),
            dealerSiteId: this.randomId(),
        };

        return data;
    }

    vdsbsRelations() {
        const data = {
            vdsRltnId: this.randomId(),
            buyerSiteId: this.randomId(),
        };
        return data;
    }

    buyerSite() {
        const data = {
            name: this.fake.random.word(),
            buyerId: this.randomId(),
            start_date: this.fake.date.between(
                "2020-01-01T00:00:00.000Z",
                "2022-01-01T00:00:00.000Z"
            ),
            end_date: this.fake.date.between(
                "2020-01-01T00:00:00.000Z",
                "2022-01-01T00:00:00.000Z"
            ),
            externalVCode: this.fake.random.alphaNumeric(5),
            externalDSCode: this.fake.random.alphaNumeric(5),
            externalBSCode: this.fake.random.alphaNumeric(5),
        };

        return data;
    }

    dealerSite() {
        const data = {
            name: this.fake.random.word(),
            dealerId: this.randomId(),
            externalVCode: this.fake.random.alphaNumeric(5),
            externalDSCode: this.fake.random.alphaNumeric(5),
        };

        return data;
    }

    genData(func) {
        const array = [];
        for (let i = 0; i < 200; i++) {
            array.push(func.bind(this)());
        }
        return array;
    }

    async gen(name) {
        const map = new Map();
        map.set(
            "user",
            async () =>
                await this.runService({
                    route: this.userRoute,
                    data: this.genData(this.user),
                })
        );
        map.set(
            "vendor",
            async () =>
                await this.runService({
                    route: this.vendorRoute,
                    data: this.genData(this.vendor),
                })
        );

        map.set(
            "buyer",
            async () =>
                await this.runService({
                    route: this.buyerRoute,
                    data: this.genData(this.buyerAndDealer),
                })
        );
        map.set(
            "dealer",
            async () =>
                await this.runService({
                    route: this.dealerRoute,
                    data: this.genData(this.buyerAndDealer),
                })
        );
        map.set(
            "dealerSite",
            async () =>
                await this.runService({
                    route: this.dealerSiteRoute,
                    data: this.genData(this.dealerSite),
                })
        );
        map.set(
            "buyerSite",
            async () =>
                await this.runService({
                    route: this.buyerSiteRoute,
                    data: this.genData(this.buyerSite),
                })
        );
        map.set(
            "vds",
            async () =>
                await this.runService({
                    route: this.vdsRoute,
                    data: this.genData(this.vdsRelation),
                })
        );

        map.set(
            "vdsbs",
            async () =>
                await this.runService({
                    route: this.vdsbsRoute,
                    data: this.genData(this.vdsbsRelations),
                })
        );

        map.set(
            "user_entity",
            async () =>
                await this.runService({
                    route: this.userentityRoute,
                    data: this.genData(this.userEntity),
                })
        );

        await map.get(name)();
    }
}
const seeder = new Seeder();
const arg = process.argv[2];
seeder.gen(arg).catch((err) => console.log(err));
