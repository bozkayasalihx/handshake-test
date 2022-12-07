/**
 * what i want to emiiter that emits and object and in the
 * same time create new csv generated csv file ;
 * **
 * what will be stucture be like this
 * call generate().emit().key(salih).value(body);
 */

import { EventEmitter } from "node:stream";
import { GenerateCsv } from "../parser/generateCsv";

type EventNames = "send_data" | "gen_csv";
type EventCallBack = (errors: Map<string, any>) => void;

export class SuperGenerate<T extends Record<string, any>>
    implements EventEmitter
{
    constructor(data: Array<T>, event: EventNames, filename: string) {
        this.addListener(event, async (errors) => {
            await this.genCsv(errors, data, filename);
        });
    }

    private events: Map<EventNames, Set<EventCallBack>> = new Map();
    public addListener(eventName: EventNames, listener: EventCallBack): this {
        const events = this.events;
        if (events.has(eventName)) {
            events.set(
                eventName,
                //@ts-ignore
                new Set([...events.get(eventName), listener])
            );
        } else {
            events.set(eventName, new Set([listener]));
        }
        this.events = events;
        return this;
    }
    public removeListener(
        eventName: EventNames,
        listener: (...args: any[]) => void
    ): this {
        if (!this.events.has(eventName)) return this;
        this.events.get(eventName)?.delete(listener);
        return this;
    }

    public removeAllListeners(event?: EventNames): this {
        if (event) {
            this.events.delete(event);
        } else {
            this.events = new Map<EventNames, Set<EventCallBack>>();
        }
        return this;
    }

    public listeners(eventName: EventNames): Function[] {
        if (!this.events.has(eventName)) return [];
        return Array.from(this.events.get(eventName) as Set<EventCallBack>);
    }

    public emit(eventName: EventNames, args: Map<string, any>): boolean {
        if (!this.events.has(eventName)) return false;
        const events = Array.from(
            this.events.get(eventName) as Set<EventCallBack>
        );
        while (events.length) {
            const callback = events.pop() as EventCallBack;
            callback(args);
        }
        return true;
    }

    public prependListener(
        eventName: EventNames,
        listener: (args: Map<string, any>) => void
    ): this {
        if (this.events.has(eventName)) {
            this.events.set(
                eventName,
                //@ts-ignore
                new Set([listener, ...this.events.get(eventName)])
            );
        } else {
            this.events.set(eventName, new Set([listener]));
        }
        return this;
    }

    public async genCsv(
        errors: Map<string, any>,
        data: Array<T>,
        fileName: string
    ) {
        const gen = new GenerateCsv<T>(errors, data);
        await gen.generate(fileName);
    }

    prependOnceListener(
        eventName: EventNames,
        listener: (...args: any[]) => void
    ): this {
        throw new Error("Method not implemented.");
    }
    eventNames(): EventNames[] {
        throw new Error("Method not implemented.");
    }

    listenerCount(eventName: EventNames): number {
        throw new Error("Method not implemented.");
    }

    on(eventName: EventNames, listener: EventCallBack): this {
        throw new Error("Method not implemented.");
    }
    once(eventName: EventNames, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    off(eventName: EventNames, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    setMaxListeners(n: number): this {
        throw new Error("Method not implemented.");
    }
    getMaxListeners(): number {
        throw new Error("Method not implemented.");
    }
    rawListeners(eventName: EventNames): Function[] {
        throw new Error("Method not implemented.");
    }
}
