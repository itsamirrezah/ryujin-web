import { useState } from "react";

type MutationFunction<T, R> = (payload: T) => Promise<R>;
type MutationResult<T, R> = {
    mutate: (payload: T) => Promise<void>,
    data: R | null,
    isSuccess: boolean,
    isLoading: boolean,
    error: Error | null
    isError: boolean
}

export default function useMutation<T = unknown, R = unknown>(fn: MutationFunction<T, R>): MutationResult<T, R> {
    const [data, setData] = useState<R | null>(null);
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    async function mutate(payload: T): Promise<any> {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);
        try {
            const data = await fn(payload);
            setData(data);
            setIsSuccess(true);
        } catch (err) {
            if (err instanceof Error) setError(err);
            else setError(new Error("Unknown error"));
        } finally {
            setIsLoading(false);
        }

    }
    return { mutate, data, isSuccess, isLoading, error, isError: error !== null };
}
