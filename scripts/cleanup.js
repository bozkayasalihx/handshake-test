const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

const main = async () => {
    try {
        console.log('location root path \n',)
        const { stdout } = await exec("git rev-parse --show-toplevel");
        const appsFolder = `${stdout.replace(/\n/, "")}/apps`;
        const packagesFolder = `${stdout.replace(/\n/, "")}/packages`;
        const apps = (await exec(`ls ${appsFolder}`)).stdout
            .split("\n")
            .filter(Boolean);

        const packages = (await exec(`ls ${packagesFolder}`)).stdout
            .split("\n")
            .filter(Boolean);

        await exec(`rm -rf ${stdout.replace(/\n/, "")}/node_modules`);

        let temp = [];

        for (let i = 0; i < apps.length; i++) {
            const curFolder = appsFolder + `/${apps[i]}/node_modules`;
            temp.push(exec(`rm -rf ${curFolder}`));
        }
        await Promise.all(temp);
        temp = [];

        for (let j = 0; j < packages.length; j++) {
            const curFolder = packagesFolder + `/${packages[j]}/node_modules`;
            temp.push(exec(`rm -rf ${curFolder}`));
        }
        await Promise.all(temp);
        console.log("all done \n");
    } catch (err) {
        throw new Error(err.message);
    }
};

main();
