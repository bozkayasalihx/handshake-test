import { ChildProcess, SpawnOptions } from "node:child_process";
import * as cp from "node:child_process";
import { parse } from "./parse";

// eslint-disable-next-line import/prefer-default-export
export function spawn(
    command: string,
    args?: string[],
    options?: SpawnOptions | string[]
): ChildProcess {
    const parsed = parse(command, args, options);

    const spawned = cp.spawn(
        parsed.command,
        parsed.args as readonly string[],
        parsed.options as SpawnOptions
    );

    return spawned;
}
