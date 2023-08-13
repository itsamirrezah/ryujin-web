import axios from "axios";
import { useEffect } from "react";
import { useAuthContext } from "../auth";
import { User } from "../types/users";
import useMutation from "./use-mutation";

type Body = { username: string };
export default function useUpdateUsername(userId?: string) {
    const { setUser } = useAuthContext()
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/users/${userId}`;
    const mutation = useMutation<Body, User>((data: Body) => axios.put(url, data, { withCredentials: true }).then(res => res.data))

    const { data, isSuccess } = mutation
    useEffect(() => {
        if (!data) return
        setUser(data)
    }, [isSuccess, data])

    return mutation
}
