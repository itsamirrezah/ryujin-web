import AuthModal from "@/components/auth/auth-modal";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import useCurrentUser from "./service/use-current-user";
import { User } from "./types/users";

type AuthProps = {
    children: ReactNode
}

type AuthValues = {
    user?: User,
    isAuth: boolean,
    isAuthLoadingDone: boolean
    invalidateUser: () => void
    openAuth: () => void
    closeAuth: () => void,
    onLogout: (payload: any) => void
}

const AuthContext = createContext({} as AuthValues)

export default function AuthContextProvider({ children }: AuthProps) {
    const [isAuthLoadingDone, user, isAuth, invalidateUser, onLogout] = useCurrentUser()
    const [isModalShown, setIsModalShown] = useState(false)
    const signOptions = !user ? "signup" : !user.username ? "username" : !user.emailConfirmed ? "email" : undefined

    function openAuth() {
        setIsModalShown(true)
    }
    function closeAuth() {
        setIsModalShown(false)
    }

    useEffect(() => {
        if (isAuth) {
            closeAuth()
        }
    }, [isAuth])

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
            <AuthContext.Provider value={{
                user,
                isAuth,
                isAuthLoadingDone,
                invalidateUser,
                onLogout,
                openAuth,
                closeAuth
            }}>
                {children}
                <AuthModal onClose={closeAuth} signOption={signOptions} isShown={isModalShown} />
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    )
}

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("no ctx")
    return ctx
}
