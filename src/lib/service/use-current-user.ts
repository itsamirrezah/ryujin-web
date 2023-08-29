import axios from "axios";
import { User } from "../types/users";
import { handlerError } from "./consts";
import useFetch from "./use-fetch";

const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth`;
export default function useCurrentUser() {
    const { data: user, error, isLoading, isError, isSuccess, refetch } = useFetch<User>(
        () => axios.get(url, { withCredentials: true })
            .then(res => res.data)
            .catch(e => handlerError(e)),
        { retryOnFailure: 5 }
    )

    function invalidateUser() {
        refetch()
    }

    return [user, !!user && !!user.username && !!user.emailConfirmed, invalidateUser] as const
}
