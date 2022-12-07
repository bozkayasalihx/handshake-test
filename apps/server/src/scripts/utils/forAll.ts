import { FORBIDDEN } from "http-status";
import { Header } from "../../routes/FileUpload/VIUploadProcess";
import { HasPs } from "../../types";

type DataType = Array<Record<"invoice_no", string>>;

class ForAll {
    private data: Header;
    private valid = true;

    public readData(data: Header) {
        this.data = data;
    }
    public psChecker() {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].has_ps === HasPs.YES) {
                this.valid = true;
                return true;
            }
        }
        this.valid = false;
        return this.valid;
    }

    public invoiceChecker(data1: DataType, data2: DataType) {
        if (data1.length !== data2.length) return false;
        const temp: Set<string> = new Set();
        for (let i = 0; i < data1.length; i++) {
            if (temp.has(data1[i].invoice_no)) {
                continue;
            } else {
                temp.add(data1[i].invoice_no);
            }
        }

        for (let j = 0; j < data2.length; j++) {
            temp.delete(data2[j].invoice_no);
        }

        return temp.size > 0 ? false : true;
    }
}

export default new ForAll();
