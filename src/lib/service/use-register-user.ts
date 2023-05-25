import axios from "axios";
import useMutation from "./use-mutation";

type Body = { username: string, password: string, email: string };
type User = { id: string, email: string, createdAt: string, updatedAt: string, username: string, type: string }

export default function useRegisterUser() {
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth`;
    return useMutation<Body, User>(
        (data: Body) => axios.post(`${import.meta.env.VITE_SERVER_BASEURL}/auth`, data, { withCredentials: true }
        ).then(res => res.data));
}
