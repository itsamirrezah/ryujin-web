import axios from "axios";
import { User } from "../types/users";
import { ApiError } from "./types";
import useMutation from "./use-mutation";

type Body = { access: string }
const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth/google`;
export default function useVerifyGoogleUser() {
    const mutation = useMutation<Body, User, ApiError>(
        (body) => axios.post<User>(
            url, { access: body.access }, { withCredentials: true }
        ).then(res => res.data)
    )
    return mutation
}
