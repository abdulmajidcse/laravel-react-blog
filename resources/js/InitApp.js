import { Routes, Route } from "react-router-dom";
import Home from "./pages/Frontend/Home";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Auth/Dashboard";
import { UserContextProvider } from "./contexts/user-context";
import AuthGuardOutlet from "./components/Guards/AuthGuardOutlet";
import GuestGuardOutlet from "./components/Guards/GuestGuardOutlet";
import FrontendOutlet from "./components/Frontend/FrontendOutlet";
import Profile from "./pages/Auth/Profile";

const InitApp = () => {
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/" element={<FrontendOutlet />}>
                    <Route index element={<Home />} />
                </Route>

                <Route path="auth" element={<GuestGuardOutlet />}>
                    <Route path="login" element={<Login />} />
                </Route>

                <Route path="auth" element={<AuthGuardOutlet />}>
                    <Route index element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </UserContextProvider>
    );
};

export default InitApp;
