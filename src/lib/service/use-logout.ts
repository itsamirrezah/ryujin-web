import axios from "axios";
import useMutation from "./use-mutation";

export default function useLogout() {
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth/logout`;
    return useMutation(() => axios.post(url, null, { withCredentials: true }))
}
