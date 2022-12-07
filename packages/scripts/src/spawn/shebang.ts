import { PathOrFileDescriptor } from "fs";
import * as fs from "fs";

const shebangRegex = /^#!(.*)/;
function isHasShebang(str: string) {
    const match = str.match(shebangRegex);
    if (!match) return null;

    const [path, argument] = match[0].replace(/#! ?/, "").split(" ");
    const binary = path.split("/").pop();

    if (binary === "env") return argument;
    return argument ? `${binary} ${argument}` : binary;
}

export function readShebang(command: string) {
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd: PathOrFileDescriptor;

    try {
        fd = fs.openSync(command, "r");
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (err) {
        // do nothing;
    }

    return isHasShebang(buffer.toString());
}
