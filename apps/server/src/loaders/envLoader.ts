import dotenv from 'dotenv';
import path from "path";
import { __prod__ } from "../scripts/dev";

(function () {
    dotenv.config({
        path: __prod__
            ? path.resolve(__dirname, "../../.env")
            : path.resolve(__dirname, "../../.env.test"),
    });
})();
