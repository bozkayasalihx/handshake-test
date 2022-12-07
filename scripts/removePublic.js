const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

async function remove() {
    try {
        console.log("cleaning up");
        const topLevel = (
            await exec("git rev-parse --show-toplevel")
        ).stdout.replace("\n", "");

        await exec(`rm -rf ${topLevel}/apps/server/src/public`);
        console.log("clean up done...");
    } catch (err) {
        console.log("an error accured please try again later");
        throw err;
    }
}
remove();
