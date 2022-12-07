import { selectSpinner, useAppDispatch, useAppSelector } from "store";
import { GSpinner } from "ui";

const useGlobalSpiner = () => {
    const isLoading = useAppSelector(selectSpinner);
    const dispatch = useAppDispatch();
    if (isLoading) {
        return <GSpinner />;
    }
};

export default useGlobalSpiner;
