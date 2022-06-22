import { Routes, Route } from "react-router-dom";
import Home from "./pages/Frontend/Home";
import Login from "./pages/Guest/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Auth/Dashboard";
import { UserContextProvider } from "./contexts/user-context";
import AuthGuardOutlet from "./components/Guards/AuthGuardOutlet";
import GuestGuardOutlet from "./components/Guards/GuestGuardOutlet";
import FrontendOutlet from "./components/Frontend/FrontendOutlet";
import Profile from "./pages/Auth/Profile";
import ChangePassword from "./pages/Auth/ChangePassword";
import ForgotPassword from "./pages/Guest/ResetPassword/ForgotPassword";
import ResetPassword from "./pages/Guest/ResetPassword/ResetPassword";

const InitApp = () => {
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/" element={<FrontendOutlet />}>
                    <Route index element={<Home />} />
                </Route>

                <Route path="auth" element={<GuestGuardOutlet />}>
                    <Route path="login" element={<Login />} />
                    <Route
                        path="forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route path="reset-password" element={<ResetPassword />} />
                </Route>

                <Route path="auth" element={<AuthGuardOutlet />}>
                    <Route index element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route
                        path="change-password"
                        element={<ChangePassword />}
                    />
                </Route>

                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </UserContextProvider>
    );
};

export default InitApp;
