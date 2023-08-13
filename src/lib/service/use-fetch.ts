import { useEffect, useState } from "react";

export type FetchFunction<T> = ({ signal }: { signal: AbortSignal }) => Promise<T>;
type FetchConfig = {
    enabled?: boolean,
}
type FetchResult<T> = {
    data?: T,
    isSuccess: boolean,
    isLoading: boolean,
    error?: Error,
    isError: boolean
}

export default function useFetch<T>(
    fn: FetchFunction<T>,
    { enabled = true }: FetchConfig
): FetchResult<T> {
    const [data, setData] = useState<T>();
    const [error, setError] = useState<Error>()
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
                setData(data);
                setIsSuccess(true);
            } catch (err) {
                if (err instanceof Error) setError(err);
            } finally {
                setIsLoading(false);
            }
        }
        if (!enabled) return
        getFetch();
        return () => controller.abort()
    }, [fn, enabled])

    return { data, isSuccess, isLoading, error, isError: !!error };
}
