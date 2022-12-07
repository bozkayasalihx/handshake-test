import { SpawnOptions } from "node:child_process";

export type Parsed = {
    command: string;
    args?: string[] | null;
    options?: SpawnOptions | string[];
    file?: string;
    original?: {
        command?: string;
        args?: string[];
    };
};
