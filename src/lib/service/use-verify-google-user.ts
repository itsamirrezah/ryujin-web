import axios from "axios";
import { User } from "../types/users";
import { handlerError } from "./consts";
import { ApiError } from "./types";
import useMutation from "./use-mutation";

type Body = { access: string }
const url = `${import.meta.env.VITE_SERVER_BASEURL}/auth/google`;
export default function useVerifyGoogleUser() {
    const mutation = useMutation<Body, User, ApiError>(
        (body) => axios.post(url, { access: body.access }, { withCredentials: true })
            .then(res => res.data)
            .catch((e) => handlerError(e))
    )
    return mutation
}
