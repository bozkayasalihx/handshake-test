export const stringify = (data: Record<string, any>) => {
    const keys = Object.keys(data);
    const newObj: Record<string, any> = {};
    for (let i = 0; i < keys.length; i++) {
        newObj[keys[i]] = String(data[keys[i]]);
    }
    return newObj;
};
