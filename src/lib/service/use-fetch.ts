import { useEffect, useState } from "react";

export type FetchFunction<T> = (payload: FetchFunctionPayload) => Promise<T>;

type FetchFunctionPayload = {
    signal?: AbortSignal
}

type FetchConfig = {
    enabled?: boolean,
    key?: string,
    retryOnFailure?: number
}

type FetchResult<T, E> = {
    data?: T,
    isSuccess: boolean,
    isLoading: boolean,
    error?: E,
    isError: boolean
    refetch: () => Promise<any>
}

export default function useFetch<T, E = unknown>(
    fn: FetchFunction<T>,
    { enabled = true, key, retryOnFailure = 0 }: FetchConfig
): FetchResult<T, E> {
    const [data, setData] = useState<T>();
    const [error, setError] = useState<E>()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [retry, setRetry] = useState(0)

    async function getFetch(conf?: { signal: AbortSignal }): Promise<any> {
        setIsLoading(true);
        setError(undefined);
        setData(undefined);
        setIsSuccess(false);
        try {
            const data = await fn({ signal: conf?.signal });
            //FIXME: just a temporary fix
            if (!data) return;
            setData(data);
            setIsSuccess(true);
            setError(undefined)
            setRetry(0)
        } catch (err) {
            if (retry < retryOnFailure) {
                setRetry(prev => prev += 1)
                return
            }
            setError(err as E)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!enabled) return
        const controller = new AbortController()
        getFetch({ signal: controller.signal });
        return () => controller.abort()
    }, [key, enabled])

    useEffect(() => {
        if (retry <= 0 || retry > retryOnFailure) return;
        const retryDelay = 100
        const retryExponent = 2
        const retryTimeout = retryDelay * Math.pow(retry, retryExponent)
        const timeout = setTimeout(() => {
            getFetch()
        }, retryTimeout)
        return () => clearTimeout(timeout)
    }, [retry])

    return { data: data, isSuccess, isLoading, error, isError: !!error, refetch: getFetch };
}
