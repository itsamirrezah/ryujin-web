import axios from "axios";
import useMutation from "./use-mutation";
import { User } from "../types/users"
import { useEffect } from "react";
import { useAuthContext } from "../auth";

export type RegisterBody = { username: string, password: string, email: string };
export default function useRegisterUser() {
    const { setUser, invalidateUser } = useAuthContext()
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth`;
    const mutation = useMutation<RegisterBody, User>((data: RegisterBody) => axios.post(url, data, { withCredentials: true }).then(res => res.data));
    const { data, isSuccess } = mutation

    useEffect(() => {
        if (!data) return
        invalidateUser()
    }, [isSuccess, data])
    return mutation
}
