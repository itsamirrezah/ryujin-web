import useConfirmEmailAvailability from "@/lib/service/use-confirm-email-availability";
import useSendConfirmationEmail from "@/lib/service/use-send-confirmation-email";
import { useEffect, useState } from "react";
import InteractiveButton from "../buttons/interactive-button";

export default function EmailConfirmationHandler() {
    const [timeToNextRequest, setTimeToNextRequest] = useState(-1)
    const isAvailable = useConfirmEmailAvailability()
    const sendConfirmationEmail = useSendConfirmationEmail()
    const isConfirmButtonAvailable = isAvailable.isSuccess && isAvailable.data?.isValid

    async function sendConfirmationEmailHandler() {
        if (!isAvailable.data?.isValid || timeToNextRequest > 0) return;
        await sendConfirmationEmail.refetch()
        await isAvailable.refetch()
    }

    useEffect(() => {
        if (!isAvailable.data) return;
        const { isValid, ttl } = isAvailable.data
        if (!isValid) {
            setTimeToNextRequest(ttl)
            return;
        }
    }, [isAvailable.data])

    useEffect(() => {
        async function refetchIsAvailable() {
            await isAvailable.refetch()
        }
        if (timeToNextRequest <= 0) {
            refetchIsAvailable()
            return;
        };
        const interval = setInterval(() => {
            setTimeToNextRequest(prev => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [timeToNextRequest])

    return (
        <div>
            <InteractiveButton
                onClick={sendConfirmationEmailHandler}
                disabled={!isConfirmButtonAvailable}>
                Resend Email
            </InteractiveButton>
            {timeToNextRequest > 0 && <div>{`wait for ${timeToNextRequest} seconds.`}</div>}
        </div>
    )
}
