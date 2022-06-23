import { useState, useEffect } from "react";
import axios from "../utils/axios-instance";

export default function useGetModel(path, authToken = "") {
    const [model, setModel] = useState({});

    useEffect(() => {
        axios
            .get(path, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            .then((response) => {
                setModel(response.data.data);
            })
            .catch((error) => {
                setModel({});
            });
        return () => {
            setModel({});
        };
    }, []);

    return model;
}
