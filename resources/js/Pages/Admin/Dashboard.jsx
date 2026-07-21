import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    UserCheck,
    Users,
    UserX,
} from 'lucide-react';

import {
    useEffect,
    useState,
} from 'react';

import KpiCard from '../../Components/Admin/KpiCard';
import api from '../../services/api';

const initialStats = {
    total_registrations: 0,
    today_registrations: 0,
    confirmed: 0,
    waitlist: 0,
    upcoming_workshops: 0,
    attendance_rate: 0,
};

export default function AdminDashboard() {
    const [stats, setStats] =
        useState(initialStats);

    const [recentRegistrations, setRecentRegistrations] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        document.title = 'Admin Dashboard';

        const loadDashboard = async () => {
            try {
                const response =
                    await api.get(
                        '/admin/dashboard',
                    );

                setStats(response.data.stats);

                setRecentRegistrations(
                    response.data
                        .recent_registrations ||
                        [],
                );
            } catch {
                setError(
                    'Unable to load dashboard data.',
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="py-20 text-center text-slate-500">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div>
            <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                    Overview
                </p>

                <h2 className="mt-2 text-3xl font-black text-[#071F42]">
                    Admin Dashboard
                </h2>

                <p className="mt-2 text-slate-500">
                    Monitor workshops,
                    registrations and attendance.
                </p>
            </div>

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <KpiCard
                    title="Total Registrations"
                    value={
                        stats.total_registrations
                    }
                    icon={Users}
                    description="All workshop registrations"
                />

                <KpiCard
                    title="Today's Registrations"
                    value={
                        stats.today_registrations
                    }
                    icon={Clock3}
                    description="Registrations received today"
                />

                <KpiCard
                    title="Confirmed Seats"
                    value={stats.confirmed}
                    icon={UserCheck}
                    description="Confirmed participants"
                />

                <KpiCard
                    title="Waitlist"
                    value={stats.waitlist}
                    icon={UserX}
                    description="Participants waiting for seats"
                />

                <KpiCard
                    title="Upcoming Workshops"
                    value={
                        stats.upcoming_workshops
                    }
                    icon={CalendarDays}
                    description="Scheduled active workshops"
                />

                <KpiCard
                    title="Attendance Rate"
                    value={`${stats.attendance_rate}%`}
                    icon={CheckCircle2}
                    description="Confirmed participant attendance"
                />
            </div>

            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                    <h3 className="text-lg font-black text-[#071F42]">
                        Recent Registrations
                    </h3>
                </div>

                {recentRegistrations.length === 0 ? (
                    <div className="px-6 py-16 text-center text-slate-500">
                        No registrations have been received yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">
                                        Participant
                                    </th>
                                    <th className="px-6 py-4">
                                        Mobile
                                    </th>
                                    <th className="px-6 py-4">
                                        Workshop
                                    </th>
                                    <th className="px-6 py-4">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentRegistrations.map(
                                    (
                                        registration,
                                    ) => (
                                        <tr
                                            key={
                                                registration.id
                                            }
                                            className="border-t border-slate-100"
                                        >
                                            <td className="px-6 py-4 font-semibold">
                                                {
                                                    registration.full_name
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                {
                                                    registration.mobile
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                {
                                                    registration.workshop_title
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                {
                                                    registration.status
                                                }
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}