import { useGoogleLogin } from "@react-oauth/google"
import { useEffect, useState } from "react"
import { useAuthContext } from "../auth";
import useVerifyGoogleUser from "./use-verify-google-user";


export function useGoogleAuth() {
    const { invalidateUser } = useAuthContext()
    const [accessToken, setAccessToken] = useState<string>("")
    const verifyGoogleUser = useVerifyGoogleUser()

    useEffect(() => {
        if (!accessToken) return;
        verifyGoogleUser.mutate({ access: accessToken })
    }, [accessToken])

    const { isSuccess } = verifyGoogleUser
    useEffect(() => {
        if (!isSuccess) return
        invalidateUser()
    }, [isSuccess])

    const googleAuthHandler = useGoogleLogin({
        onSuccess: (token) => {
            setAccessToken(token.access_token)
        }
    })
    return { googleAuthHandler, ...verifyGoogleUser }
}
