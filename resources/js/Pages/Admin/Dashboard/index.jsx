import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    Loader2,
    MapPin,
    RefreshCw,
    UserCheck,
    Users,
    UserX,
    X,
} from 'lucide-react';

import {
    useEffect,
    useState,
} from 'react';

import api from '../../../services/api';

const initialStats = {
    total_registrations: 0,
    today_registrations: 0,
    confirmed: 0,
    waitlist: 0,
    upcoming_workshops: 0,
    attendance_rate: 0,
};

export default function AdminDashboard() {
    const [
        stats,
        setStats,
    ] = useState(
        initialStats,
    );

    const [
        recentRegistrations,
        setRecentRegistrations,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState('');

    const [
        selectedRegistration,
        setSelectedRegistration,
    ] = useState(null);

    const [
        detailLoading,
        setDetailLoading,
    ] = useState(false);

    const [
        detailError,
        setDetailError,
    ] = useState('');

    const loadDashboard =
        async (
            showRefreshLoader = false,
        ) => {
            if (showRefreshLoader) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError('');

            try {
                const response =
                    await api.get(
                        '/admin/dashboard',
                    );

                setStats({
                    ...initialStats,
                    ...(response.data
                        ?.stats || {}),
                });

                setRecentRegistrations(
                    response.data
                        ?.recent_registrations ||
                        [],
                );
            } catch (
                requestError
            ) {
                setError(
                    requestError.response
                        ?.data?.message ||
                        'Unable to load dashboard data.',
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

    useEffect(() => {
        document.title =
            'Admin Dashboard';

        loadDashboard();
    }, []);

    const openRegistrationDetails =
        async (
            registrationId,
        ) => {
            setDetailLoading(true);
            setDetailError('');
            setSelectedRegistration(
                null,
            );

            try {
                const response =
                    await api.get(
                        `/admin/dashboard/registrations/${registrationId}`,
                    );

                setSelectedRegistration(
                    response.data.data,
                );
            } catch (
                requestError
            ) {
                setDetailError(
                    requestError.response
                        ?.data?.message ||
                        'Unable to load registration details.',
                );
            } finally {
                setDetailLoading(false);
            }
        };

    if (loading) {
        return (
            <div className="grid min-h-[420px] place-items-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-amber-500" />

                    <p className="mt-3 font-bold text-slate-500">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                        Overview
                    </p>

                    <h1 className="mt-2 text-3xl font-black text-[#071F42]">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Monitor workshops,
                        registrations and attendance.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        loadDashboard(
                            true,
                        )
                    }
                    disabled={
                        refreshing
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#071F42] px-4 py-2 text-sm font-black text-white transition hover:bg-[#0B2C5D] disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            refreshing
                                ? 'animate-spin'
                                : ''
                        }`}
                    />

                    Refresh
                </button>
            </div>

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
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
                    value={
                        stats.confirmed
                    }
                    icon={UserCheck}
                    description="Confirmed participants"
                />

                <KpiCard
                    title="Waitlist"
                    value={
                        stats.waitlist
                    }
                    icon={UserX}
                    description="Participants waiting for seats"
                />

                <KpiCard
                    title="Upcoming Workshops"
                    value={
                        stats.upcoming_workshops
                    }
                    icon={
                        CalendarDays
                    }
                    description="Scheduled active workshops"
                />

                <KpiCard
                    title="Attendance Rate"
                    value={`${stats.attendance_rate}%`}
                    icon={
                        CheckCircle2
                    }
                    description="Confirmed participant attendance"
                />

            </div>

            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-black text-[#071F42]">
                            Recent Registrations
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Latest participant registrations.
                        </p>
                    </div>

                    <span className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                        {
                            recentRegistrations.length
                        }{' '}
                        Records
                    </span>
                </div>

                {recentRegistrations.length ===
                0 ? (
                    <div className="px-6 py-16 text-center text-slate-500">
                        No registrations have been received yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
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
                                        Location
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4">
                                        Attendance
                                    </th>


                                    <th className="px-6 py-4">
                                        Registered
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Action
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
                                            className="border-t border-slate-100 transition hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-black text-[#071F42]">
                                                    {
                                                        registration.full_name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {
                                                        registration.reference_number
                                                    }
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-600">
                                                {
                                                    registration.mobile_number
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="max-w-[220px] text-sm font-bold text-slate-700">
                                                    {
                                                        registration.workshop_title ||
                                                        '—'
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-700">
                                                    {
                                                        registration.location
                                                            ?.city ||
                                                        '—'
                                                    }
                                                </p>

                                                <p className="mt-1 max-w-[220px] text-xs text-slate-400">
                                                    {
                                                        registration.location
                                                            ?.venue ||
                                                        '—'
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    status={
                                                        registration.status
                                                    }
                                                />
                                            </td>

                                            <td className="px-6 py-4">
                                                <AttendanceBadge
                                                    status={
                                                        registration.attendance_status
                                                    }
                                                />
                                            </td>


                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                {formatDateTime(
                                                    registration.registered_at,
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openRegistrationDetails(
                                                            registration.id,
                                                        )
                                                    }
                                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#071F42] px-4 py-2 text-xs font-black text-white transition hover:bg-[#0B2C5D]"
                                                >
                                                    <Eye className="h-4 w-4" />

                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {detailLoading && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="rounded-2xl bg-white p-8 shadow-2xl">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-amber-500" />

                        <p className="mt-3 font-bold text-slate-600">
                            Loading registration details...
                        </p>
                    </div>
                </div>
            )}

            {selectedRegistration && (
                <RegistrationDetailsModal
                    registration={
                        selectedRegistration
                    }
                    onClose={() =>
                        setSelectedRegistration(
                            null,
                        )
                    }
                />
            )}

            {detailError && (
                <div className="fixed bottom-5 right-5 z-50 max-w-md rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700 shadow-xl">
                    {detailError}
                </div>
            )}
        </div>
    );
}

function KpiCard({
    title,
    value,
    icon: Icon,
    description,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        {title}
                    </p>

                    <p className="mt-3 text-3xl font-black text-[#071F42]">
                        {value}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        {description}
                    </p>
                </div>

                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}

function RegistrationDetailsModal({
    registration,
    onClose,
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={
                onClose
            }
        >
            <div
                className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                onClick={(
                    event,
                ) =>
                    event.stopPropagation()
                }
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.15em] text-amber-600">
                            Registration Details
                        </p>

                        <h3 className="mt-1 text-2xl font-black text-[#071F42]">
                            {
                                registration.full_name
                            }
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-6 p-6">
                    <div className="rounded-2xl bg-[#071F42] p-5 text-white">
                        <p className="text-xs font-black uppercase tracking-wide text-amber-300">
                            Registration Reference
                        </p>

                        <p className="mt-2 text-2xl font-black">
                            {
                                registration.reference_number
                            }
                        </p>

                        <div className="mt-4">
                            <StatusBadge
                                status={
                                    registration.status
                                }
                            />
                        </div>
                    </div>

                    <DetailSection title="Participant Information">
                        <DetailItem
                            label="Full Name"
                            value={
                                registration.full_name
                            }
                        />

                        <DetailItem
                            label="Mobile Number"
                            value={
                                registration.mobile_number
                            }
                        />

                        <DetailItem
                            label="WhatsApp Number"
                            value={
                                registration.whatsapp_number
                            }
                        />

                        <DetailItem
                            label="Email"
                            value={
                                registration.email
                            }
                        />

                        <DetailItem
                            label="District"
                            value={
                                registration.district
                            }
                        />

                        <DetailItem
                            label="Age"
                            value={
                                registration.age
                            }
                        />

                        <DetailItem
                            label="Occupation"
                            value={
                                registration.occupation
                            }
                        />

                        <DetailItem
                            label="Lead Source"
                            value={
                                registration.lead_source
                            }
                        />

                        <DetailItem
                            label="Trading Experience"
                            value={
                                registration.trading_experience
                                    ? 'Yes'
                                    : 'No'
                            }
                        />

                        <DetailItem
                            label="Binance Account"
                            value={
                                registration.binance_account
                                    ? 'Yes'
                                    : 'No'
                            }
                        />
                    </DetailSection>

                    <DetailSection title="Workshop Information">
                        <DetailItem
                            label="Workshop"
                            value={
                                registration.workshop
                                    ?.title
                            }
                        />

                        <DetailItem
                            label="Presenter"
                            value={
                                registration.workshop
                                    ?.presenter
                            }
                        />

                        <DetailItem
                            label="Date"
                            value={
                                registration.workshop
                                    ?.date
                            }
                        />

                        <DetailItem
                            label="Time"
                            value={joinTimeRange(
                                registration.workshop
                                    ?.start_time,

                                registration.workshop
                                    ?.end_time,
                            )}
                        />

                        <DetailItem
                            label="Workshop Status"
                            value={
                                registration.workshop
                                    ?.status
                            }
                        />
                    </DetailSection>

                    <DetailSection title="Location Information">
                        <DetailItem
                            label="District"
                            value={
                                registration.location
                                    ?.district
                            }
                        />

                        <DetailItem
                            label="City"
                            value={
                                registration.location
                                    ?.city
                            }
                        />

                        <DetailItem
                            label="Venue"
                            value={
                                registration.location
                                    ?.venue
                            }
                        />

                        <DetailItem
                            label="Capacity"
                            value={
                                registration.location
                                    ?.capacity
                            }
                        />

                        {registration.location
                            ?.map_url && (
                            <div>
                                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                                    Map
                                </p>

                                <a
                                    href={
                                        registration.location
                                            .map_url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex items-center gap-2 font-black text-blue-700"
                                >
                                    <MapPin className="h-4 w-4" />

                                    View Location
                                </a>
                            </div>
                        )}
                    </DetailSection>

               

                    <DetailSection title="Attendance Information">
                        <DetailItem
                            label="Attendance Status"
                            value={
                                registration.attendance
                                    ?.status ||
                                'Not Marked'
                            }
                        />

                        <DetailItem
                            label="Checked In"
                            value={formatDateTime(
                                registration.attendance
                                    ?.checked_in_at,
                            )}
                        />

                        <DetailItem
                            label="Checked Out"
                            value={formatDateTime(
                                registration.attendance
                                    ?.checked_out_at,
                            )}
                        />

                        <DetailItem
                            label="Check-in Method"
                            value={
                                registration.attendance
                                    ?.check_in_method
                            }
                        />

                        <DetailItem
                            label="Marked By"
                            value={
                                registration.attendance
                                    ?.marked_by
                            }
                        />

                        <DetailItem
                            label="Notes"
                            value={
                                registration.attendance
                                    ?.notes
                            }
                        />
                    </DetailSection>

                    <DetailSection title="System Information">
                        <DetailItem
                            label="Registered At"
                            value={formatDateTime(
                                registration.registered_at,
                            )}
                        />

                        <DetailItem
                            label="Database ID"
                            value={
                                registration.id
                            }
                        />
                    </DetailSection>
                </div>
            </div>
        </div>
    );
}

function DetailSection({
    title,
    children,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="text-sm font-black uppercase tracking-wide text-[#071F42]">
                {title}
            </h4>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {children}
            </div>
        </section>
    );
}

function DetailItem({
    label,
    value,
}) {
    return (
        <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 break-words font-bold text-slate-700">
                {value ?? '—'}
            </p>
        </div>
    );
}

function StatusBadge({
    status,
}) {
    const styles = {
        confirmed:
            'bg-emerald-100 text-emerald-700',

        waitlist:
            'bg-amber-100 text-amber-700',

        cancelled:
            'bg-red-100 text-red-700',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase ${
                styles[status] ||
                'bg-slate-100 text-slate-600'
            }`}
        >
            {status || 'Unknown'}
        </span>
    );
}



function AttendanceBadge({
    status,
}) {
    const styles = {
        present:
            'bg-emerald-100 text-emerald-700',

        late:
            'bg-amber-100 text-amber-700',

        absent:
            'bg-red-100 text-red-700',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase ${
                styles[status] ||
                'bg-slate-100 text-slate-600'
            }`}
        >
            {status || 'Not Marked'}
        </span>
    );
}

function joinTimeRange(
    startTime,
    endTime,
) {
    if (
        startTime &&
        endTime
    ) {
        return `${startTime} - ${endTime}`;
    }

    return (
        startTime ||
        endTime ||
        '—'
    );
}

function formatDateTime(
    value,
) {
    if (!value) {
        return '—';
    }

    try {
        return new Intl
            .DateTimeFormat(
                'en-LK',
                {
                    dateStyle:
                        'medium',

                    timeStyle:
                        'short',

                    timeZone:
                        'Asia/Colombo',
                },
            )
            .format(
                new Date(value),
            );
    } catch {
        return value;
    }
}