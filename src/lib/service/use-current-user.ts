import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../types/users";
import { handlerError } from "./consts";
import useFetch from "./use-fetch";
import useLogout from "./use-logout";

const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth`;
export default function useCurrentUser() {
    const [user, setUser] = useState<User>()
    const logout = useLogout()
    const {
        data,
        isError,
        isLoading,
        isSuccess,
        refetch
    } = useFetch<User>(() => axios.get(url, { withCredentials: true })
        .then(res => res.data)
        .catch(e => handlerError(e)),
        { retryOnFailure: 5 }
    )
    function invalidateUser() {
        refetch()
    }

    async function onLogout() {
        await logout.mutate()
    }

    useEffect(() => {
        setUser(undefined)
    }, [logout.isSuccess])

    useEffect(() => {
        if (isSuccess || isError) {
            setUser(data)
        }
    }, [isSuccess, isError, data])


    useEffect(() => {
        if (!user) return;
        const interval = setTimeout(invalidateUser, 60 * 60 * 1000)
        return () => clearInterval(interval)
    }, [user])

    const isAuth = !!user && !!user.username && !!user.emailConfirmed
    const isUserActionInProgress = isLoading || logout.isLoading
    return [user, isAuth, invalidateUser, onLogout, isUserActionInProgress] as const
}
