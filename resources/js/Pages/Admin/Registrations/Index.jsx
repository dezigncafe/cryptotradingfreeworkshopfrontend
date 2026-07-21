import {
    CheckCircle2,
    Clock3,
    Download,
    Eye,
    Search,
    UserRoundX,
    Users,
    X,
    XCircle,
} from 'lucide-react';
import {
    useEffect,
    useState,
} from 'react';

import api from '../../../services/api';

const statusOptions = [
    {
        value: 'confirmed',
        label: 'Confirmed',
    },
    {
        value: 'waitlist',
        label: 'Waitlist',
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
    },
    {
        value: 'rejected',
        label: 'Rejected',
    },
];

const statusClasses = {
    confirmed:
        'bg-emerald-100 text-emerald-700',

    waitlist:
        'bg-amber-100 text-amber-700',

    cancelled:
        'bg-slate-200 text-slate-700',

    rejected:
        'bg-red-100 text-red-700',
};

const initialMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: null,
    to: null,
};

const initialSummary = {
    total: 0,
    confirmed: 0,
    waitlist: 0,
    cancelled: 0,
    rejected: 0,
};

export default function RegistrationIndex() {
    const [
        registrations,
        setRegistrations,
    ] = useState([]);

    const [
        workshops,
        setWorkshops,
    ] = useState([]);

    const [summary, setSummary] =
        useState(initialSummary);

    const [meta, setMeta] =
        useState(initialMeta);

    const [search, setSearch] =
        useState('');

    const [status, setStatus] =
        useState('');

    const [
        workshopId,
        setWorkshopId,
    ] = useState('');

    const [page, setPage] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [
        updatingId,
        setUpdatingId,
    ] = useState(null);

    const [
        selectedRegistration,
        setSelectedRegistration,
    ] = useState(null);

    const [
        exporting,
        setExporting,
    ] = useState(false);

    const [
        refreshKey,
        setRefreshKey,
    ] = useState(0);

    useEffect(() => {
        document.title =
            'Registration Management';
    }, []);

    useEffect(() => {
        const controller =
            new AbortController();

        const timer = setTimeout(
            async () => {
                setLoading(true);
                setError('');

                try {
                    const response =
                        await api.get(
                            '/admin/registrations',
                            {
                                params: {
                                    search:
                                        search ||
                                        undefined,

                                    status:
                                        status ||
                                        undefined,

                                    workshop_id:
                                        workshopId ||
                                        undefined,

                                    page,
                                },

                                signal:
                                    controller
                                        .signal,
                            },
                        );

                    setRegistrations(
                        response.data.data ||
                            [],
                    );

                    setSummary(
                        response.data.summary ||
                            initialSummary,
                    );

                    setWorkshops(
                        response.data
                            .workshops || [],
                    );

                    setMeta({
                        ...initialMeta,
                        ...response.data.meta,
                    });
                } catch (
                    requestError
                ) {
                    if (
                        requestError.code ===
                        'ERR_CANCELED'
                    ) {
                        return;
                    }

                    setError(
                        getErrorMessage(
                            requestError,
                            'Unable to load registrations.',
                        ),
                    );
                } finally {
                    setLoading(false);
                }
            },
            350,
        );

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [
        search,
        status,
        workshopId,
        page,
        refreshKey,
    ]);

    const handleStatusChange =
        async (
            registration,
            newStatus,
        ) => {
            if (
                registration.status ===
                newStatus
            ) {
                return;
            }

            setUpdatingId(
                registration.id,
            );

            setError('');

            try {
                const response =
                    await api.patch(
                        `/admin/registrations/${registration.id}/status`,
                        {
                            status: newStatus,
                        },
                    );

                setRegistrations(
                    (current) =>
                        current.map(
                            (item) =>
                                item.id ===
                                registration.id
                                    ? response
                                          .data
                                          .data
                                    : item,
                        ),
                );

                if (
                    selectedRegistration
                        ?.id ===
                    registration.id
                ) {
                    setSelectedRegistration(
                        response.data.data,
                    );
                }

                setRefreshKey(
                    (current) =>
                        current + 1,
                );
            } catch (
                requestError
            ) {
                setError(
                    getErrorMessage(
                        requestError,
                        'Unable to update registration status.',
                    ),
                );
            } finally {
                setUpdatingId(null);
            }
        };

    const exportRegistrations =
        async () => {
            setExporting(true);
            setError('');

            try {
                const response =
                    await api.get(
                        '/admin/registrations/export',
                        {
                            params: {
                                search:
                                    search ||
                                    undefined,

                                status:
                                    status ||
                                    undefined,

                                workshop_id:
                                    workshopId ||
                                    undefined,
                            },

                            responseType:
                                'blob',
                        },
                    );

                const fileUrl =
                    window.URL
                        .createObjectURL(
                            new Blob([
                                response.data,
                            ]),
                        );

                const link =
                    document.createElement(
                        'a',
                    );

                link.href = fileUrl;

                link.download =
                    `registrations-${new Date()
                        .toISOString()
                        .slice(0, 10)}.csv`;

                document.body.appendChild(
                    link,
                );

                link.click();
                link.remove();

                window.URL
                    .revokeObjectURL(
                        fileUrl,
                    );
            } catch (
                requestError
            ) {
                setError(
                    getErrorMessage(
                        requestError,
                        'Unable to export registrations.',
                    ),
                );
            } finally {
                setExporting(false);
            }
        };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setWorkshopId('');
        setPage(1);
    };

    return (
        <section>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                        Participant Management
                    </p>

                    <h1 className="mt-2 text-3xl font-black text-[#071F42]">
                        Registrations
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Search participants,
                        manage seats and export
                        workshop registrations.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        exportRegistrations
                    }
                    disabled={exporting}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#071F42] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0B2C5D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Download className="h-4 w-4" />

                    {exporting
                        ? 'Exporting...'
                        : 'Export CSV'}
                </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <SummaryCard
                    title="Total"
                    value={summary.total}
                    icon={Users}
                />

                <SummaryCard
                    title="Confirmed"
                    value={
                        summary.confirmed
                    }
                    icon={CheckCircle2}
                />

                <SummaryCard
                    title="Waitlist"
                    value={summary.waitlist}
                    icon={Clock3}
                />

                <SummaryCard
                    title="Cancelled"
                    value={
                        summary.cancelled
                    }
                    icon={XCircle}
                />

                <SummaryCard
                    title="Rejected"
                    value={summary.rejected}
                    icon={UserRoundX}
                />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1fr_230px_260px_auto]">
                    <label className="relative">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                            type="search"
                            value={search}
                            onChange={(
                                event,
                            ) => {
                                setSearch(
                                    event.target
                                        .value,
                                );

                                setPage(1);
                            }}
                            placeholder="Search name, reference, mobile or email..."
                            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100"
                        />
                    </label>

                    <select
                        value={status}
                        onChange={(
                            event,
                        ) => {
                            setStatus(
                                event.target
                                    .value,
                            );

                            setPage(1);
                        }}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="">
                            All Statuses
                        </option>

                        {statusOptions.map(
                            (option) => (
                                <option
                                    key={
                                        option.value
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </option>
                            ),
                        )}
                    </select>

                    <select
                        value={workshopId}
                        onChange={(
                            event,
                        ) => {
                            setWorkshopId(
                                event.target
                                    .value,
                            );

                            setPage(1);
                        }}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="">
                            All Workshops
                        </option>

                        {workshops.map(
                            (workshop) => (
                                <option
                                    key={
                                        workshop.id
                                    }
                                    value={
                                        workshop.id
                                    }
                                >
                                    {workshop.title}
                                    {workshop.trashed
                                        ? ' — Trashed'
                                        : ''}
                                </option>
                            ),
                        )}
                    </select>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-5 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setError('')
                        }
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <LoadingState />
                ) : registrations.length ===
                  0 ? (
                    <EmptyState />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1150px]">
                            <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">
                                        Participant
                                    </th>

                                    <th className="px-5 py-4">
                                        Contact
                                    </th>

                                    <th className="px-5 py-4">
                                        Workshop
                                    </th>

                                    <th className="px-5 py-4">
                                        District
                                    </th>

                                    <th className="px-5 py-4">
                                        Source
                                    </th>

                                    <th className="px-5 py-4">
                                        Registered
                                    </th>

                                    <th className="px-5 py-4">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-right">
                                        View
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {registrations.map(
                                    (
                                        registration,
                                    ) => (
                                        <tr
                                            key={
                                                registration.id
                                            }
                                            className="border-t border-slate-100 transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-black text-[#071F42]">
                                                    {
                                                        registration.full_name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs font-bold text-slate-400">
                                                    {
                                                        registration.reference_number
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm font-bold text-slate-700">
                                                    {formatMobile(
                                                        registration.mobile_number,
                                                    )}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {registration.email ||
                                                        'No email'}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="max-w-[240px] text-sm font-bold text-slate-700">
                                                    {registration
                                                        .workshop
                                                        ?.title ||
                                                        'Workshop unavailable'}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {registration
                                                        .workshop
                                                        ?.date ||
                                                        '—'}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {
                                                    registration.district
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {registration.lead_source ||
                                                    '—'}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {formatDateTime(
                                                    registration.created_at,
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <select
                                                    value={
                                                        registration.status
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                        registration.id
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        handleStatusChange(
                                                            registration,
                                                            event
                                                                .target
                                                                .value,
                                                        )
                                                    }
                                                    className={`rounded-lg border-0 px-3 py-2 text-xs font-black outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                                                        statusClasses[
                                                            registration
                                                                .status
                                                        ] ||
                                                        'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {statusOptions.map(
                                                        (
                                                            option,
                                                        ) => (
                                                            <option
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {
                                                                    option.label
                                                                }
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedRegistration(
                                                            registration,
                                                        )
                                                    }
                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-[#071F42] transition hover:border-[#F5B400] hover:bg-amber-50"
                                                    aria-label="View registration"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination
                    meta={meta}
                    loading={loading}
                    setPage={setPage}
                />
            </div>

            {selectedRegistration && (
                <RegistrationModal
                    registration={
                        selectedRegistration
                    }
                    updating={
                        updatingId ===
                        selectedRegistration.id
                    }
                    onStatusChange={(
                        newStatus,
                    ) =>
                        handleStatusChange(
                            selectedRegistration,
                            newStatus,
                        )
                    }
                    onClose={() =>
                        setSelectedRegistration(
                            null,
                        )
                    }
                />
            )}
        </section>
    );
}

function SummaryCard({
    title,
    value,
    icon: Icon,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-black text-[#071F42]">
                        {value}
                    </p>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#F5B400]" />

            <p className="mt-4 text-sm text-slate-500">
                Loading registrations...
            </p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="py-20 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-300" />

            <p className="mt-4 font-bold text-slate-600">
                No registrations found.
            </p>
        </div>
    );
}

function Pagination({
    meta,
    loading,
    setPage,
}) {
    return (
        <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
                Showing{' '}
                <strong>
                    {meta.from || 0}
                </strong>{' '}
                to{' '}
                <strong>
                    {meta.to || 0}
                </strong>{' '}
                of{' '}
                <strong>
                    {meta.total}
                </strong>
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={
                        loading ||
                        meta.current_page <= 1
                    }
                    onClick={() =>
                        setPage(
                            (current) =>
                                Math.max(
                                    current - 1,
                                    1,
                                ),
                        )
                    }
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Previous
                </button>

                <span className="px-3 text-sm font-bold text-slate-600">
                    {meta.current_page} /{' '}
                    {meta.last_page}
                </span>

                <button
                    type="button"
                    disabled={
                        loading ||
                        meta.current_page >=
                            meta.last_page
                    }
                    onClick={() =>
                        setPage(
                            (current) =>
                                current + 1,
                        )
                    }
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

function RegistrationModal({
    registration,
    updating,
    onStatusChange,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-wide text-amber-600">
                            Registration Details
                        </p>

                        <h2 className="mt-1 text-2xl font-black text-[#071F42]">
                            {
                                registration.full_name
                            }
                        </h2>

                        <p className="mt-1 text-sm font-bold text-slate-400">
                            {
                                registration.reference_number
                            }
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2">
                    <Detail
                        label="Mobile Number"
                        value={formatMobile(
                            registration.mobile_number,
                        )}
                    />

                    <Detail
                        label="WhatsApp Number"
                        value={formatMobile(
                            registration.whatsapp_number,
                        )}
                    />

                    <Detail
                        label="Email"
                        value={
                            registration.email ||
                            '—'
                        }
                    />

                    <Detail
                        label="District"
                        value={
                            registration.district
                        }
                    />

                    <Detail
                        label="Age"
                        value={
                            registration.age ||
                            '—'
                        }
                    />

                    <Detail
                        label="Occupation"
                        value={
                            registration.occupation ||
                            '—'
                        }
                    />

                    <Detail
                        label="Trading Experience"
                        value={
                            registration.trading_experience
                                ? 'Yes'
                                : 'No'
                        }
                    />

                    <Detail
                        label="Binance Account"
                        value={
                            registration.binance_account
                                ? 'Yes'
                                : 'No'
                        }
                    />

                    <Detail
                        label="Lead Source"
                        value={
                            registration.lead_source ||
                            '—'
                        }
                    />

                    <Detail
                        label="Registered At"
                        value={formatDateTime(
                            registration.created_at,
                        )}
                    />

                    <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                            Workshop
                        </p>

                        <p className="mt-2 font-black text-[#071F42]">
                            {registration.workshop
                                ?.title ||
                                'Workshop unavailable'}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                            {registration.workshop
                                ?.date || '—'}
                            {' · '}
                            {registration.workshop
                                ?.venue || '—'}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">
                        <label className="text-xs font-black uppercase tracking-wide text-slate-500">
                            Registration Status
                        </label>

                        <select
                            value={
                                registration.status
                            }
                            disabled={updating}
                            onChange={(event) =>
                                onStatusChange(
                                    event.target
                                        .value,
                                )
                            }
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                        >
                            {statusOptions.map(
                                (option) => (
                                    <option
                                        key={
                                            option.value
                                        }
                                        value={
                                            option.value
                                        }
                                    >
                                        {
                                            option.label
                                        }
                                    </option>
                                ),
                            )}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Detail({
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-2 break-words text-sm font-bold text-slate-700">
                {value}
            </p>
        </div>
    );
}

function formatMobile(number) {
    if (!number) {
        return '—';
    }

    return number.startsWith('+')
        ? number
        : `+${number}`;
}

function formatDateTime(value) {
    if (!value) {
        return '—';
    }

    return new Date(
        value,
    ).toLocaleString('en-LK', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getErrorMessage(
    error,
    fallback,
) {
    const validationErrors =
        error.response?.data?.errors;

    if (validationErrors) {
        return Object.values(
            validationErrors,
        )
            .flat()
            .join(' ');
    }

    return (
        error.response?.data?.message ||
        fallback
    );
}