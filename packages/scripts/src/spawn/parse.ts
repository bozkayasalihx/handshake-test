/* eslint-disable no-param-reassign */
import { SpawnOptions } from "child_process";
import * as path from "path";
import * as escape from "./escape";
import resolveCmd from "./resolve";
import { readShebang } from "./shebang";
import { Parsed } from "./type";

const isWin = process.platform === "win32";
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed: Parsed) {
    parsed.file = resolveCmd(parsed);

    const shebang = parsed.file && readShebang(parsed.file);
    if (shebang) {
        parsed.args?.unshift(parsed.file as string);
        parsed.command = shebang;
        return resolveCmd(parsed);
    }
    return parsed.file;
}

function parseNonShell(parsed: Parsed) {
    if (!isWin) return parsed;

    const commandFile = detectShebang(parsed);

    const needsShell = !isExecutableRegExp.test(commandFile);

    if (needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        parsed.command = path.normalize(parsed.command);

        parsed.command = escape.escapeCommand(parsed.command);
        parsed.args = parsed.args?.map((arg) =>
            escape.escapeArgument(arg, needsDoubleEscapeMetaChars)
        );

        const shellCommand = [parsed.command]
            .concat(parsed.args as readonly string[])
            .join(" ");

        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        (parsed.options as SpawnOptions).windowsVerbatimArguments = true;
    }

    return parsed;
}

// eslint-disable-next-line import/prefer-default-export
export function parse(
    command: string,
    args?: string[] | null,
    options?: SpawnOptions | string[]
) {
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? [...args] : [];
    options = { ...options };

    const parsed: Parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            args,
            command,
        },
    };

    return (options as SpawnOptions).shell ? parsed : parseNonShell(parsed);
}
