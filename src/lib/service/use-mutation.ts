import { useState } from "react";

type MutationFunction<T, R> = (payload: T) => Promise<R>;

export type MutationResult<T, R, E = unknown> = {
    mutate: (payload: T) => Promise<void>,
    data?: R,
    isSuccess: boolean,
    isLoading: boolean,
    error?: E,
    isError: boolean
}

export default function useMutation<
    T = void,
    R = unknown,
    E = unknown
>(fn: MutationFunction<T, R>): MutationResult<T, R, E> {
    const [data, setData] = useState<R>();
    const [error, setError] = useState<E>()
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
            setError(err as E)
        } finally {
            setIsLoading(false);
        }
    }
    return { mutate, data, isSuccess, isLoading, error, isError: !!error };
}
