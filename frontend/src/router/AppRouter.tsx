import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PrivateRoute from '../components/PrivateRoute'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Companies from '../pages/Companies'
import Products from '../pages/Products'
import AppLayout from '../components/Layout/AppLayout'

function AppRouter() {
    const { isAuthenticated } = useAuth()

    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

            <Route path="/" element={
                <PrivateRoute>
                    <AppLayout />
                </PrivateRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="companies" element={<Companies />} />
                <Route path="products" element={<Products />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default AppRouter