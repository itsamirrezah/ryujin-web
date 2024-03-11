import axios from "axios";
import { handlerError } from "./consts";
import useFetch from "./use-fetch";

type Response = {
    isValid: boolean,
    ttl: number
}

const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth/check-confirmation-status`;
export default function useConfirmEmailAvailability() {
    return useFetch<Response>(() => axios.get(url, { withCredentials: true })
        .then(res => res.data)
        .catch(e => handlerError(e)),
        { enabled: false }
    )
}
