import axios from "axios";
import { useEffect } from "react";
import { User } from "../types/users";
import { handlerError } from "./consts";
import useFetch from "./use-fetch";
import useLogout from "./use-logout";

const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth`;
export default function useCurrentUser() {
    const logout = useLogout()
    const { data, error, isLoading, isError, isSuccess, refetch } = useFetch<User>(
        () => axios.get(url, { withCredentials: true })
            .then(res => res.data)
            .catch(e => handlerError(e)),
        { retryOnFailure: 5 }
    )
    const hasDone = !isLoading && (!!error || !!data)

    function invalidateUser() {
        refetch()
    }

    async function onLogout() {
        await logout.mutate()
    }

    useEffect(() => {
        refetch()
    }, [logout.isSuccess])


    useEffect(() => {
        if (!data) return;
        const interval = setTimeout(invalidateUser, 9000)
        return () => clearInterval(interval)
    }, [data])

    return [hasDone, data, !!data && !!data.username && !!data.emailConfirmed, invalidateUser, onLogout] as const
}
