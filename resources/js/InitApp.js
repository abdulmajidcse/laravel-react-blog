import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/NotFound";
import AuthHome from "./pages/Auth/Home";
import { UserContextProvider } from "./contexts/user-context";
import Auth from "./components/Guards/Auth";
import Guest from "./components/Guards/Guest";

const InitApp = () => {
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="auth" element={<Guest />}>
                    <Route path="login" element={<Login />} />
                </Route>

                <Route path="auth" element={<Auth />}>
                    <Route index element={<AuthHome />} />
                </Route>

                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </UserContextProvider>
    );
};

export default InitApp;
