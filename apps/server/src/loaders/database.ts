import path from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import SnakeNamingStrategy from "../configs/typeormNamingStrategy";
import { __prod__ } from "../scripts/dev";
import "./envLoader";

const entityDir = path.join(__dirname, "../../dist/models/*.js");
const entityTsDir = path.join(__dirname, "../models/*.ts");
const migrationDir = path.join(__dirname, "../../dist/migrations/*.js");

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    database: process.env.POSTGRES_DB,
    host: process.env.DB_HOST,
    useUTC: true,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.PG_PORT,
    namingStrategy: new SnakeNamingStrategy(),
    // synchronize: !__prod__ ? true : false,
    synchronize: true,
    entities: [entityDir, entityTsDir],
    migrations: !__prod__ ? [migrationDir] : undefined,
    logger: !__prod__ ? "advanced-console" : undefined,
    logging: !__prod__ ? ["query", "error"] : false,
};

export const appDataSource = new DataSource(dataSourceOptions);
export default appDataSource;
