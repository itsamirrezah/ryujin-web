import axios, { CanceledError } from "axios";
import { useCallback } from "react";
import { handlerError } from "./consts";
import { ApiError } from "./types";
import useFetch, { FetchFunction } from "./use-fetch";

type Response = {
    username: string
}

export default function useValidateUsername(username: string, enable: boolean) {
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/users/check-username/${username}`;
    const request = useCallback<FetchFunction<Response>>(
        ({ signal }) => axios.get(url, { signal })
            .then(res => res.data)
            .catch(e => {
                if (e instanceof CanceledError) return
                handlerError(e)
            }),
        [username]
    )
    return useFetch<Response, ApiError>(request, { enabled: enable })
}
