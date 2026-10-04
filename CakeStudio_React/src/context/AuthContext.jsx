import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import Service from "../services/Service";


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    // =========================================================
    // LOAD CURRENT AUTHENTICATED USER
    // =========================================================

    const loadCurrentUser = async () => {

        try {

            const response =
                await Service.getCurrentUser();


            const currentUser =
                response.data;


            setUser(
                currentUser
            );


            return currentUser;

        }
        catch (error) {

            // 401 simply means there is no valid
            // authenticated session.
            setUser(
                null
            );


            return null;

        }
        finally {

            setLoading(
                false
            );

        }

    };


    // =========================================================
    // INITIAL AUTH CHECK
    // =========================================================

    useEffect(() => {

        loadCurrentUser();

    }, []);


    // =========================================================
    // REFRESH AUTH STATE
    // =========================================================

    const refreshUser = async () => {

        setLoading(
            true
        );


        return await loadCurrentUser();

    };


    // =========================================================
    // CLEAR AUTH STATE
    // =========================================================

    const clearUser = () => {

        setUser(
            null
        );

        setLoading(
            false
        );

    };


    // =========================================================
    // CONTEXT
    // =========================================================

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser,
                clearUser
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};


export const useAuth = () => {

    const context =
        useContext(
            AuthContext
        );


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider."
        );

    }


    return context;

};


export default AuthContext;