import { SpawnOptions } from "child_process";
import * as path from "path";
import * as which from "which";
import pathKey from "./pathKey";
import { Parsed } from "./type";

function resolveCommandAtttempt(parsed: Parsed, withoutPathExt?: boolean) {
    const env = (parsed.options as SpawnOptions).env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = (parsed.options as SpawnOptions).cwd != null;

    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined;

    if (shouldSwitchCwd) {
        try {
            process.chdir((parsed.options as SpawnOptions).cwd as string);
        } catch (err) {
            // do nothing
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: env[pathKey({ env })],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (er) {
        //
    } finally {
        if (shouldSwitchCwd) process.chdir(cwd);
    }

    if (resolved) {
        resolved = path.resolve(
            hasCustomCwd
                ? ((parsed.options as SpawnOptions).cwd as string)
                : "",
            resolved
        );
    }

    return resolved;
}

export default function resolveCommand(parsed: Parsed) {
    return (
        resolveCommandAtttempt(parsed) || resolveCommandAtttempt(parsed, true)
    );
}
