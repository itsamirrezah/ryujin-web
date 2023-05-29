import axios from "axios";
import useMutation from "./use-mutation";
import { User } from "../types/users"

type Body = { username: string, password: string, email: string };
export default function useRegisterUser() {
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth`;
    return useMutation<Body, User>((data: Body) => axios.post(url, data, { withCredentials: true }).then(res => res.data));
}
