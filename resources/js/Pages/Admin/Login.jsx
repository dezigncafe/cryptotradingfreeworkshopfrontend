import {
    useEffect,
    useState,
} from 'react';

import {
    useLocation,
    useNavigate,
} from 'react-router-dom';

import api from '../../services/api';

export default function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [submitting, setSubmitting] =
        useState(false);

    useEffect(() => {
        document.title = 'Admin Login';
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitting(true);
        setError('');

        try {
            const response = await api.post(
                '/admin/login',
                form,
            );

            localStorage.setItem(
                'admin_access_token',
                response.data.access_token,
            );

            localStorage.setItem(
                'admin_user',
                JSON.stringify(
                    response.data.user,
                ),
            );

            const destination =
                location.state?.from || '/admin';

            navigate(destination, {
                replace: true,
            });
        } catch (requestError) {
            const errors =
                requestError.response?.data?.errors;

            if (errors) {
                setError(
                    Object.values(errors)
                        .flat()
                        .join(' '),
                );
            } else {
                setError(
                    requestError.response?.data
                        ?.message ||
                        'Unable to log in.',
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="grid min-h-screen bg-[#071F42] lg:grid-cols-2">
            <section className="hidden items-center justify-center bg-gradient-to-br from-[#071F42] to-[#0B2C5D] p-12 text-white lg:flex">
                <div className="max-w-xl">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#F5B400] text-xl font-black text-[#071F42]">
                        EQ
                    </div>

                    <h1 className="mt-8 text-5xl font-black">
                        Workshop Admin
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-slate-300">
                        Manage workshops,
                        registrations, trainers,
                        attendance and workshop
                        communications.
                    </p>
                </div>
            </section>

            <section className="flex items-center justify-center bg-slate-50 p-5 sm:p-10">
                <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-10">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                        Secure Administration
                    </p>

                    <h2 className="mt-3 text-3xl font-black text-[#071F42]">
                        Admin Login
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Enter your administrator
                        credentials.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >
                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700">
                                Email Address
                            </span>

                            <input
                                required
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700">
                                Password
                            </span>

                            <input
                                required
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100"
                            />
                        </label>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-xl bg-[#F5B400] px-5 py-4 font-black uppercase text-[#071F42] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting
                                ? 'Signing In...'
                                : 'Login to Dashboard'}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}