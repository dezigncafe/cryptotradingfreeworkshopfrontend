import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    ImageIcon,
    MapPin,
    Plus,
    Save,
    Trash2,
    Upload,
    UserRound,
    Users,
    X,
} from 'lucide-react';

import {
    useEffect,
    useState,
} from 'react';

import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';

import api from '../../../services/api';

const inputClass =
    'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    {
        value: 'registration_open',
        label: 'Registration Open',
    },
    { value: 'full', label: 'Full' },
    {
        value: 'registration_closed',
        label: 'Registration Closed',
    },
    {
        value: 'completed',
        label: 'Completed',
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
    },
    {
        value: 'archived',
        label: 'Archived',
    },
];

function createLocalKey() {
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID ===
            'function'
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
}

function createEmptyLocation() {
    return {
        local_key: createLocalKey(),
        id: null,
        district: '',
        city: '',
        venue: '',
        map_url: '',
        capacity: '100',
        whatsapp_group_url: '',
        trainer_ids: [],
    };
}

function createInitialForm() {
    return {
        title: '',
        description: '',
        workshop_date: '',
        start_time: '',
        end_time: '',
        arrival_time: '',
        registration_open_at: '',
        registration_close_at: '',
        status: 'draft',
        is_featured: false,
        locations: [
            createEmptyLocation(),
        ],
    };
}

export default function WorkshopForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [form, setForm] =
        useState(() =>
            createInitialForm(),
        );

    const [trainers, setTrainers] =
        useState([]);

    const [banner, setBanner] =
        useState(null);

    const [
        bannerPreview,
        setBannerPreview,
    ] = useState('');

    const [
        existingBanner,
        setExistingBanner,
    ] = useState('');

    const [
        removeBanner,
        setRemoveBanner,
    ] = useState(false);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState('');

    useEffect(() => {
        document.title = isEditing
            ? 'Edit Workshop'
            : 'Create Workshop';
    }, [isEditing]);

    useEffect(() => {
        const controller =
            new AbortController();

        const loadPageData = async () => {
            setLoading(true);
            setError('');

            try {
                const trainerRequest =
                    api.get('/trainers', {
                        signal:
                            controller.signal,
                    });

                const workshopRequest =
                    isEditing
                        ? api.get(
                              `/admin/workshops/${id}`,
                              {
                                  signal:
                                      controller.signal,
                              },
                          )
                        : Promise.resolve(
                              null,
                          );

                const [
                    trainerResponse,
                    workshopResponse,
                ] = await Promise.all([
                    trainerRequest,
                    workshopRequest,
                ]);

                setTrainers(
                    trainerResponse.data
                        .data || [],
                );

                if (
                    isEditing &&
                    workshopResponse
                ) {
                    const workshop =
                        workshopResponse.data
                            .data;

                    setForm({
                        title:
                            workshop.title ||
                            '',

                        description:
                            workshop.description ||
                            '',

                        workshop_date:
                            formatDateInput(
                                workshop.workshop_date,
                            ),

                        start_time:
                            normalizeTime(
                                workshop.start_time,
                            ),

                        end_time:
                            normalizeTime(
                                workshop.end_time,
                            ),

                        arrival_time:
                            normalizeTime(
                                workshop.arrival_time,
                            ),

                        registration_open_at:
                            formatDateTimeInput(
                                workshop.registration_open_at,
                            ),

                        registration_close_at:
                            formatDateTimeInput(
                                workshop.registration_close_at,
                            ),

                        status:
                            workshop.status ||
                            'draft',

                        is_featured:
                            Boolean(
                                workshop.is_featured,
                            ),

                        locations:
                            createLocationsFromWorkshop(
                                workshop,
                            ),
                    });

                    setExistingBanner(
                        workshop.banner_url ||
                            getStorageUrl(
                                workshop.banner_path,
                            ),
                    );
                }
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
                        'Unable to load workshop information.',
                    ),
                );
            } finally {
                setLoading(false);
            }
        };

        loadPageData();

        return () => {
            controller.abort();
        };
    }, [
        id,
        isEditing,
    ]);

    useEffect(() => {
        return () => {
            if (
                bannerPreview.startsWith(
                    'blob:',
                )
            ) {
                URL.revokeObjectURL(
                    bannerPreview,
                );
            }
        };
    }, [bannerPreview]);

    const handleGlobalChange = (
        event,
    ) => {
        const {
            name,
            value,
            checked,
            type,
        } = event.target;

        setForm((current) => ({
            ...current,

            [name]:
                type === 'checkbox'
                    ? checked
                    : value,
        }));
    };

    const addLocation = () => {
        setForm((current) => ({
            ...current,

            locations: [
                ...current.locations,
                createEmptyLocation(),
            ],
        }));
    };

    const removeLocation = (
        locationKey,
    ) => {
        setForm((current) => {
            if (
                current.locations.length <= 1
            ) {
                return current;
            }

            return {
                ...current,

                locations:
                    current.locations.filter(
                        (location) =>
                            location.local_key !==
                            locationKey,
                    ),
            };
        });
    };

    const updateLocation = (
        locationKey,
        field,
        value,
    ) => {
        setForm((current) => ({
            ...current,

            locations:
                current.locations.map(
                    (location) => {
                        if (
                            location.local_key !==
                            locationKey
                        ) {
                            return location;
                        }

                        return {
                            ...location,
                            [field]: value,
                        };
                    },
                ),
        }));
    };

    const toggleLocationTrainer = (
        locationKey,
        trainerId,
    ) => {
        const numericTrainerId =
            Number(trainerId);

        setForm((current) => ({
            ...current,

            locations:
                current.locations.map(
                    (location) => {
                        if (
                            location.local_key !==
                            locationKey
                        ) {
                            return location;
                        }

                        const selected =
                            location.trainer_ids.some(
                                (idValue) =>
                                    Number(
                                        idValue,
                                    ) ===
                                    numericTrainerId,
                            );

                        return {
                            ...location,

                            trainer_ids:
                                selected
                                    ? location.trainer_ids.filter(
                                          (
                                              idValue,
                                          ) =>
                                              Number(
                                                  idValue,
                                              ) !==
                                              numericTrainerId,
                                      )
                                    : [
                                          ...location.trainer_ids,
                                          numericTrainerId,
                                      ],
                        };
                    },
                ),
        }));
    };

    const handleBannerChange = (
        event,
    ) => {
        const selectedFile =
            event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        if (
            !allowedTypes.includes(
                selectedFile.type,
            )
        ) {
            setError(
                'Banner must be a JPG, PNG or WEBP image.',
            );

            event.target.value = '';
            return;
        }

        if (
            selectedFile.size >
            5 * 1024 * 1024
        ) {
            setError(
                'Banner size must be less than 5MB.',
            );

            event.target.value = '';
            return;
        }

        if (
            bannerPreview.startsWith(
                'blob:',
            )
        ) {
            URL.revokeObjectURL(
                bannerPreview,
            );
        }

        setBanner(selectedFile);

        setBannerPreview(
            URL.createObjectURL(
                selectedFile,
            ),
        );

        setExistingBanner('');
        setRemoveBanner(false);
        setError('');
    };

    const clearBanner = () => {
        if (
            bannerPreview.startsWith(
                'blob:',
            )
        ) {
            URL.revokeObjectURL(
                bannerPreview,
            );
        }

        setBanner(null);
        setBannerPreview('');
        setExistingBanner('');
        setRemoveBanner(true);
    };

    const validateBeforeSubmit = () => {
        if (
            form.start_time &&
            form.end_time &&
            form.start_time >=
                form.end_time
        ) {
            return 'Workshop end time must be after the workshop start time.';
        }

        if (
            form.arrival_time &&
            form.start_time &&
            form.arrival_time >
                form.start_time
        ) {
            return 'Arrival time must be before or equal to the workshop start time.';
        }

        if (
            form.registration_open_at &&
            form.registration_close_at &&
            form.registration_open_at >=
                form.registration_close_at
        ) {
            return 'Registration closing date must be after the registration opening date.';
        }

        if (
            form.locations.length === 0
        ) {
            return 'Add at least one workshop location.';
        }

        const assignedTrainers =
            new Map();

        for (
            let index = 0;
            index <
            form.locations.length;
            index += 1
        ) {
            const location =
                form.locations[index];

            const locationLabel =
                location.city.trim() ||
                `Location ${index + 1}`;

            if (!location.district) {
                return `Select a district for ${locationLabel}.`;
            }

            if (!location.city.trim()) {
                return `Enter the city for Location ${index + 1}.`;
            }

            if (!location.venue.trim()) {
                return `Enter the venue for ${locationLabel}.`;
            }

            if (
                Number(
                    location.capacity,
                ) < 1
            ) {
                return `Enter a valid capacity for ${locationLabel}.`;
            }

            if (
                location.trainer_ids
                    .length === 0
            ) {
                return `Select at least one trainer for ${locationLabel}.`;
            }

            for (
                const trainerId of
                    location.trainer_ids
            ) {
                const trainer =
                    trainers.find(
                        (item) =>
                            Number(
                                item.id,
                            ) ===
                            Number(
                                trainerId,
                            ),
                    );

                const trainerName =
                    trainer?.name ||
                    'Selected trainer';

                if (
                    assignedTrainers.has(
                        Number(
                            trainerId,
                        ),
                    )
                ) {
                    const otherLocation =
                        assignedTrainers.get(
                            Number(
                                trainerId,
                            ),
                        );

                    return `${trainerName} is already assigned to ${otherLocation}. All locations run at the same time, so one trainer cannot teach at two locations.`;
                }

                assignedTrainers.set(
                    Number(trainerId),
                    locationLabel,
                );
            }
        }

        return null;
    };

    const handleSubmit = async (
        event,
    ) => {
        event.preventDefault();

        const validationMessage =
            validateBeforeSubmit();

        if (validationMessage) {
            setError(
                validationMessage,
            );

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });

            return;
        }

        setSubmitting(true);
        setError('');

        const formData =
            new FormData();

        formData.append(
            'title',
            form.title.trim(),
        );

        formData.append(
            'description',
            form.description.trim(),
        );

        formData.append(
            'workshop_date',
            form.workshop_date,
        );

        formData.append(
            'start_time',
            form.start_time,
        );

        formData.append(
            'end_time',
            form.end_time,
        );

        formData.append(
            'arrival_time',
            form.arrival_time,
        );

        formData.append(
            'registration_open_at',
            form.registration_open_at,
        );

        formData.append(
            'registration_close_at',
            form.registration_close_at,
        );

        formData.append(
            'status',
            form.status,
        );

        formData.append(
            'is_featured',
            form.is_featured
                ? '1'
                : '0',
        );

        formData.append(
            'remove_banner',
            removeBanner
                ? '1'
                : '0',
        );

        if (banner) {
            formData.append(
                'banner',
                banner,
            );
        }

        form.locations.forEach(
            (
                location,
                locationIndex,
            ) => {
                if (location.id) {
                    formData.append(
                        `locations[${locationIndex}][id]`,
                        String(
                            location.id,
                        ),
                    );
                }

                formData.append(
                    `locations[${locationIndex}][district]`,
                    location.district,
                );

                formData.append(
                    `locations[${locationIndex}][city]`,
                    location.city.trim(),
                );

                formData.append(
                    `locations[${locationIndex}][venue]`,
                    location.venue.trim(),
                );

                formData.append(
                    `locations[${locationIndex}][map_url]`,
                    location.map_url.trim(),
                );

                formData.append(
                    `locations[${locationIndex}][capacity]`,
                    String(
                        location.capacity,
                    ),
                );

                formData.append(
                    `locations[${locationIndex}][whatsapp_group_url]`,
                    location.whatsapp_group_url.trim(),
                );

                location.trainer_ids.forEach(
                    (
                        trainerId,
                        trainerIndex,
                    ) => {
                        formData.append(
                            `locations[${locationIndex}][trainer_ids][${trainerIndex}]`,
                            String(
                                trainerId,
                            ),
                        );
                    },
                );
            },
        );

        try {
            if (isEditing) {
                formData.append(
                    '_method',
                    'PUT',
                );

                await api.post(
                    `/admin/workshops/${id}`,
                    formData,
                );
            } else {
                await api.post(
                    '/admin/workshops',
                    formData,
                );
            }

            navigate(
                '/admin/workshops',
                {
                    replace: true,
                },
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'Unable to save workshop.',
                ),
            );

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const displayedBanner =
        bannerPreview ||
        existingBanner;

    if (loading) {
        return <LoadingState />;
    }

    return (
        <section>
            <div className="flex items-center gap-4">
                <Link
                    to="/admin/workshops"
                    className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-[#071F42] transition hover:border-[#F5B400] hover:bg-amber-50"
                    aria-label="Back to workshops"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>

                <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                        Workshop Management
                    </p>

                    <h1 className="mt-1 text-3xl font-black text-[#071F42]">
                        {isEditing
                            ? 'Edit Workshop'
                            : 'Create Workshop'}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        One date and time,
                        multiple locations and
                        different trainers.
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]"
            >
                <div className="space-y-6">
                    <Panel>
                        <SectionHeading
                            icon={CalendarDays}
                            title="Basic Information"
                            description="Enter the workshop title and description."
                        />

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <Field
                                label="Workshop Title"
                                required
                                className="md:col-span-2"
                            >
                                <input
                                    required
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleGlobalChange
                                    }
                                    placeholder="Free Crypto Trading Workshop"
                                    className={
                                        inputClass
                                    }
                                />
                            </Field>

                            <Field
                                label="Description"
                                className="md:col-span-2"
                            >
                                <textarea
                                    name="description"
                                    rows="5"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleGlobalChange
                                    }
                                    placeholder="Enter workshop description..."
                                    className={`${inputClass} resize-y`}
                                />
                            </Field>
                        </div>
                    </Panel>

                    <Panel>
                        <SectionHeading
                            icon={Clock3}
                            title="Shared Date and Time"
                            description="These details apply to every workshop location."
                        />

                        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            <Field
                                label="Workshop Date"
                                required
                            >
                                <input
                                    required
                                    type="date"
                                    name="workshop_date"
                                    value={
                                        form.workshop_date
                                    }
                                    onChange={
                                        handleGlobalChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />
                            </Field>

                            <Field
                                label="Start Time"
                                required
                            >
                                <input
                                    required
                                    type="time"
                                    name="start_time"
                                    value={
                                        form.start_time
                                    }
                                    onChange={
                                        handleGlobalChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />
                            </Field>

                            <Field
                                label="End Time"
                                required
                            >
                                <input
                                    required
                                    type="time"
                                    name="end_time"
                                    value={
                                        form.end_time
                                    }
                                    onChange={
                                        handleGlobalChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />
                            </Field>

                            <Field label="Arrival Time">
                                <input
                                    type="time"
                                    name="arrival_time"
                                    value={
                                        form.arrival_time
                                    }
                                    onChange={
                                        handleGlobalChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />
                            </Field>

                            <Field
                                label="Registration Opens"
                                required
                            >
                                <input
                                    required
                                    type="datetime-local"
                                    name="registration_open_at"
                                    value={
                                        form.registration_open_at
                                    }
                                    onChange={
                                        handleGlobalChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />
                            </Field>

                            <Field
                                label="Registration Closes"
                                required
                            >
                                <input
                                    required
                                    type="datetime-local"
                                    name="registration_close_at"
                                    value={
                                        form.registration_close_at
                                    }
                                    onChange={
                                        handleGlobalChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />
                            </Field>

                            <Field
                                label="Workshop Status"
                                required
                            >
                                <select
                                    required
                                    name="status"
                                    value={
                                        form.status
                                    }
                                    onChange={
                                        handleGlobalChange
                                    }
                                    className={
                                        inputClass
                                    }
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
                            </Field>
                        </div>
                    </Panel>

                    <Panel>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <SectionHeading
                                icon={MapPin}
                                title="Workshop Locations"
                                description="Add locations and assign different trainers to each location."
                            />

                            <button
                                type="button"
                                onClick={
                                    addLocation
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-[#071F42] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0B2C5D]"
                            >
                                <Plus className="h-4 w-4" />

                                Add Location
                            </button>
                        </div>

                        <div className="mt-6 space-y-6">
                            {form.locations.map(
                                (
                                    location,
                                    locationIndex,
                                ) => (
                                    <LocationCard
                                        key={
                                            location.local_key
                                        }
                                        location={
                                            location
                                        }
                                        locationIndex={
                                            locationIndex
                                        }
                                        allLocations={
                                            form.locations
                                        }
                                        trainers={
                                            trainers
                                        }
                                        canRemove={
                                            form
                                                .locations
                                                .length >
                                            1
                                        }
                                        onUpdate={(
                                            field,
                                            value,
                                        ) =>
                                            updateLocation(
                                                location.local_key,
                                                field,
                                                value,
                                            )
                                        }
                                        onToggleTrainer={(
                                            trainerId,
                                        ) =>
                                            toggleLocationTrainer(
                                                location.local_key,
                                                trainerId,
                                            )
                                        }
                                        onRemove={() =>
                                            removeLocation(
                                                location.local_key,
                                            )
                                        }
                                    />
                                ),
                            )}
                        </div>
                    </Panel>

                    <Panel>
                        <SectionHeading
                            icon={CheckCircle2}
                            title="Additional Settings"
                            description="Configure the featured-workshop option."
                        />

                        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={
                                    form.is_featured
                                }
                                onChange={
                                    handleGlobalChange
                                }
                                className="mt-0.5 h-5 w-5 rounded border-slate-300"
                            />

                            <span>
                                <strong className="block text-sm text-[#071F42]">
                                    Featured
                                    Workshop
                                </strong>

                                <span className="mt-1 block text-xs leading-5 text-slate-500">
                                    Display this
                                    workshop as the
                                    featured workshop
                                    on the public
                                    website.
                                </span>
                            </span>
                        </label>
                    </Panel>
                </div>

                <aside>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-24">
                        <h2 className="font-black text-[#071F42]">
                            Workshop Banner
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            JPG, PNG or WEBP.
                            Maximum size 5MB.
                        </p>

                        <div className="mt-5">
                            {displayedBanner ? (
                                <div className="relative overflow-hidden rounded-xl bg-slate-100">
                                    <img
                                        src={
                                            displayedBanner
                                        }
                                        alt="Workshop banner preview"
                                        className="aspect-video w-full object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            clearBanner
                                        }
                                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                                        aria-label="Remove banner"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="grid aspect-video place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
                                    <div className="text-center">
                                        <ImageIcon className="mx-auto h-10 w-10" />

                                        <p className="mt-2 text-sm font-bold">
                                            No banner
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#071F42] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0B2C5D]">
                            <Upload className="h-5 w-5" />

                            Upload Banner

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                    handleBannerChange
                                }
                                className="hidden"
                            />
                        </label>

                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <SummaryRow
                                label="Locations"
                                value={
                                    form.locations
                                        .length
                                }
                            />

                            <SummaryRow
                                label="Total Capacity"
                                value={form.locations.reduce(
                                    (
                                        total,
                                        location,
                                    ) =>
                                        total +
                                        (Number(
                                            location.capacity,
                                        ) ||
                                            0),
                                    0,
                                )}
                            />

                            <SummaryRow
                                label="Assigned Trainers"
                                value={
                                    new Set(
                                        form.locations.flatMap(
                                            (
                                                location,
                                            ) =>
                                                location.trainer_ids.map(
                                                    Number,
                                                ),
                                        ),
                                    ).size
                                }
                            />
                        </div>

                        <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                            <button
                                type="submit"
                                disabled={
                                    submitting
                                }
                                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F5B400] px-6 py-3 text-sm font-black text-[#071F42] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save className="h-5 w-5" />

                                {submitting
                                    ? 'Saving...'
                                    : 'Save Workshop'}
                            </button>

                            <Link
                                to="/admin/workshops"
                                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </aside>
            </form>
        </section>
    );
}

function LocationCard({
    location,
    locationIndex,
    allLocations,
    trainers,
    canRemove,
    onUpdate,
    onToggleTrainer,
    onRemove,
}) {
    const locationLabel =
        location.city ||
        `Location ${locationIndex + 1}`;

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-700">
                        <MapPin className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-xs font-black uppercase tracking-wider text-amber-600">
                            Location{' '}
                            {locationIndex + 1}
                        </p>

                        <h3 className="font-black text-[#071F42]">
                            {locationLabel}
                        </h3>
                    </div>
                </div>

                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="grid h-10 w-10 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        aria-label={`Remove ${locationLabel}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="p-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <Field
                        label="District"
                        required
                    >
                        <select
                            required
                            value={
                                location.district
                            }
                            onChange={(
                                event,
                            ) =>
                                onUpdate(
                                    'district',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClass
                            }
                        >
                            <option value="">
                                Select district
                            </option>

                            {SRI_LANKA_DISTRICTS.map(
                                (district) => (
                                    <option
                                        key={
                                            district
                                        }
                                        value={
                                            district
                                        }
                                    >
                                        {
                                            district
                                        }
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>

                    <Field
                        label="City"
                        required
                    >
                        <input
                            required
                            value={
                                location.city
                            }
                            onChange={(
                                event,
                            ) =>
                                onUpdate(
                                    'city',
                                    event.target
                                        .value,
                                )
                            }
                            placeholder="Galle"
                            className={
                                inputClass
                            }
                        />
                    </Field>

                    <Field
                        label="Venue"
                        required
                    >
                        <input
                            required
                            value={
                                location.venue
                            }
                            onChange={(
                                event,
                            ) =>
                                onUpdate(
                                    'venue',
                                    event.target
                                        .value,
                                )
                            }
                            placeholder="Galle Town Hall"
                            className={
                                inputClass
                            }
                        />
                    </Field>

                    <Field label="Google Maps URL">
                        <input
                            type="url"
                            value={
                                location.map_url
                            }
                            onChange={(
                                event,
                            ) =>
                                onUpdate(
                                    'map_url',
                                    event.target
                                        .value,
                                )
                            }
                            placeholder="https://maps.google.com/..."
                            className={
                                inputClass
                            }
                        />
                    </Field>

                    <Field
                        label="Student Capacity"
                        required
                    >
                        <input
                            required
                            type="number"
                            min="1"
                            max="10000"
                            value={
                                location.capacity
                            }
                            onChange={(
                                event,
                            ) =>
                                onUpdate(
                                    'capacity',
                                    event.target
                                        .value,
                                )
                            }
                            className={
                                inputClass
                            }
                        />
                    </Field>

                    <Field label="WhatsApp Group URL">
                        <input
                            type="url"
                            value={
                                location.whatsapp_group_url
                            }
                            onChange={(
                                event,
                            ) =>
                                onUpdate(
                                    'whatsapp_group_url',
                                    event.target
                                        .value,
                                )
                            }
                            placeholder="https://chat.whatsapp.com/..."
                            className={
                                inputClass
                            }
                        />
                    </Field>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#071F42]" />

                        <h4 className="font-black text-[#071F42]">
                            Trainers for{' '}
                            {locationLabel}
                        </h4>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        A trainer already used
                        by another location is
                        disabled because all
                        locations run at the
                        same time.
                    </p>

                    {trainers.length ===
                    0 ? (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
                            No active trainers
                            found.
                        </div>
                    ) : (
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {trainers.map(
                                (trainer) => {
                                    const selected =
                                        location.trainer_ids.some(
                                            (
                                                idValue,
                                            ) =>
                                                Number(
                                                    idValue,
                                                ) ===
                                                Number(
                                                    trainer.id,
                                                ),
                                        );

                                    const assignedLocation =
                                        findTrainerLocation(
                                            allLocations,
                                            trainer.id,
                                            location.local_key,
                                        );

                                    const disabled =
                                        Boolean(
                                            assignedLocation,
                                        ) &&
                                        !selected;

                                    return (
                                        <label
                                            key={
                                                trainer.id
                                            }
                                            className={`flex items-center gap-3 rounded-xl border p-4 transition ${
                                                selected
                                                    ? 'cursor-pointer border-amber-400 bg-amber-50'
                                                    : disabled
                                                      ? 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-60'
                                                      : 'cursor-pointer border-slate-200 bg-white hover:border-amber-300'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selected
                                                }
                                                disabled={
                                                    disabled
                                                }
                                                onChange={() =>
                                                    onToggleTrainer(
                                                        trainer.id,
                                                    )
                                                }
                                                className="h-5 w-5 rounded border-slate-300"
                                            />

                                            <TrainerAvatar
                                                trainer={
                                                    trainer
                                                }
                                            />

                                            <div className="min-w-0">
                                                <p className="truncate font-black text-[#071F42]">
                                                    {
                                                        trainer.name
                                                    }
                                                </p>

                                                <p className="truncate text-xs text-slate-500">
                                                    {
                                                        trainer.role
                                                    }
                                                </p>

                                                {assignedLocation && (
                                                    <p className="mt-1 text-xs font-bold text-red-600">
                                                        Assigned
                                                        to{' '}
                                                        {
                                                            assignedLocation
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </label>
                                    );
                                },
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

function TrainerAvatar({
    trainer,
}) {
    const imageUrl =
        trainer.photo_url ||
        getStorageUrl(
            trainer.photo_path,
        );

    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt={trainer.name}
                className="h-11 w-11 shrink-0 rounded-xl object-cover"
            />
        );
    }

    return (
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-200 text-slate-500">
            <UserRound className="h-5 w-5" />
        </div>
    );
}

function Panel({
    children,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {children}
        </div>
    );
}

function SectionHeading({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#071F42]">
                <Icon className="h-5 w-5" />
            </div>

            <div>
                <h2 className="text-lg font-black text-[#071F42]">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    );
}

function Field({
    label,
    required = false,
    className = '',
    children,
}) {
    return (
        <label
            className={`block ${className}`}
        >
            <span className="text-sm font-bold text-slate-700">
                {label}

                {required && (
                    <span className="text-red-500">
                        {' '}
                        *
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}

function SummaryRow({
    label,
    value,
}) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
            <span className="text-sm font-semibold text-slate-500">
                {label}
            </span>

            <span className="font-black text-[#071F42]">
                {value}
            </span>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#F5B400]" />

            <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading workshop...
            </p>
        </div>
    );
}

function createLocationsFromWorkshop(
    workshop,
) {
    if (
        !Array.isArray(
            workshop.locations,
        ) ||
        workshop.locations.length === 0
    ) {
        return [
            createEmptyLocation(),
        ];
    }

    return workshop.locations.map(
        (location) => ({
            local_key:
                `location-${location.id}-${createLocalKey()}`,

            id:
                location.id || null,

            district:
                location.district || '',

            city:
                location.city || '',

            venue:
                location.venue || '',

            map_url:
                location.map_url || '',

            capacity:
                String(
                    location.capacity ??
                        100,
                ),

            whatsapp_group_url:
                location.whatsapp_group_url ||
                '',

            trainer_ids:
                Array.isArray(
                    location.trainer_ids,
                )
                    ? location.trainer_ids.map(
                          Number,
                      )
                    : (
                          location.trainers ||
                          []
                      ).map((trainer) =>
                          Number(
                              trainer.id,
                          ),
                      ),
        }),
    );
}

function findTrainerLocation(
    locations,
    trainerId,
    currentLocationKey,
) {
    const found =
        locations.find(
            (location) =>
                location.local_key !==
                    currentLocationKey &&
                location.trainer_ids.some(
                    (idValue) =>
                        Number(
                            idValue,
                        ) ===
                        Number(
                            trainerId,
                        ),
                ),
        );

    if (!found) {
        return null;
    }

    return (
        found.city ||
        found.venue ||
        'another location'
    );
}

function normalizeTime(value) {
    if (!value) {
        return '';
    }

    return String(value).slice(
        0,
        5,
    );
}

function formatDateInput(value) {
    if (!value) {
        return '';
    }

    return String(value).slice(
        0,
        10,
    );
}

function formatDateTimeInput(value) {
    if (!value) {
        return '';
    }

    return String(value)
        .replace(' ', 'T')
        .slice(0, 16);
}

function getStorageUrl(path) {
    if (!path) {
        return '';
    }

    const stringPath =
        String(path);

    if (
        stringPath.startsWith(
            'http://',
        ) ||
        stringPath.startsWith(
            'https://',
        )
    ) {
        return stringPath;
    }

    const cleanPath =
        stringPath
            .replace(/^\/+/, '')
            .replace(
                /^storage\//,
                '',
            );

    return `/storage/${cleanPath}`;
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

const SRI_LANKA_DISTRICTS = [
    'Ampara',
    'Anuradhapura',
    'Badulla',
    'Batticaloa',
    'Colombo',
    'Galle',
    'Gampaha',
    'Hambantota',
    'Jaffna',
    'Kalutara',
    'Kandy',
    'Kegalle',
    'Kilinochchi',
    'Kurunegala',
    'Mannar',
    'Matale',
    'Matara',
    'Monaragala',
    'Mullaitivu',
    'Nuwara Eliya',
    'Polonnaruwa',
    'Puttalam',
    'Ratnapura',
    'Trincomalee',
    'Vavuniya',
];
