import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const InitApp = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default InitApp;
