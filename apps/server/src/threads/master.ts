import { isMainThread, parentPort, Worker } from "node:worker_threads";
import { FileUploader } from "./fileUploader";

type FileUploaderParams = { filename: string; file: string };

class CustomWorker extends Worker {
    private mapStack = new Map<string, InstanceType<typeof FileUploader>>();

    constructor() {
        super(__filename);
    }

    public get isMain() {
        return isMainThread;
    }

    public workerHandler(err?: any) {
        if (err) {
            console.log("got an error when uploading file to gcp", err);
        } else {
            console.log("all done");
        }
    }

    public addToStack({ file, filename }: FileUploaderParams) {
        const unique = `${filename},${file}`;
        if (!this.mapStack.has(unique)) {
            const fileUploader = new FileUploader(filename, file);
            fileUploader.sucessCallback = this.workerHandler;
            fileUploader.errorCallback = this.workerHandler;
            this.mapStack.set(unique, fileUploader);
        }
    }

    public async runConstantly() {
        for (let [id, fileuploader] of this.mapStack) {
            await fileuploader.uploadFile();
            this.mapStack.delete(id);
        }
    }

    private listenWorker() {
        // NOTE: this method must run on main thread side
        return new Promise((resolve, reject) => {
            const errMsg = "method not implemented";
            if (typeof this.workerHandler != "function")
                throw new Error(errMsg);
            this.on("message", resolve);
            this.on("error", reject);
            this.on("exit", (code) => {
                if (code != 0) {
                    reject("exited from worker thread");
                }
            });
        });
    }

    public cleanStack() {
        this.mapStack = new Map();
    }

    public async run() {
        if (!this.isMain) {
            try {
                await this.runConstantly();
                parentPort?.postMessage("queue running");
                return true;
            } catch (err) {
                console.log("i'm the error not on main", err);
                parentPort?.postMessage(
                    `an error accured inqueue ${err.message}`
                );
                await this.terminate();
                return false;
            }
        } else {
            try {
                const vals = await this.listenWorker();
                console.log("vals", vals);
                return true;
            } catch (err) {
                console.log("err -> ", err);
                await this.terminate();
                return false;
            }
        }
    }
}

export const cWorker = new CustomWorker();

/**
 * const runOnWorkerThread = new Worker();
 *
 * const fileName = "component.csv";
 * const file = "why fucking james dean died on the stage";
 * runonWorkerThread.addToStack({fileName, file});
 * runonWorkerThread.addToStack({fileName, file});
 * runonWorkerThread.addToStack({fileName, file});
 *
 * * add much more on stack only way to do it;
 *
 * await runOnWorkerTheads.runContantl`y();
 *
 */
