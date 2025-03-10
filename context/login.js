const { useContext, useState } = require("react");
const { createContext } = require("react");

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loggedId, setLoggedId] = useState("");

    return (
        <LoginContext.Provider
            value={{ loggedIn, setLoggedIn, loggedId, setLoggedId }}
        >
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () =>
    useContext(LoginContext);
