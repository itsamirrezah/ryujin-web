import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { useState } from "react"

const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth/google-token`;

export function useGoogleAuth() {
    const [userInfo, setUserInfo] = useState(null)
    const [isError, setError] = useState(false)
    const googleAuthHandler = useGoogleLogin({
        onSuccess: async (token) => {
            try {
                setError(false)
                const res = await axios.post(url, { access: token.access_token })
                setUserInfo(res.data)
            } catch {
                setError(true)
            }
        }
    })
    return { isError, userInfo, googleAuthHandler }
}
