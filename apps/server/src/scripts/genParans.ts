export function genParen<T extends Record<string, any>>(
    data: Set<T>,
    prop: string
) {
    const d = Array.from(data.values());
    let str = "(";
    for (let i = 0; i < d.length; i++) {
        if (i === d.length - 1) {
            str += `'${d[i][prop]}')`;
        } else {
            str += `'${d[i][prop]}' ,`;
        }
    }

    return str;
}

//NOTE: test dont delete it
// const set = new Set([
//     {
//         invoice_no: "sljfelsjdf",
//     },
//     {
//         invoice_no: "sljfelsjdf",
//     },
//     {
//         invoice_no: "sljfelsjdf",
//     },
//     {
//         invoice_no: "sljfelsjdf",
//     },
// ]);
// console.log(genParen(set, "invoice_no"));
