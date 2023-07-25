import { createContext, ReactNode, useContext } from "react";
import useCurrentUser from "./service/use-current-user";

type AuthProps = {
    children: ReactNode
}
type AuthValues = {}
const AuthContext = createContext({} as AuthValues)

export default function AuthContextProvider({ children }: AuthProps) {
    const [user] = useCurrentUser()
    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("no ctx")
    return ctx
}
