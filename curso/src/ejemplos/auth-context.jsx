import {createContext} from "react";
export const defaultAuthContext = {
    isAuth: false,
    authToken: "",
    name: "",
    roles: [],
};

export const AuthContext = createContext(defaultAuthContext);
export const AuthDispatchContext = createContext(defaultAuthContext);

export const AUTH_LOGIN = "login";
export const AUTH_LOGOUT = "logout";

export const loginAction = (name, roles, authToken) => {
    return {type: AUTH_LOGIN, authToken, name, roles};
};
export const logoutAction = () => {
    return {type: AUTH_LOGOUT};
};

export const authReducer = (auth, action) => {
    switch (action.type) {
        case AUTH_LOGIN: {
            return {
                isAuth: true,
                authToken: action.authToken,
                name: action.name,
                roles: [...action.roles],
            };
        }
        case AUTH_LOGOUT: {
            return {
                ...auth,
                isAuth: false,
                authToken: "",
            };
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
};

    // const [auth, dispatch] = useReducer(authReducer, defaultAuthContext)
    //         <AuthContext.Provider value={auth}>
    //             <AuthDispatchContext.Provider value={dispatch}>
    //             </AuthDispatchContext.Provider>
    //         </AuthContext.Provider>
