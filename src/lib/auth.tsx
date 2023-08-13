import AuthModal from "@/components/auth/auth-modal";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { isatty } from "tty";
import useCurrentUser from "./service/use-current-user";
import { User } from "./types/users";

type AuthProps = {
    children: ReactNode
}

type AuthValues = {
    user?: User,
    isAuth: boolean,
    setUser: (user: User) => void,
    invalidateUser: () => void
    openAuth: () => void
    closeAuth: () => void
}
const AuthContext = createContext({} as AuthValues)

export default function AuthContextProvider({ children }: AuthProps) {
    const [user, isAuth, setUser, invalidateUser] = useCurrentUser()
    const [isModalShown, setIsModalShown] = useState(false)

    function openAuth() {
        setIsModalShown(true)
    }
    function closeAuth() {
        setIsModalShown(false)
    }

    useEffect(() => {
        if (isAuth) closeAuth()
    }, [isAuth])

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
            <AuthContext.Provider value={{ user, isAuth, setUser, invalidateUser, openAuth, closeAuth }}>
                {children}
                {isModalShown && <AuthModal onClose={() => closeAuth()} signOption={!isAuth && !!user && !user.username ? "username" : undefined} />}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    )
}

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("no ctx")
    return ctx
}
