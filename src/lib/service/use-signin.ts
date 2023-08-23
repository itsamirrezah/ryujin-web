import axios from "axios";
import { useEffect } from "react";
import { useAuthContext } from "../auth";
import { User } from "../types/users";
import { handlerError } from "./consts";
import { ApiError } from "./types";
import useMutation from "./use-mutation";

export type SigninBody = { usernameOrEmail: string, password: string };


export default function useSignIn() {
    const { invalidateUser } = useAuthContext()
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth/sign-in`;
    const mutation = useMutation<SigninBody, User, ApiError>(
        (data: SigninBody) =>
            axios.post(url, data, { withCredentials: true })
                .then(res => res.data)
                .catch((e) => handlerError(e))
    );
    const { data, isSuccess } = mutation

    useEffect(() => {
        if (!data) return
        invalidateUser()

    }, [isSuccess, data])
    return mutation
}
