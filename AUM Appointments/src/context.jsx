/** @format */

import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate }  from "react-router-dom";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const [login, setLogin] = useState(false);

    const loginUser = ( email, password ) => {
        if (password === "admin" && email === "admin") {
            setLogin(true);
            navigate("/appointments");
        }
    };

    return <AppContext.Provider value=
    {{ loginUser }}
    >{ children }</AppContext.Provider>;
};

export { AppContext, AppProvider };

export const useGlobalContext = () => {
    return useContext(AppContext);
};