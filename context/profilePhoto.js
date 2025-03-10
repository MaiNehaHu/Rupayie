const { useContext, useState } = require("react");
const { createContext } = require("react");

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profilePhoto, setProfilePhoto] = useState("");

    return (
        <ProfileContext.Provider
            value={{ profilePhoto, setProfilePhoto }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () =>
    useContext(ProfileContext);
