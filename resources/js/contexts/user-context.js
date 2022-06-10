import React, { useContext, useState } from "react";
import axios from "../utils/axios-instance";

export const UserContext = React.createContext({
    user: {},
    login: () => {},
    logout: () => {},
});

const USER = { authIs: false, name: "Guest" };

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(USER);

    const logout = async (authToken = false) => {
        try {
            if (authToken) {
                const response = await axios.delete("/auth/logout", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                localStorage.removeItem(process.env.MIX_AUTH_TOKEN_NAME);
                setUser(USER);
                return response;
            } else {
                setUser(USER);
                return true;
            }
        } catch (error) {
            localStorage.removeItem(process.env.MIX_AUTH_TOKEN_NAME);
            setUser(USER);
            return error;
        }
    };

    const login = async (authToken = false) => {
        try {
            if (authToken) {
                const response = await axios.get("/auth/user", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setUser({ authIs: true, ...response.data?.data?.user });
                return response;
            } else {
                setUser(USER);
                return true;
            }
        } catch (error) {
            logout();
            setUser(USER);
            return true;
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const { user, login, logout } = useContext(UserContext);
    return { user, login, logout };
};
