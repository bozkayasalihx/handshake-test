import fs from "node:fs/promises";
import path from "node:path";

async function chechFolderAndWrite(data: string, filename: string) {
    try {
        const publicFolder = path.resolve(__dirname, "../../../src/public");
        try {
            await fs.access(publicFolder);
        } catch (err) {
            await fs.mkdir(publicFolder);
        }
        await fs.writeFile(path.join(publicFolder, `${filename}.csv`), data, {
            encoding: "utf-8",
        });
    } catch (err) {
        throw err;
    }
}

export class GenerateCsv<
    T extends { [P in keyof T]: T[P] } & Partial<{ errors: any }>
> {
    private DELIMITER: string;

    private NEW_LINE = "\n";

    constructor(
        private errors: Map<string, any>,
        private parsedData: Array<T>,
        delimiter = ";"
    ) {
        this.DELIMITER = delimiter;
    }

    private longestPropIndex(data: Array<T>) {
        let i = 0;
        let longest = 0;
        let index = 0;
        while (i < data.length) {
            const keys = Object.keys(data[i]);
            if (keys.length > longest) {
                longest = keys.length;
                index = i;
            }

            i++;
        }
        return index;
    }

    private parseErrors() {
        for (const [key, value] of this.errors) {
            const [lineNO] = key.split("__");
            // eslint-disable-next-line spaced-comment
            // ts-ignore
            if (!this.parsedData[+lineNO].errors)
                this.parsedData[+lineNO].errors = [value];
            else {
                this.parsedData[+lineNO].errors = [
                    ...this.parsedData[+lineNO].errors,
                    value,
                ];
            }
        }
        return { data: this.parsedData };
    }

    private genHeader(header: string[]) {
        return header.join(this.DELIMITER).trim();
    }

    public async generate(fileName: string) {
        const { data } = this.parseErrors();
        const index = this.longestPropIndex(data);
        let willBeWrittenData = "";
        const csvHeader = this.genHeader([...Object.keys(data[index])]);
        willBeWrittenData += csvHeader + this.NEW_LINE;
        let j = 0;
        for (let i = 0; i < data.length; i++) {
            for (const [key, value] of Object.entries(data[i])) {
                if (j === 0) willBeWrittenData += value;
                else if (!value) willBeWrittenData += this.DELIMITER;
                else if (value instanceof Array)
                    willBeWrittenData += `${this.DELIMITER}[${value}]`;
                else willBeWrittenData += this.DELIMITER + value;
                j++;
            }
            j = 0;
            willBeWrittenData += this.NEW_LINE;
        }

        const regex = /.[a-zA-Z]{2,4}$/;
        fileName = fileName.substring(0, regex.exec(fileName)?.index);
        const filename = `${fileName}___${Date.now()}.csv`;
        await chechFolderAndWrite(willBeWrittenData, filename);

        // cWorker.addToStack({ filename, file: willBeWrittenData });
        // const result = await cWorker.run();
        // console.log("resutl", result);
        // cWorker.cleanStack();
    }
}
