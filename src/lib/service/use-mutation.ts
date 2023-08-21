import { AxiosError } from "axios";
import { useState } from "react";

type MutationFunction<T, R> = (payload: T) => Promise<R>;
type MutationResult<T, R> = {
    mutate: (payload: T) => Promise<void>,
    data?: R,
    isSuccess: boolean,
    isLoading: boolean,
    error?: Error,
    isError: boolean
}

export default function useMutation<T = unknown, R = unknown>(fn: MutationFunction<T, R>): MutationResult<T, R> {
    const [data, setData] = useState<R>();
    const [error, setError] = useState<Error>()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    async function mutate(payload: T): Promise<any> {
        setIsLoading(true);
        setError(undefined);
        setIsSuccess(false);
        try {
            const data = await fn(payload);
            setData(data);
            setIsSuccess(true);
        } catch (err) {
            if (err instanceof AxiosError) setError(new Error(err.response?.data?.message));
            else setError(new Error("Unknown error"));
        } finally {
            setIsLoading(false);
        }
    }
    return { mutate, data, isSuccess, isLoading, error, isError: !!error };
}
