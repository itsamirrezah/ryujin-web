import axios from "axios";
import useMutation from "./use-mutation";
import { User } from "../types/users"
import { useEffect } from "react";
import { useAuthContext } from "../auth";

type Body = { username: string, password: string, email: string };
export default function useRegisterUser() {
    const { setUser } = useAuthContext()
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth`;
    const mutation = useMutation<Body, User>((data: Body) => axios.post(url, data, { withCredentials: true }).then(res => res.data));
    const { data, isSuccess } = mutation

    useEffect(() => {
        if (!data) return
        setUser(data)
    }, [isSuccess, data])
    return mutation
}
