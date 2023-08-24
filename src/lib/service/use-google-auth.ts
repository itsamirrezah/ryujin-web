import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { useState } from "react"
import { useAuthContext } from "../auth";
import { User } from "../types/users";

const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth/google`;

export function useGoogleAuth() {
    const { invalidateUser } = useAuthContext()
    const [userInfo, setUserInfo] = useState<User>()
    const [isError, setError] = useState(false)
    const googleAuthHandler = useGoogleLogin({
        onSuccess: async (token) => {
            try {
                setError(false)
                const res = await axios.post<User>(url, { access: token.access_token }, { withCredentials: true })
                setUserInfo(res.data)
                invalidateUser()
            } catch {
                setError(true)
            }
        }
    })
    return { isError, userInfo, googleAuthHandler, isSuccess: !!userInfo }
}
