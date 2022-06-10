import { Outlet } from "react-router-dom";
import { useUserContext } from "../../contexts/user-context";
import Loading from "../Loading";
import { Navigate } from "react-router-dom";
import useGuardCheck from "../../hooks/useGuardCheck";

export default function Auth() {
    const { user } = useUserContext();
    const guardChecked = useGuardCheck();

    if (!guardChecked) return <Loading loadingIs={true} />;

    return user.authIs ? <Outlet /> : <Navigate to="/auth/login" />;
}
