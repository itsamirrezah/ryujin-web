import { useEffect, useRef, RefObject } from "react";

type Event = MouseEvent | TouchEvent;
type Handler = (event: Event) => void;

export default function useOutsideClick<T extends HTMLElement = HTMLElement>(handler: Handler): RefObject<T> {
    const ref = useRef<T>(null);
    useEffect(() => {
        function listener(event: Event) {
            if (!ref.current || ref.current.contains(event.target as Node)) return;
            handler(event);
        }
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);

    return ref
}
