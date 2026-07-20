import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import Home from './Pages/Home';
import AdminLogin from './Pages/Admin/AdminLogin';
import Dashboard from './Pages/Admin/Dashboard';
import NotFound from './Pages/NotFound';

function ProtectedRoute({ children }) {
    const accessToken =
        localStorage.getItem('access_token');

    if (!accessToken) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    return children;
}

export default function AppRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    );
}