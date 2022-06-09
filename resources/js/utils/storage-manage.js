const setAuthToken = (token) => {
    localStorage.setItem("react_blog_auth_token", token);
};

const getAuthToken = () => {
    localStorage.getItem("react_blog_auth_token");
};

export { setAuthToken, getAuthToken };
