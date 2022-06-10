import { useState, useEffect } from "react";
import { useUserContext } from "../contexts/user-context";

export default function useGuardCheck() {
    const { login } = useUserContext();
    const [guardChecked, setGuardChecked] = useState(false);

    useEffect(() => {
        const authCheck = async () => {
            try {
                const response = await login(
                    localStorage.getItem(process.env.MIX_AUTH_TOKEN_NAME)
                );
                setGuardChecked(response ? true : false);
            } catch (error) {
                setGuardChecked(true);
            }
        };
        authCheck();
    }, []);

    return guardChecked;
}
