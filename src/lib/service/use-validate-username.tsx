import axios, { CanceledError } from "axios";
import { handlerError } from "./consts";
import { ApiError } from "./types";
import useFetch from "./use-fetch";

type Response = {
    username: string
}

export default function useValidateUsername(username: string, enabled: boolean) {
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/users/check-username/${username}`;
    return useFetch<Response, ApiError>(
        ({ signal }) =>
            axios.get(url, { signal })
                .then(res => res.data)
                .catch(e => {
                    if (e instanceof CanceledError) return;
                    handlerError(e)
                }),
        { enabled, key: username })
}
