import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'


export default function Protectedroutes({ children }) {
    const {state} = useContext(AuthContext)
    return state.isAuthenticated ? children: <Navigate to="/login" />
}
