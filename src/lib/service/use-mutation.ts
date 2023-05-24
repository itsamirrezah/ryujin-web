import { useState } from "react";

export default function useMutation(func: any) {
    const [data, setData] = useState(null);

    async function mutate(data: any) {
        const res = await func(data);
        setData(res);
    }
    return { data, mutate }
}
