import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext({
    state: {},
    actions: {},
});

const ACTIONS = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    UPDATE_PROFILE: 'UPDATE_PROFILE',
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
            };
        case ACTIONS.LOGOUT:
            return {
                isAuthenticated: false,
                token: null,
                username: '',
                email: '',
                profilePicture: '',
                fullName: '',
                registrationDate: '',
                favoriteGenre: '',
                playlistCount: 0,
            };
        case ACTIONS.UPDATE_PROFILE:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        isAuthenticated: false,
        token: localStorage.getItem('token'),
        username: '',
        email: '',
        profilePicture: '',
        fullName: '',
        registrationDate: '',
        favoriteGenre: '',
        playlistCount: 0,
    });

    const navigate = useNavigate();
    const location = useLocation();

    const actions = {
        login: (userData) => {
            if (!state.isAuthenticated) {
                localStorage.setItem('token', userData.token);
                dispatch({ type: ACTIONS.LOGIN, payload: userData });
                const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
                localStorage.removeItem('redirectAfterLogin');
                navigate(redirectPath);
            }
        },
        logout: () => {
            localStorage.removeItem('token');
            dispatch({ type: ACTIONS.LOGOUT });
            navigate('/login');
        },
        updateProfile: (profileData) => {
            dispatch({ type: ACTIONS.UPDATE_PROFILE, payload: profileData });
        },
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !state.isAuthenticated) {
            actions.login({ token });
        }
    }, [state.isAuthenticated, actions]);

    return (
        <AuthContext.Provider value={{ state, actions }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
    }
    return context;
}
