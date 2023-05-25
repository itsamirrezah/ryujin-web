import axios from "axios";
import useMutation from "./use-mutation";

type User = { id: string, email: string, createdAt: string, updatedAt: string, username: string, type: string }
type Body = { usernameOrEmail: string, password: string };

export default function useSignIn() {
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth/sign-in`;
    return useMutation<Body, User>((data: Body) => axios.post(url, data, { withCredentials: true }).then(res => res.data));
}
