import { useAppDispatch, setIsLoading } from "store";
const useLoading = () => {
    const dispatch = useAppDispatch();

    return (loading: boolean) => {
        dispatch(setIsLoading({ isLoading: loading }));
    };
};

export default useLoading;
