import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { User } from "../types/users"

export default function useCurrentUser() {
    const [user, setUser] = useState<User>()
    const [error, SetError] = useState<boolean>(false)
    const [retry, setRetry] = useState(0)

    function setUserHandler(user: User) {
        setUser(user)
        SetError(false)
        setRetry(0)
    }

    function invalidateUser() {
        SetError(false)
        getCurrentUser()
    }

    async function getCurrentUser() {
        const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth`;
        try {
            const response = await axios.get<User>(url, { withCredentials: true })
            setUser(response.data)
            SetError(false)
            setRetry(0)
        } catch (err) {
            if (!(err instanceof AxiosError) || err.response?.status !== 403) {
                SetError(true)
                setRetry(prev => prev + 1)
            }

        }
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    useEffect(() => {
        const retryDelay = 100
        const retryExponent = 2
        const retryInterval = retryDelay * Math.pow(retry + 1, retryExponent)
        if (!error) return;
        const interval = setInterval(() => getCurrentUser(), retryInterval)
        return () => clearInterval(interval)
    }, [error, retry])

    return [user, !!user && !!user.username, setUserHandler, invalidateUser] as const
}
