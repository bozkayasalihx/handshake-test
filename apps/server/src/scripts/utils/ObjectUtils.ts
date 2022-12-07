import { MixedList } from "typeorm";

export class ObjectUtils {
    static isObject(val: any): val is Object {
        return val !== null && typeof val === "object";
    }

    static assign<T, U>(target: T, source: U): void;

    static assign<T, U, V>(target: T, source1: U, source2: V): void;

    static assign<T, U, V, W>(
        target: T,
        source1: U,
        source2: V,
        source3: W
    ): void;

    static assign(target: object, ...sources: any[]): void {
        for (const source of sources) {
            for (const prop of Object.getOwnPropertyNames(source)) {
                (target as any)[prop] = source[prop];
            }
        }
    }

    static mixedListToArray<T>(list: MixedList<T>): T[] {
        if (list !== null && typeof list === "object") {
            return Object.keys(list).map(
                (key) => (list as { [key: string]: T })[key]
            );
        }
        return list as T[];
    }
}
