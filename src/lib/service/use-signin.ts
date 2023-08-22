import axios from "axios";
import useMutation from "./use-mutation";
import { User } from "../types/users"
import { useEffect } from "react";
import { useAuthContext } from "../auth";

export type SigninBody = { usernameOrEmail: string, password: string };
export default function useSignIn() {
    const { invalidateUser } = useAuthContext()
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth/sign-in`;
    const mutation = useMutation<SigninBody, User>(
        (data: SigninBody) => axios.post(url, data, { withCredentials: true }).then(res => res.data)
    );

    const { data, isSuccess } = mutation

    useEffect(() => {
        if (!data) return
        invalidateUser()

    }, [isSuccess, data])
    return mutation
}
