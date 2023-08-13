import axios from "axios";
import { useCallback } from "react";
import useFetch, { FetchFunction } from "./use-fetch";

type Response = {
    message: string,
    username: string
}
const url = `${import.meta.env.VITE_SERVER_BASEURL}/users/check-username`;
export default function useValidateUsername(username?: string) {
    const request = useCallback<FetchFunction<Response>>(
        ({ signal }) => axios.get(`${url}/${username}`, { signal }).then(res => res.data),
        [username]
    )
    return useFetch(request, { enabled: !!username })
}
