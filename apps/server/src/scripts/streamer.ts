export const streamController = new AbortController();
export default class Streamer {
    public readData(data: string | Buffer, cb: (line: string) => void) {
        let unProcessed = "";
        let startIndex = 0;

        for (let ch = startIndex; ch < data.length; ch++) {
            const chstring = unProcessed + data.toString();
            unProcessed = "";
            if (chstring[ch] === "\n") {
                const line = chstring.slice(startIndex, ch);
                startIndex = ch + 1;
            }
            if (chstring[chstring.length - 1] !== "\n") {
                unProcessed = chstring.slice(startIndex);
            }
        }
    }
}
