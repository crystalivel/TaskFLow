import { createContext, useReducer, useEffect } from "react";


const initialState = { user: null, isAuthenticated: false }

function authReducer(state, action) {
    switch (action.type) {
        case "login":
            return { ...state, user: action.payload, isAuthenticated: true };
        case "logout":
            return { ...state, user: null, isAuthenticated: false };
        case "register":
            return { ...state, user: action.payload, isAuthenticated: true }
        default:
            return state;
    }
}

export const AuthContext = createContext();

export function AuthProvider ({children}) {
    const [state, dispatch] = useReducer(authReducer, initialState)

    useEffect (() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser){
            dispatch({type:"login",payload: JSON.parse(storedUser)})
        }
    },[])
    useEffect (() => {
        if (state.user) {
            localStorage.setItem("user", JSON.stringify(state.user))
        } else {
            localStorage.removeItem("user")
        }
    }, [state.user]) 
    return (
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}