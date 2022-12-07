import { Select } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { storeOption, useAppDispatch } from "store";

interface ISelector {
    data: Array<{ label: string; value: string }>;
}

export const Selector: React.FC<ISelector> = ({ data }) => {
    const dispatch = useAppDispatch();
    const onHandleOption = useCallback(
        (ev: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
            ev.preventDefault();
            dispatch(storeOption({ option: ev.currentTarget.value }));
        },
        [dispatch]
    );
    return (
        <Select placeholder="Select Option" onClick={onHandleOption}>
            {data.map(({ label, value }) => {
                return <option value={value}>{label}</option>;
            })}
        </Select>
    );
};
