import { createContext, ReactNode, useContext } from "react";
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
}

const AuthContext = createContext({} as AuthValues)

export default function AuthContextProvider({ children }: AuthProps) {
    const [user, isAuth, setUser, invalidateUser] = useCurrentUser()

    return (
        <AuthContext.Provider value={{ user, isAuth, setUser, invalidateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("no ctx")
    return ctx
}
