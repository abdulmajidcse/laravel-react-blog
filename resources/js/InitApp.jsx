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
import CategoryIndexReactTable from "./pages/Auth/Category/CategoryIndexReactTable";
import CategoryCreate from "./pages/Auth/Category/CategoryCreate";
import CategoryEdit from "./pages/Auth/Category/CategoryEdit";
import PostCreate from "./pages/Auth/Post/PostCreate";
import PostIndex from "./pages/Auth/Post/PostIndex";
import PostEdit from "./pages/Auth/Post/PostEdit";
import PostView from "./pages/Auth/Post/PostView";

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
                    {/* categories routes */}
                    <Route path="categories" element={<CategoryIndexReactTable />} />
                    <Route path="categories/create" element={<CategoryCreate />} />
                    <Route path="categories/:categoryId/edit" element={<CategoryEdit />} />
                    {/* posts routes */}
                    <Route path="posts" element={<PostIndex />} />
                    <Route path="posts/create" element={<PostCreate />} />
                    <Route path="posts/:postId" element={<PostView />} />
                    <Route path="posts/:postId/edit" element={<PostEdit />} />
                </Route>

                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </UserContextProvider>
    );
};

export default InitApp;
