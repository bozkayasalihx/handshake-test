import { HasPs } from "../../types";

export type ArrayRecord = Array<Record<string, any>>;
export type MapType<T> = [number, T];

export class GenKeys {
    public genMapKeys(data: Record<string, any>) {
        const key =
            data.invoice_no +
            data.external_v_code +
            data.external_ds_code +
            data.external_bs_code;

        return key;
    }
}
class GroupBy<V extends ArrayRecord> extends GenKeys {
    private data: V;
    public readData(d: V) {
        this.data = d;
        return this;
    }

    public map: Map<string, MapType<V>> = new Map();
    public abandoned: Map<string, MapType<V>> = new Map();
    public serveData() {
        return this.data;
    }

    private validateSize() {
        for (let [key, valueArray] of this.map) {
            const [index, values] = valueArray;
            if (values.length <= 1) this.abandoned.set(key, [index, values]);
        }
        return this;
    }

    public group() {
        for (let i = 0; i < this.data.length; i++) {
            let key = this.genMapKeys(this.data[i]);
            if (this.map.has(key)) {
                const [index, VType] = this.map.get(key) as MapType<V>;
                this.map.set(key, [index, [...VType, this.data[i]] as V]);
            } else {
                this.map.set(key, [i, [this.data[i]] as V]);
            }
        }
        this.validateSize();
        return this;
    }

    public sectionChecker() {
        const valid: Map<number, string> = new Map();
        for (let [_, value] of this.map) {
            const [index, vals] = value;
            let cur = vals[0];
            for (let j = 1; j < vals.length; j++) {
                if (
                    cur.external_v_code === vals[j].external_v_code &&
                    cur.external_bs_code === vals[j].external_bs_code &&
                    cur.external_ds_code === vals[j].external_ds_code
                ) {
                    cur = vals[j];
                } else {
                    valid.set(index, "external_v_code");
                    break;
                }
            }
        }
        return valid;
    }

    public getFirstElementOfMap() {
        const map = this.map;
        const temp: Array<[number, V]> = [];
        map.forEach(([i, item]) => {
            temp.push([i, item[0] as V]);
        });
        return temp;
    }

    public groupByPs() {
        const data = this.data;
        const map: Map<
            "has_ps" | "no_ps",
            Array<Record<string, any>>
        > = new Map();
        map.set("has_ps", []);
        map.set("no_ps", []);
        for (let i = 0; i < data.length; i++) {
            const curData = data[i];
            if (curData.has_ps === HasPs.YES) {
                const cur = map.get("has_ps") as Record<string, any>[];
                map.set("has_ps", [...cur, curData]);
            } else if (curData.has_ps === HasPs.NO) {
                const cur = map.get("no_ps") as Record<string, any>[];
                map.set("no_ps", [...cur, curData]);
            }
        }

        return map;
    }
}

export default GroupBy;
