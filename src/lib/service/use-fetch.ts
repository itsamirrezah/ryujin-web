import { useEffect, useState } from "react";

export type FetchFunction<T> = (payload: FetchFunctionPayload) => Promise<T>;

type FetchFunctionPayload = {
    signal: AbortSignal
}

type FetchConfig = {
    enabled?: boolean,
    key?: string,
}

type FetchResult<T, E> = {
    data?: T,
    isSuccess: boolean,
    isLoading: boolean,
    error?: E,
    isError: boolean
}

export default function useFetch<T, E = unknown>(
    fn: FetchFunction<T>,
    { enabled = true, key }: FetchConfig
): FetchResult<T, E> {
    const [data, setData] = useState<T>();
    const [error, setError] = useState<E>()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    useEffect(() => {
        const controller = new AbortController()
        async function getFetch(): Promise<any> {
            setIsLoading(true);
            setError(undefined);
            setIsSuccess(false);
            try {
                const data = await fn({ signal: controller.signal });
                //FIXME: just a temporary fix
                if (!data) return;
                setData(data);
                setIsSuccess(true);
                setError(undefined)
            } catch (err) {
                setError(err as E)
            } finally {
                setIsLoading(false);
            }
        }
        if (!enabled) return
        getFetch();
        return () => controller.abort()
    }, [key, enabled])

    return { data, isSuccess, isLoading, error, isError: !!error };
}
