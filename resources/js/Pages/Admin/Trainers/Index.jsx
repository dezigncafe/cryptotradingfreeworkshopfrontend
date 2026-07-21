import {
    Pencil,
    Plus,
    Search,
    Trash2,
    UserRound,
} from 'lucide-react';
import {
    useEffect,
    useState,
} from 'react';
import {
    Link,
} from 'react-router-dom';

import api from '../../../services/api';

const initialMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    from: null,
    to: null,
};

export default function TrainerIndex() {
    const [trainers, setTrainers] =
        useState([]);

    const [search, setSearch] =
        useState('');

    const [active, setActive] =
        useState('');

    const [page, setPage] =
        useState(1);

    const [meta, setMeta] =
        useState(initialMeta);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [deletingId, setDeletingId] =
        useState(null);

    const [refreshKey, setRefreshKey] =
        useState(0);

    useEffect(() => {
        document.title =
            'Trainer Management';
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
                            '/admin/trainers',
                            {
                                params: {
                                    search:
                                        search ||
                                        undefined,

                                    active:
                                        active === ''
                                            ? undefined
                                            : active,

                                    page,
                                },

                                signal:
                                    controller
                                        .signal,
                            },
                        );

                    setTrainers(
                        response.data.data ||
                            [],
                    );

                    setMeta({
                        ...initialMeta,
                        ...response.data.meta,
                    });
                } catch (requestError) {
                    if (
                        requestError.code ===
                        'ERR_CANCELED'
                    ) {
                        return;
                    }

                    setError(
                        getErrorMessage(
                            requestError,
                            'Unable to load trainers.',
                        ),
                    );
                } finally {
                    setLoading(false);
                }
            },
            300,
        );

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [
        search,
        active,
        page,
        refreshKey,
    ]);

    const deleteTrainer = async (
        trainer,
    ) => {
        const confirmed =
            window.confirm(
                `Delete trainer "${trainer.name}"?`,
            );

        if (!confirmed) {
            return;
        }

        setDeletingId(trainer.id);
        setError('');

        try {
            await api.delete(
                `/admin/trainers/${trainer.id}`,
            );

            setRefreshKey(
                (current) =>
                    current + 1,
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'Unable to delete trainer.',
                ),
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <section>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                        Content Management
                    </p>

                    <h1 className="mt-2 text-3xl font-black text-[#071F42]">
                        Trainers
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Create trainer profiles,
                        upload photos and manage
                        public visibility.
                    </p>
                </div>

                <Link
                    to="/admin/trainers/create"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#071F42] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0B2C5D]"
                >
                    <Plus className="h-5 w-5" />

                    Add Trainer
                </Link>
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_220px]">
                <label className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) => {
                            setSearch(
                                event.target.value,
                            );

                            setPage(1);
                        }}
                        placeholder="Search trainer name, role or biography..."
                        className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100"
                    />
                </label>

                <select
                    value={active}
                    onChange={(event) => {
                        setActive(
                            event.target.value,
                        );

                        setPage(1);
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100"
                >
                    <option value="">
                        All Trainers
                    </option>

                    <option value="1">
                        Active
                    </option>

                    <option value="0">
                        Inactive
                    </option>
                </select>
            </div>

            {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <LoadingState />
                ) : trainers.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">
                                        Trainer
                                    </th>

                                    <th className="px-5 py-4">
                                        Role
                                    </th>

                                    <th className="px-5 py-4">
                                        Display Order
                                    </th>

                                    <th className="px-5 py-4">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {trainers.map(
                                    (trainer) => (
                                        <tr
                                            key={
                                                trainer.id
                                            }
                                            className="border-t border-slate-100 transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-4">
                                                    {trainer.photo_url ? (
                                                            <img
                                                                src={trainer.photo_url}
                                                                alt={trainer.name}
                                                                className="h-16 w-16 rounded-xl object-cover"
                                                                onError={(event) => {
                                                                    console.error(
                                                                        'Trainer image failed:',
                                                                        event.currentTarget.src,
                                                                    );
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="grid h-16 w-16 place-items-center rounded-xl bg-slate-100">
                                                                No Image
                                                            </div>
                                                        )}

                                                    <div>
                                                        <p className="font-black text-[#071F42]">
                                                            {
                                                                trainer.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 max-w-[300px] truncate text-xs text-slate-500">
                                                            {trainer.bio ||
                                                                'No biography added'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                                                {
                                                    trainer.role
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm font-bold text-slate-600">
                                                {
                                                    trainer.display_order
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                                                        trainer.is_active
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-slate-200 text-slate-600'
                                                    }`}
                                                >
                                                    {trainer.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        to={`/admin/trainers/${trainer.id}/edit`}
                                                        className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-[#071F42] transition hover:border-[#F5B400] hover:bg-amber-50"
                                                        aria-label="Edit trainer"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            deletingId ===
                                                            trainer.id
                                                        }
                                                        onClick={() =>
                                                            deleteTrainer(
                                                                trainer,
                                                            )
                                                        }
                                                        className="grid h-10 w-10 place-items-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        aria-label="Delete trainer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
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
        </section>
    );
}

function LoadingState() {
    return (
        <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#F5B400]" />

            <p className="mt-4 text-sm text-slate-500">
                Loading trainers...
            </p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="py-20 text-center">
            <UserRound className="mx-auto h-12 w-12 text-slate-300" />

            <p className="mt-4 font-bold text-slate-600">
                No trainers found.
            </p>

            <Link
                to="/admin/trainers/create"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#071F42] px-5 py-3 text-sm font-black text-white"
            >
                <Plus className="h-4 w-4" />

                Add First Trainer
            </Link>
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
                    {meta.current_page}
                    {' / '}
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