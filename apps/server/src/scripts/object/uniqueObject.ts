interface IUniqueObject<T extends DataArrayType, V extends ArrayType> {
    readData(data: T, data2: V): UniqueObject<T, V>;
    isUnique(keys: Array<string>): number;
}

type DataArrayType = [number, Record<string, any>][];
type ArrayType = Array<Record<string, any>>;

class UniqueObject<T extends DataArrayType, V extends ArrayType>
    implements IUniqueObject<T, V>
{
    private data: T;
    private data2: V;
    public readData(data: T, data2: V) {
        this.data = data;
        this.data2 = data2;

        return this;
    }

    public isUnique(properties: Array<string>) {
        const data = this.data;
        const data2 = this.data2;

        const min = Math.min(data.length, data2.length);
        const rest = Math.abs(data.length - data2.length);
        const dLength = data.length;
        const d2Length = data2.length;
        let valid = -1;

        for (let i = 0; i < properties.length; i++) {
            for (let j = 0; j < min; j++) {
                const [index, obj] = data[j];
                if (obj[properties[i]] !== data2[j][properties[i]]) {
                    valid = index;
                    return index;
                }
            }
        }

        for (let i = 0; i < properties.length; i++) {
            for (let m = min; m < rest + min; m++) {
                if (dLength > d2Length) {
                    const [index, obj] = data[m];
                    if (data2[0][properties[i]] !== obj[properties[i]]) {
                        valid = index;
                        return index;
                    }
                }
                if (d2Length > dLength) {
                    const [index, obj] = data[0];
                    if (obj[properties[i]] !== data2[m][properties[i]]) {
                        valid = index;
                        return index;
                    }
                }
            }
        }

        return valid;
    }
}

export default UniqueObject;

//NOTE: this is the test case don't delete it;
// const data = [
//     {
//         external_v_code: "salih",
//         external_bs_code: "bozkaya",
//         external_ds_code: "dean",
//     },
//     {
//         external_v_code: "salih",
//         external_bs_code: "bozkaya",
//         external_ds_code: "dean",
//     },
// ];

// const data2 = [
//     {
//         external_v_code: "salih",
//         external_bs_code: "bozkaya",
//         external_ds_code: "dean",
//     },

//     {
//         external_v_code: "salih",
//         external_bs_code: "bozkaya",
//         external_ds_code: "dean",
//     },

//     {
//         external_v_code: "salih",
//         external_bs_code: "bozkaya",
//         external_ds_code: "dean",
//     },

//     {
//         external_v_code: "salih",
//         external_bs_code: "bozkaya",
//         external_ds_code: "dean",
//     },

//     {
//         external_v_code: "salih",
//         external_bs_code: "bozkaya",
//         external_ds_code: "dean",
//     },

//     {
//         external_v_code: "salih",
//         external_bs_code: "timer is dwon",
//         external_ds_code: "dean",
//     },
// ];

// console.log(
//     new UniqueObject<typeof data, typeof data2>()
//         .readData(data, data2)
//         .isUnique(["external_v_code", "external_bs_code", "external_ds_code"])
// );
