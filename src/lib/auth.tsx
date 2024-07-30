import AuthModal from "@/components/auth/auth-modal";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import useCurrentUser from "./service/use-current-user";
import { User } from "./types/users";

type AuthProps = {
    children: ReactNode
}

type AuthValues = {
    user?: User,
    isAuth: boolean,
    invalidateUser: () => void
    openAuth: () => void
    closeAuth: () => void,
    onLogout: () => void,
    isLogoutEnabled: boolean
    setLogoutEnabled: Dispatch<SetStateAction<boolean>>
}

const AuthContext = createContext({} as AuthValues)

export default function AuthContextProvider({ children }: AuthProps) {
    const [user, isAuth, invalidateUser, onLogout, isUserActionInProgress] = useCurrentUser()
    const [isModalShown, setIsModalShown] = useState(false)
    const [isLogoutEnabled, setLogoutEnabled] = useState(false)
    const signOptions = !user ? "signup" : !user.username ? "username" : !user.emailConfirmed ? "email" : undefined

    function openAuth() {
        if (isAuth) return;
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

    useEffect(() => {
        if (user) {
            setLogoutEnabled(true)
        }
    }, [user])

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
            <AuthContext.Provider value={{
                user,
                isAuth,
                invalidateUser,
                onLogout,
                openAuth,
                closeAuth,
                isLogoutEnabled: isLogoutEnabled && !isUserActionInProgress,
                setLogoutEnabled
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
