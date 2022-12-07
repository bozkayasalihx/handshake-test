type ArrayType = Array<string>;

export function isSame(data1: ArrayType, data2: ArrayType) {
    return data1.sort().join(",") === data2.sort().join(",");
}
