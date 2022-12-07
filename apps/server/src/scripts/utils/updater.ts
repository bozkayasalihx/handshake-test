import { User } from "../../models";

export const updater = <
    T extends {
        id: number;
        updated_by: User;
        created_by: User;
        save: () => void;
    }
>(
    params: Array<T>,
    newOne: any
) => {
    const temp: any[] = [];
    for (let i = 0; i < params.length; i++) {
        params[i].updated_by = newOne;
        params[i].save();
        temp.push(params[i]);
    }

    return Promise.all(temp);
};
