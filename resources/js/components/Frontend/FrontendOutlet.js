import { Outlet } from "react-router-dom";
import FrontendHeader from "./FrontendHeader";
import { useEffect } from "react";
import { useUserContext } from "../../contexts/user-context";

export default function FrontendOutlet() {
    const { login } = useUserContext();

    useEffect(() => {
        login(localStorage.getItem(process.env.MIX_AUTH_TOKEN_NAME));
    }, []);

    return (
        <>
            <FrontendHeader />
            <Outlet />
        </>
    );
}
