import axios from "axios";
import { ApiError } from "./types";

export function isInstanceOfApiError(res: any): res is ApiError {
    return res && "error" in res && "message" in res && "statusCode" in res;
}

export function handlerError(e: unknown) {
    if (!axios.isAxiosError(e)) throw new Error("something went wrong");
    const errorData = e.response?.data
    if (!errorData || !isInstanceOfApiError(errorData)) throw new Error(e.message || "something went wrong")
    throw new Error(`${errorData.statusCode}: ${errorData.message}`)
}
