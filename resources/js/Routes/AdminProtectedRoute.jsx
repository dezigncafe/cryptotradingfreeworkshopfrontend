import {
    useEffect,
    useState,
} from 'react';

import {
    Navigate,
    Outlet,
    useLocation,
} from 'react-router-dom';

import api from '../services/api';

export default function AdminProtectedRoute() {
    const location = useLocation();

    const [status, setStatus] =
        useState('loading');

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem(
                'admin_access_token',
            );

            if (!token) {
                setStatus('unauthenticated');
                return;
            }

            try {
                const response =
                    await api.get('/admin/me');

                if (
                    response.data.user.role !==
                    'admin'
                ) {
                    throw new Error(
                        'Administrator role required.',
                    );
                }

                localStorage.setItem(
                    'admin_user',
                    JSON.stringify(
                        response.data.user,
                    ),
                );

                setStatus('authenticated');
            } catch {
                localStorage.removeItem(
                    'admin_access_token',
                );

                localStorage.removeItem(
                    'admin_user',
                );

                setStatus('unauthenticated');
            }
        };

        verifyAdmin();
    }, []);

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#F5B400]" />

                    <p className="mt-4 font-semibold text-slate-600">
                        Verifying administrator...
                    </p>
                </div>
            </div>
        );
    }

    if (status !== 'authenticated') {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    return <Outlet />;
}