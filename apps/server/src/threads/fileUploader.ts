import { Storage } from "@google-cloud/storage";
import path from "node:path";
import { PassThrough } from "stream";

export type Callback = (msg?: any) => void;

const PROJECTID = "secret-meridian-358615";
const LOCATION = "EUROPE-WEST3";

export class FileUploader extends Storage {
    private bucketname = "file-uploader-csv";
    private destFileName: string;
    private content: string;
    public sucessCallback: Callback;
    public errorCallback: Callback;

    constructor(destinationFilename: string, content: string) {
        super({
            projectId: PROJECTID,
            keyFile: path.resolve(
                __dirname,
                "../configs/secret-meridian-358615-edd6859a961c.json"
            ),
        });
        this.destFileName = destinationFilename;
        this.content = content;
    }

    private async getProject() {
        return await this.getProjectId();
    }
    private async getBucket() {
        let bucket = this.bucket(this.bucketname);
        const [isExists] = await bucket.exists();
        if (!isExists) {
            bucket = (
                await this.createBucket(this.bucketname, {
                    location: LOCATION,
                    storageClass: "COLDLINE",
                })
            )[0];
        }
        return bucket;
    }

    public async uploadFile() {
        if (!this.sucessCallback || !this.errorCallback) {
            throw new Error("implement sucess callback or error callback");
        }
        try {
            const bucket = await this.getBucket();
            const file = bucket.file(this.destFileName);
            const streamPassThrough = new PassThrough();

            streamPassThrough.write(this.content);
            streamPassThrough.end();

            streamPassThrough.pipe(
                file.createWriteStream().on("finish", () => {
                    this.sucessCallback();
                })
            );
        } catch (err) {
            return this.errorCallback(err);
        }
    }
}
