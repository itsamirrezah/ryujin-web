import axios from "axios"
import { useEffect, useState } from "react"
import { User } from "../types/users"

export default function useCurrentUser() {
    const [user, setUser] = useState<User>()
    useEffect(() => {
        async function getCurrentUser() {
            const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth`;
            const response = await axios.get<User>(url, { withCredentials: true })
            setUser(response.data)
        }
        getCurrentUser()
    }, [])
    return [user] as const
}
