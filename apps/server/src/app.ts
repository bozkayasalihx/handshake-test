import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { eventHandler } from "./configs";
import { config } from "./loaders";
import "./loaders/envLoader";
import { authenticate, permission } from "./middlewares";
import {
    advanceRoute,
    buyerRoute,
    BuyerSiteRoute,
    dealerRoute,
    DealerSiteRoute,
    depositRoute,
    invoiceRoute,
    meRoute,
    paymentRoute,
    productRoute,
    PSIUploadProcess,
    relationRoute,
    userRoute,
    vdsbsRoute,
    VendorRegionRoute,
    vendorRoute,
    VIUploadProcess,
} from "./routes";
import { __prod__ } from "./scripts/dev";
import { ParentRoutes } from "./types/routePath";

export const main = async () => {
    await config();
    eventHandler();
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(
        cors({
            // origin: process.env.ORIGIN ??
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    app.use(helmet());
    // app.use(csurf({ cookie: true }));
    !__prod__ && app.use(morgan("dev"));

    app.use(
        ParentRoutes.STATIC,
        express.static(path.join(__dirname, "../src/public"))
    );

    app.use(ParentRoutes.ROOT_ROUTE, userRoute);
    // after this middeleware all route protected;
    app.use(authenticate);
    app.use(permission);
    /** routes */
    app.use(ParentRoutes.USERROUTE, meRoute);
    app.use(ParentRoutes.VENDORS, vendorRoute);
    app.use(ParentRoutes.VENDOR_REGIONS, VendorRegionRoute);
    app.use(ParentRoutes.BUYERS, buyerRoute);
    app.use(ParentRoutes.BUYER_SITES, BuyerSiteRoute);
    app.use(ParentRoutes.DEALERS, dealerRoute);
    app.use(ParentRoutes.DEALER_SITES, DealerSiteRoute);
    app.use(ParentRoutes.RELATIONS, relationRoute);
    app.use(ParentRoutes.DEPOSITS, depositRoute);
    app.use(ParentRoutes.ADVANCES, advanceRoute);
    app.use(ParentRoutes.FILE_UPLOAD, PSIUploadProcess);
    app.use(ParentRoutes.FILE_UPLOAD, VIUploadProcess);
    app.use(ParentRoutes.PRODUCT, productRoute);
    app.use(ParentRoutes.INVOICE, invoiceRoute);
    app.use(ParentRoutes.VDSBS, vdsbsRoute);
    app.use(ParentRoutes.PAYMENT, paymentRoute);

    app.listen(process.env.SERVER_PORT, () => {
        console.log(`server started at port: ${process.env.SERVER_PORT}`);
    });
};
process.on("unhandledRejection", (reason) => {
    // eslint-disable-next-line no-console
    console.log("rejections reason", reason);
});
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.log("server down => \n", JSON.stringify(err, null, 4));
    throw err;
});
