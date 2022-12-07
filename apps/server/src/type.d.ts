/// <reference types="express-serve-static-core" />

import * as core from "express-serve-static-core";
import { User } from "./models";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
            PG_PORT: number;
            POSTGRES_USER: string;
            POSTGRES_PASSWORD: string;
            POSTGRES_DB: string;
            PGDATA: string;
            SERVER_PORT: number;
            DB_HOST: string;
            REDIS_URL: string;
            ACCESS_TOKEN_SECRET_KEY: string;
            REFRESH_TOKEN_SECRET_KEY: string;
            SALT: number;
            EMAIL_HOST: string;
            EMAIL_PORT: number;
            EMAIL_USER: string;
            EMAIL_PASWORD: string;
            EMAIL_FROM: string;
            TOKEN_EXPIRE: number;
            ORIGIN: string;
            FORGOT_PASSWORD_SECRET_KEY: string;
            SENDER_EMAIL_PASSWORD: string;
            TZ: string;
        }
    }

    type Args<T> = {
        [P in keyof T as T[P] extends Function ? never : P]: T[P];
    };
    namespace Express {
        interface Response<
            ResBody = { message: string; data?: Record<string, any> },
            Locals extends Record<string, any> = Record<string, any>
        > extends core.Response<ResBody, Locals> {}
        interface TypedResponse
            extends Response<{ message: string; data?: Record<string, any> }> {}

        interface Request {
            user: User;
            refreshToken: string;
            payload: {
                userId: number;
                tokenVersion: number;
                [x: string]: any;
            };
            files?: fileUpload.FileArray | undefined;
        }

        namespace fileUpload {
            class FileArray {
                file: UploadedFile | Array<UploadedFile>;

                [index: string]: UploadedFile | UploadedFile[];
            }

            interface UploadedFile {
                name: string;
                mv(path: string, callback: (err: any) => void): void;
                mv(path: string): Promise<void>;
                encoding: string;
                mimetype: string;
                data: Buffer;
                tempFilePath: string;
                truncated: boolean;
                size: number;
                md5: string;
            }
        }
    }
}
