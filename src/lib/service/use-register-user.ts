import axios from "axios";
import { useEffect } from "react";
import { useAuthContext } from "../auth";
import { User } from "../types/users";
import { handlerError } from "./consts";
import { ApiError } from "./types";
import useMutation from "./use-mutation";

export type RegisterBody = { username: string, password: string, email: string };
export default function useRegisterUser() {
    const { invalidateUser } = useAuthContext()
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth`;
    const mutation = useMutation<RegisterBody, User, ApiError>(
        (data: RegisterBody) =>
            axios.post(url, data, { withCredentials: true })
                .then(res => res.data)
                .catch(e => handlerError(e))
    );
    const { data, isSuccess } = mutation

    useEffect(() => {
        if (!data) return
        invalidateUser()
    }, [isSuccess, data])
    return mutation
}
