import { Navigate } from "react-router-dom";

// Protected Route - Only for logged in users
export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!token || isLoggedIn !== "true") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Admin Route - Only for admin users
export const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");

    if (!token || isLoggedIn !== "true") {
        return <Navigate to="/login" replace />;
    }

    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};
