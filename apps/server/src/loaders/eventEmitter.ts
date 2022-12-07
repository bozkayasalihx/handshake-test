import { captureRejectionSymbol, EventEmitter } from "events";
import type User from "../models/User";

interface Inner {
    file_process_id: number;
    user: User;
}

interface IEvents {
    send_email: (params: {
        toEmail: string;
        subject: string;
        html: string;
    }) => void;
    process_invoiceInterface: (params: Inner, filePath?: string) => void;
    process_psi: (params: Inner, filePath?: string) => void;
    sendUser: (user: User) => void;
}

declare interface EmitterClass {
    on<U extends keyof IEvents>(event: U, listener: IEvents[U]): this;
    emit<U extends keyof IEvents>(
        event: U,
        ...args: Parameters<IEvents[U]>
    ): boolean;
}

class EmitterClass extends EventEmitter {
    constructor() {
        super({ captureRejections: true });
        this.setMaxListeners(5);
    }

    public destoryUser(cb: (user: User) => void) {
        this.removeListener("sendUser", cb);
    }
}

const eventclass = new EmitterClass();
export default eventclass;
