import axios from "axios";
import useMutation from "./use-mutation";
import { User } from "../types/users"

type Body = { usernameOrEmail: string, password: string };

export default function useSignIn() {
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth/sign-in`;
    return useMutation<Body, User>((data: Body) => axios.post(url, data, { withCredentials: true }).then(res => res.data));
}
