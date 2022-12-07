/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-named-as-default */
import { __prod__ } from "../../scripts/dev";
import { DataSource, QueryRunner } from "typeorm";
import appDataSource, { dataSourceOptions } from "../../loaders/database";
import ErrorMatcher from "../../scripts/utils/errorMatcher";
import { TypedResponse } from "../../types";

export default class DatabaseTransaction {
    private static connection: DataSource;

    public static connect() {
        DatabaseTransaction.connection = appDataSource;

        if (!DatabaseTransaction.connection.isInitialized) {
            DatabaseTransaction.connection = new DataSource(dataSourceOptions);
            return DatabaseTransaction.connection;
        }
        return DatabaseTransaction.connection;
    }

    //@ts-ignore
    public static async transection<T>(
        callback: (queryRunner: QueryRunner) => Promise<T>,
        res?: TypedResponse,
        handler?: (valid: boolean) => void
    ) {
        const dataSource = DatabaseTransaction.connect();
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await callback(queryRunner);
            handler && handler(true);
            await queryRunner.commitTransaction();
        } catch (err) {
            !__prod__ && console.log(err);
            handler && handler(false);
            await queryRunner.rollbackTransaction();
            if (res) {
                const errorMatcher = new ErrorMatcher(err);
                await queryRunner.release();
                return errorMatcher.matcher(res);
            }
        } finally {
            await queryRunner.release();
        }
    }
}
