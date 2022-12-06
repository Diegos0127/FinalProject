import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED

const CurrentModal = {
    NONE : "NONE",
    USER_REGISTRATION : "USER_REGISTRATION",
    USER_LOGIN : "USER_LOGIN",
}

export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    CHANGE_MODAL: "CHANGE_MODAL"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        CURRENT_MODAL: CurrentModal.NONE,
        error: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    CURRENT_MODAL : CurrentModal.NONE,
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    CURRENT_MODAL : CurrentModal.NONE,
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    CURRENT_MODAL : CurrentModal.NONE,
                    user: null,
                    loggedIn: false
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    CURRENT_MODAL : CurrentModal.NONE,
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.CHANGE_MODAL: {
                return setAuth({
                    user: null,
                    loggedIn: null,
                    CURRENT_MODAL: payload.modal,
                    error: payload.error
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(userName, email, firstName, lastName, password, passwordVerify) {
        try{
            let response = await api.registerUser(userName, email, firstName, lastName, password, passwordVerify);    
            if (response.status === 200) {
                console.log(response.data);
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                auth.loginUser(email, password);
            }
        }
        catch(e){
            authReducer({
                type: AuthActionType.CHANGE_MODAL,
                payload: {
                    modal: CurrentModal.USER_REGISTRATION,
                    error: e.response.data.errorMessage
                }
            })
        }
    }

    auth.loginUser = async function(email, password) {
        try{
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
        }
        catch(e){
            console.log(e.response.data.errorMessage);
            authReducer({
                type: AuthActionType.CHANGE_MODAL,
                payload: {
                    modal: CurrentModal.USER_LOGIN,
                    error: e.response.data.errorMessage
                }
            })
        }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        return initials;
    }
    
    auth.isUserRegistrationModalOpen = function(){
        console.log(auth.CURRENT_MODAL)
        return auth.CURRENT_MODAL === CurrentModal.USER_REGISTRATION;
    }
    auth.isUserLoginModalOpen = function(){
        return auth.CURRENT_MODAL === CurrentModal.USER_LOGIN;
    }
    auth.hideModals = function(){
        authReducer( {
            type: AuthActionType.CHANGE_MODAL,
            payload: {
                moda: CurrentModal.NONE,
                error: null
            }
        })
    }
    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };