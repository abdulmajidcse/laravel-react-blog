import axios from "axios";

const instance = axios.create({
    baseURL: `${process.env.MIX_APP_URL}/api/`,
});

export default instance;
