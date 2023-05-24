import axios from "axios";
import useMutation from "./use-mutation";

export default function useRegisterUser() {
    return useMutation((data: any) => axios.post(`${import.meta.env.VITE_SERVER_BASEURL}/auth`, data, { withCredentials: true }).then(res => res.data));
}
