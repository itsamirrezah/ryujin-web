import axios from "axios";
import useFetch from "./use-fetch";

export default function useValidateRoom(roomId: string) {
    const url = `${import.meta.env.VITE_SERVER_BASEURL}/play/validate-room/${roomId}`;
    return useFetch(() => axios.get(url), { enabled: !!roomId })
}
