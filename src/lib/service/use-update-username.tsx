import axios from "axios";
import { useEffect } from "react";
import { useAuthContext } from "../auth";
import { User } from "../types/users";
import { handlerError } from "./consts";
import { ApiError } from "./types";
import useMutation from "./use-mutation";

export type UpdateUsernameBody = { username: string };

export default function useUpdateUsername(userId?: string) {
    const { invalidateUser } = useAuthContext()
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/users/${userId}/username`;
    const mutation = useMutation<UpdateUsernameBody, User, ApiError>(
        (data: UpdateUsernameBody) =>
            axios.put(url, data, { withCredentials: true })
                .then(res => res.data)
                .catch(e => handlerError(e))
    )

    const { data, isSuccess } = mutation
    useEffect(() => {
        if (!data) return
        invalidateUser()
    }, [isSuccess, data])

    return mutation
}
