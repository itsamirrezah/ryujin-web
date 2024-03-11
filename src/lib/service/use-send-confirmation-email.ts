import axios from "axios";
import { handlerError } from "./consts";
import useFetch from "./use-fetch";

const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth/send-confirmation-email`;
export default function useSendConfirmationEmail() {
    return useFetch(() => axios.get(url, { withCredentials: true })
        .then(res => res.data)
        .catch(e => handlerError(e)),
        { enabled: false }
    )
}
