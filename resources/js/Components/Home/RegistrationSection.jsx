import {
    ArrowLeft,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
    MapPin,
    UserRound,
    Users,
} from 'lucide-react';

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import api from '../../services/api';

const districts = [
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

const leadSources = [
    'TikTok',
    'Facebook',
    'Instagram',
    'YouTube',
    'WhatsApp',
    'Friend',
    'Other',
];

const initialForm = {
    full_name: '',
    mobile_number: '',
    whatsapp_number: '',
    email: '',
    district: '',
    age: '',
    occupation: '',
    trading_experience: 'false',
    binance_account: 'false',
    lead_source: '',
    consent: false,
};

export default function RegistrationSection({
    workshop,
    workshops = [],
    onRegistered,
}) {
    const [form, setForm] =
        useState(initialForm);

    const [
        activeWorkshopId,
        setActiveWorkshopId,
    ] = useState(null);

    const [
        selectedLocationId,
        setSelectedLocationId,
    ] = useState(null);

    const [
        formVisible,
        setFormVisible,
    ] = useState(false);

    const [success, setSuccess] =
        useState(null);

    const [error, setError] =
        useState('');

    const [submitting, setSubmitting] =
        useState(false);

    const carouselRef = useRef(null);

    const [
        activeSlide,
        setActiveSlide,
    ] = useState(0);

    /*
     * Supported parent payloads:
     *
     * 1. <RegistrationSection workshop={response.data.data} />
     *    where data.workshops contains multiple workshops.
     *
     * 2. <RegistrationSection workshops={array} />
     *
     * 3. Existing single workshop payload.
     */
    const workshopList = useMemo(
        () =>
            normalizeWorkshops(
                workshops,
                workshop,
            ),
        [
            workshops,
            workshop,
        ],
    );

    const activeWorkshop =
        useMemo(() => {
            if (
                workshopList.length ===
                0
            ) {
                return null;
            }

            return (
                workshopList.find(
                    (item) =>
                        Number(
                            item.id,
                        ) ===
                        Number(
                            activeWorkshopId,
                        ),
                ) ||
                workshopList[0]
            );
        }, [
            activeWorkshopId,
            workshopList,
        ]);

    const locations =
        activeWorkshop?.locations ||
        [];

    const selectedLocation =
        useMemo(() => {
            return (
                locations.find(
                    (location) =>
                        Number(
                            location.id,
                        ) ===
                        Number(
                            selectedLocationId,
                        ),
                ) || null
            );
        }, [
            locations,
            selectedLocationId,
        ]);

    const canRegister =
        getWorkshopCanRegister(
            activeWorkshop,
        );

    useEffect(() => {
        if (
            workshopList.length ===
            0
        ) {
            setActiveWorkshopId(
                null,
            );

            return;
        }

        const currentExists =
            workshopList.some(
                (item) =>
                    Number(
                        item.id,
                    ) ===
                    Number(
                        activeWorkshopId,
                    ),
            );

        if (!currentExists) {
            setActiveWorkshopId(
                workshopList[0].id,
            );
        }
    }, [
        activeWorkshopId,
        workshopList,
    ]);

    useEffect(() => {
        setSelectedLocationId(
            null,
        );

        setFormVisible(false);
        setSuccess(null);
        setError('');
        setActiveSlide(0);

        if (
            carouselRef.current
        ) {
            carouselRef.current
                .scrollLeft = 0;
        }
    }, [activeWorkshop?.id]);

    const selectWorkshop = (
        workshopId,
    ) => {
        setActiveWorkshopId(
            workshopId,
        );

        setSelectedLocationId(
            null,
        );

        setFormVisible(false);
        setSuccess(null);
        setError('');
        setActiveSlide(0);

        window.setTimeout(() => {
            carouselRef.current?.scrollTo(
                {
                    left: 0,
                    behavior: 'smooth',
                },
            );
        }, 20);
    };

    const handleChange = (
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

    const openRegistrationForm = (
        location,
    ) => {
        setSelectedLocationId(
            location.id,
        );

        setFormVisible(true);
        setSuccess(null);
        setError('');

        window.setTimeout(() => {
            document
                .getElementById(
                    'registration-form',
                )
                ?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
        }, 50);
    };

    const closeRegistrationForm = () => {
        setFormVisible(false);
        setError('');

        window.setTimeout(() => {
            document
                .getElementById(
                    'workshop-location-cards',
                )
                ?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
        }, 50);
    };

    const scrollToLocation = (
        index,
    ) => {
        const container =
            carouselRef.current;

        if (!container) {
            return;
        }

        const cards =
            container.querySelectorAll(
                '[data-location-card]',
            );

        const targetCard =
            cards[index];

        if (!targetCard) {
            return;
        }

        const targetLeft =
            targetCard.offsetLeft -
            (container.clientWidth -
                targetCard.clientWidth) /
                2;

        container.scrollTo({
            left: Math.max(
                0,
                targetLeft,
            ),

            behavior: 'smooth',
        });

        setActiveSlide(index);
    };

    const moveCarousel = (
        direction,
    ) => {
        if (
            locations.length === 0
        ) {
            return;
        }

        const nextIndex =
            Math.max(
                0,
                Math.min(
                    locations.length -
                        1,

                    activeSlide +
                        direction,
                ),
            );

        scrollToLocation(
            nextIndex,
        );
    };

    const handleCarouselScroll = () => {
        const container =
            carouselRef.current;

        if (!container) {
            return;
        }

        const cards =
            container.querySelectorAll(
                '[data-location-card]',
            );

        if (!cards.length) {
            return;
        }

        const containerCenter =
            container.scrollLeft +
            container.clientWidth / 2;

        let closestIndex = 0;
        let closestDistance =
            Number.POSITIVE_INFINITY;

        cards.forEach(
            (
                card,
                index,
            ) => {
                const cardCenter =
                    card.offsetLeft +
                    card.clientWidth / 2;

                const distance =
                    Math.abs(
                        containerCenter -
                            cardCenter,
                    );

                if (
                    distance <
                    closestDistance
                ) {
                    closestDistance =
                        distance;

                    closestIndex =
                        index;
                }
            },
        );

        setActiveSlide(
            closestIndex,
        );
    };

    const handleSubmit = async (
        event,
    ) => {
        event.preventDefault();

        if (!activeWorkshop?.id) {
            setError(
                'No active workshop is available for registration.',
            );

            return;
        }

        if (!selectedLocation?.id) {
            setError(
                'Please select a workshop location.',
            );

            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess(null);

        const urlParameters =
            new URLSearchParams(
                window.location.search,
            );

        const payload = {
            workshop_id:
                activeWorkshop.id,

            workshop_location_id:
                selectedLocation.id,

            full_name:
                form.full_name.trim(),

            mobile_number:
                form.mobile_number.trim(),

            whatsapp_number:
                form.whatsapp_number.trim() ||
                null,

            email:
                form.email.trim() ||
                null,

            district:
                form.district,

            age:
                Number(form.age),

            occupation:
                form.occupation.trim() ||
                null,

            trading_experience:
                form.trading_experience ===
                'true',

            binance_account:
                form.binance_account ===
                'true',

            lead_source:
                form.lead_source,

            consent:
                form.consent,

            utm_source:
                urlParameters.get(
                    'utm_source',
                ),

            utm_medium:
                urlParameters.get(
                    'utm_medium',
                ),

            utm_campaign:
                urlParameters.get(
                    'utm_campaign',
                ),
        };

        try {
            const response =
                await api.post(
                    '/registrations',
                    payload,
                );

            setSuccess(
                response.data.data,
            );

            setForm(
                initialForm,
            );

            if (onRegistered) {
                await onRegistered();
            }
        } catch (requestError) {
            const validationErrors =
                requestError.response
                    ?.data?.errors;

            if (validationErrors) {
                setError(
                    Object.values(
                        validationErrors,
                    )
                        .flat()
                        .join(' '),
                );
            } else {
                setError(
                    requestError.response
                        ?.data?.message ||
                        'Registration could not be completed.',
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (
        workshopList.length ===
        0
    ) {
        return (
            <section
                id="register"
                className="scroll-mt-28 bg-white px-4 py-12 sm:px-6 lg:px-8"
            >
                <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
                    <h2 className="text-2xl font-black text-[#071F42]">
                        Registration
                        Unavailable
                    </h2>

                    <p className="mt-3 text-slate-600">
                        No workshop is
                        currently available.
                    </p>
                </div>
            </section>
        );
    }

    if (success) {
        return (
            <RegistrationSuccess
                success={success}
                onBack={() => {
                    setSuccess(null);
                    setFormVisible(false);
                    setSelectedLocationId(
                        null,
                    );
                }}
            />
        );
    }

    return (
        <section
            id="register"
            className="scroll-mt-28 bg-slate-50 px-4 py-14 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
                        Select Your Workshop
                    </p>

                    <h2 className="mt-3 text-3xl font-black text-[#071F42] sm:text-4xl">
                        Choose a Workshop
                        and Location
                    </h2>

                    <p className="mt-4 text-slate-600">
                        Select a workshop
                        title tab, then browse
                        its relevant locations
                        in the carousel.
                    </p>
                </div>

                <div className="mt-8 -mx-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="mx-auto flex w-max min-w-full items-stretch justify-start gap-3 sm:justify-center">
                        {workshopList.map(
                            (
                                item,
                                index,
                            ) => {
                                const selected =
                                    Number(
                                        activeWorkshop
                                            ?.id,
                                    ) ===
                                    Number(
                                        item.id,
                                    );

                                return (
                                    <button
                                        key={
                                            item.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            selectWorkshop(
                                                item.id,
                                            )
                                        }
                                        className={`min-w-[230px] shrink-0 rounded-2xl border px-5 py-4 text-left transition sm:min-w-[270px] ${
                                            selected
                                                ? 'border-[#071F42] bg-[#071F42] text-white shadow-xl'
                                                : 'border-slate-200 bg-white text-[#071F42] shadow-sm hover:border-amber-400 hover:bg-amber-50'
                                        }`}
                                        aria-pressed={
                                            selected
                                        }
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p
                                                    className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                                                        selected
                                                            ? 'text-amber-300'
                                                            : 'text-amber-600'
                                                    }`}
                                                >
                                                    Workshop{' '}
                                                    {index +
                                                        1}
                                                </p>

                                                <p className="mt-2 line-clamp-2 text-sm font-black sm:text-base">
                                                    {
                                                        item.title
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className={`grid h-8 min-w-8 place-items-center rounded-full px-2 text-xs font-black ${
                                                    selected
                                                        ? 'bg-amber-400 text-[#071F42]'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {
                                                    item.locations
                                                        .length
                                                }
                                            </span>
                                        </div>

                                        <div
                                            className={`mt-3 flex items-center gap-2 text-xs font-bold ${
                                                selected
                                                    ? 'text-slate-300'
                                                    : 'text-slate-500'
                                            }`}
                                        >
                                            <CalendarDays className="h-3.5 w-3.5" />

                                            <span>
                                                {getWorkshopDate(
                                                    item,
                                                )}
                                            </span>
                                        </div>
                                    </button>
                                );
                            },
                        )}
                    </div>
                </div>

                {activeWorkshop && (
                    <div className="mx-auto mt-7 max-w-4xl text-center">
                        <h3 className="text-2xl font-black text-[#071F42] sm:text-3xl">
                            {
                                activeWorkshop.title
                            }
                        </h3>

                        <div className="mt-5 flex flex-wrap justify-center gap-3">
                            <InfoPill
                                icon={
                                    CalendarDays
                                }
                            >
                                {getWorkshopDate(
                                    activeWorkshop,
                                )}
                            </InfoPill>

                            <InfoPill
                                icon={Clock3}
                            >
                                {getWorkshopStartTime(
                                    activeWorkshop,
                                )}
                                {' - '}
                                {getWorkshopEndTime(
                                    activeWorkshop,
                                )}
                            </InfoPill>

                            <InfoPill
                                icon={MapPin}
                            >
                                {
                                    locations.length
                                }{' '}
                                {locations.length ===
                                1
                                    ? 'Location'
                                    : 'Locations'}
                            </InfoPill>
                        </div>
                    </div>
                )}

                <div
                    id="workshop-location-cards"
                    className="relative mt-9 scroll-mt-28"
                >
                    {locations.length ===
                    0 ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-slate-700">
                            This workshop does
                            not have any
                            locations yet.
                        </div>
                    ) : (
                        <>
                            <div className="relative overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() =>
                                        moveCarousel(
                                            -1,
                                        )
                                    }
                                    disabled={
                                        activeSlide ===
                                        0
                                    }
                                    className="absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#071F42] shadow-lg transition hover:bg-[#071F42] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 md:flex"
                                    aria-label="Previous location"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>

                                <div
                                    ref={
                                        carouselRef
                                    }
                                    onScroll={
                                        handleCarouselScroll
                                    }
                                    className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[8vw] py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-[18vw] md:px-20 lg:px-24"
                                >
                                    {locations.map(
                                        (
                                            location,
                                            index,
                                        ) => (
                                            <div
                                                key={`${activeWorkshop.id}-${location.id}`}
                                                data-location-card
                                                className="w-[84vw] min-w-[84vw] snap-center sm:w-[360px] sm:min-w-[360px] lg:w-[380px] lg:min-w-[380px]"
                                            >
                                                <LocationSelectionCard
                                                    location={
                                                        location
                                                    }
                                                    index={
                                                        index
                                                    }
                                                    workshop={
                                                        activeWorkshop
                                                    }
                                                    canRegister={
                                                        canRegister
                                                    }
                                                    onRegister={() =>
                                                        openRegistrationForm(
                                                            location,
                                                        )
                                                    }
                                                />
                                            </div>
                                        ),
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        moveCarousel(
                                            1,
                                        )
                                    }
                                    disabled={
                                        activeSlide >=
                                        locations.length -
                                            1
                                    }
                                    className="absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#071F42] shadow-lg transition hover:bg-[#071F42] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 md:flex"
                                    aria-label="Next location"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="mt-3 flex items-center justify-center gap-2">
                                {locations.map(
                                    (
                                        location,
                                        index,
                                    ) => (
                                        <button
                                            key={`${activeWorkshop.id}-dot-${location.id}`}
                                            type="button"
                                            onClick={() =>
                                                scrollToLocation(
                                                    index,
                                                )
                                            }
                                            className={`h-2.5 rounded-full transition-all ${
                                                activeSlide ===
                                                index
                                                    ? 'w-8 bg-[#071F42]'
                                                    : 'w-2.5 bg-slate-300 hover:bg-amber-400'
                                            }`}
                                            aria-label={`View location ${index + 1}`}
                                        />
                                    ),
                                )}
                            </div>

                            <p className="mt-3 text-center text-xs font-semibold text-slate-500 md:hidden">
                                Swipe left or
                                right to view
                                more locations.
                            </p>
                        </>
                    )}
                </div>

                {formVisible &&
                    selectedLocation &&
                    activeWorkshop && (
                        <div
                            id="registration-form"
                            className="mt-10 scroll-mt-28 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
                        >
                            <div className="grid lg:grid-cols-[320px_1fr]">
                                <div className="bg-[#071F42] p-7 text-white sm:p-8">
                                    <button
                                        type="button"
                                        onClick={
                                            closeRegistrationForm
                                        }
                                        className="inline-flex items-center gap-2 text-sm font-black text-amber-300 transition hover:text-white"
                                    >
                                        <ArrowLeft className="h-4 w-4" />

                                        Change
                                        Location
                                    </button>

                                    <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                                        Selected
                                        Workshop
                                    </p>

                                    <h3 className="mt-3 text-xl font-black">
                                        {
                                            activeWorkshop.title
                                        }
                                    </h3>

                                    <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                                        Selected
                                        Location
                                    </p>

                                    <h4 className="mt-3 text-2xl font-black">
                                        {
                                            selectedLocation.city
                                        }
                                    </h4>

                                    <p className="mt-2 leading-6 text-slate-300">
                                        {
                                            selectedLocation.venue
                                        }
                                        ,{' '}
                                        {
                                            selectedLocation.district
                                        }
                                    </p>

                                    <div className="mt-7 space-y-3">
                                        <DarkInfoRow
                                            label="Date"
                                            value={getWorkshopDate(
                                                activeWorkshop,
                                            )}
                                        />

                                        <DarkInfoRow
                                            label="Time"
                                            value={`${getWorkshopStartTime(
                                                activeWorkshop,
                                            )} - ${getWorkshopEndTime(
                                                activeWorkshop,
                                            )}`}
                                        />

                                        <DarkInfoRow
                                            label="Capacity"
                                            value={
                                                selectedLocation.capacity
                                            }
                                        />

                                        <DarkInfoRow
                                            label="Available"
                                            value={
                                                selectedLocation.availableSeats
                                            }
                                        />
                                    </div>

                                    <div className="mt-8 border-t border-white/15 pt-6">
                                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                            Trainers
                                        </p>

                                        <div className="mt-4 space-y-3">
                                            {selectedLocation
                                                .trainers
                                                .length >
                                            0 ? (
                                                selectedLocation.trainers.map(
                                                    (
                                                        trainer,
                                                    ) => (
                                                        <TrainerMiniCard
                                                            key={
                                                                trainer.id
                                                            }
                                                            trainer={
                                                                trainer
                                                            }
                                                            dark
                                                        />
                                                    ),
                                                )
                                            ) : (
                                                <p className="text-sm text-slate-400">
                                                    Trainers
                                                    will be
                                                    announced
                                                    soon.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                    className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 lg:p-8"
                                >
                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <p className="text-sm font-black uppercase tracking-[0.15em] text-amber-600">
                                            Registration
                                            Form
                                        </p>

                                        <h3 className="mt-2 text-2xl font-black text-[#071F42]">
                                            Reserve Your
                                            Seat
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Register for{' '}
                                            <strong>
                                                {
                                                    activeWorkshop.title
                                                }
                                            </strong>{' '}
                                            at{' '}
                                            <strong>
                                                {
                                                    selectedLocation.city
                                                }
                                            </strong>
                                            .
                                        </p>
                                    </div>

                                    <FormInput
                                        label="Full Name"
                                        name="full_name"
                                        value={
                                            form.full_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        required
                                    />

                                    <FormInput
                                        label="Mobile Number"
                                        name="mobile_number"
                                        type="tel"
                                        inputMode="tel"
                                        value={
                                            form.mobile_number
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="0771234567"
                                        autoComplete="tel"
                                        required
                                    />

                                    <FormInput
                                        label="WhatsApp Number"
                                        name="whatsapp_number"
                                        type="tel"
                                        inputMode="tel"
                                        value={
                                            form.whatsapp_number
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Optional"
                                    />

                                    <FormInput
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={
                                            form.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                    />

                                    <FormSelect
                                        label="Your District"
                                        name="district"
                                        value={
                                            form.district
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select
                                            District
                                        </option>

                                        {districts.map(
                                            (
                                                district,
                                            ) => (
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
                                    </FormSelect>

                                    <FormInput
                                        label="Age"
                                        name="age"
                                        type="number"
                                        min="13"
                                        max="100"
                                        inputMode="numeric"
                                        value={
                                            form.age
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter age"
                                        required
                                    />

                                    <FormInput
                                        label="Occupation"
                                        name="occupation"
                                        value={
                                            form.occupation
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter occupation"
                                    />

                                    <FormSelect
                                        label="Trading Experience"
                                        name="trading_experience"
                                        value={
                                            form.trading_experience
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >
                                        <option value="false">
                                            No
                                        </option>

                                        <option value="true">
                                            Yes
                                        </option>
                                    </FormSelect>

                                    <FormSelect
                                        label="Binance Account"
                                        name="binance_account"
                                        value={
                                            form.binance_account
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >
                                        <option value="false">
                                            No
                                        </option>

                                        <option value="true">
                                            Yes
                                        </option>
                                    </FormSelect>

                                    <FormSelect
                                        label="How did you hear about us?"
                                        name="lead_source"
                                        value={
                                            form.lead_source
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Lead
                                            Source
                                        </option>

                                        {leadSources.map(
                                            (
                                                source,
                                            ) => (
                                                <option
                                                    key={
                                                        source
                                                    }
                                                    value={
                                                        source
                                                    }
                                                >
                                                    {
                                                        source
                                                    }
                                                </option>
                                            ),
                                        )}
                                    </FormSelect>

                                    <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600 sm:col-span-2">
                                        <input
                                            required
                                            type="checkbox"
                                            name="consent"
                                            checked={
                                                form.consent
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="mt-1 h-4 w-4"
                                        />

                                        I agree to
                                        receive workshop
                                        confirmations and
                                        educational
                                        updates.
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={
                                            submitting ||
                                            !canRegister
                                        }
                                        className="min-h-12 rounded-xl bg-[#F5B400] px-5 py-3 text-sm font-black uppercase text-[#071F42] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {submitting
                                            ? 'Submitting...'
                                            : selectedLocation.availableSeats >
                                                0
                                              ? 'Reserve My Seat →'
                                              : 'Join Waitlist →'}
                                    </button>

                                    {error && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 sm:col-span-2 lg:col-span-3">
                                            {
                                                error
                                            }
                                        </div>
                                    )}
                                </form>
                            </div>

                            <RiskDisclaimer />
                        </div>
                    )}
            </div>
        </section>
    );
}

function LocationSelectionCard({
    location,
    index,
    workshop,
    canRegister,
    onRegister,
}) {
    const capacity =
        Number(
            location.capacity,
        ) || 0;

    const available =
        Number(
            location.availableSeats,
        ) || 0;

    const occupied =
        Math.max(
            0,
            capacity - available,
        );

    const percentage =
        capacity > 0
            ? Math.min(
                  100,
                  Math.round(
                      (occupied /
                          capacity) *
                          100,
                  ),
              )
            : 0;

    return (
        <article className="flex h-full min-h-[590px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="relative bg-gradient-to-br from-[#071F42] to-[#0B2C5D] p-6 pb-12 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                    Location{' '}
                    {index + 1}
                </p>

                <h3 className="mt-3 text-2xl font-black">
                    {location.city}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                    {location.venue},{' '}
                    {
                        location.district
                    }
                </p>

                <div className="absolute -bottom-10 right-6 grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-[#F5B400] text-center text-[#071F42] shadow-lg">
                    <div>
                        <p className="text-xl font-black leading-none">
                            {
                                available
                            }
                        </p>

                        <p className="mt-1 text-[9px] font-black uppercase">
                            Seats Left
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-6 pt-14">
                <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-amber-600" />

                        <span className="font-bold">
                            {getWorkshopDate(
                                workshop,
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-amber-600" />

                        <span className="font-bold">
                            {getWorkshopStartTime(
                                workshop,
                            )}

                            {' - '}

                            {getWorkshopEndTime(
                                workshop,
                            )}
                        </span>
                    </div>

                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                        <span className="font-bold">
                            {
                                location.venue
                            }
                        </span>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <StatBox
                        label="Capacity"
                        value={
                            capacity
                        }
                    />

                    <StatBox
                        label="Available"
                        value={
                            available
                        }
                        highlight
                    />
                </div>

                <div className="mt-5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>
                            Seats Filled
                        </span>

                        <span>
                            {occupied} /{' '}
                            {capacity}
                        </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-amber-400 transition-all"
                            style={{
                                width: `${percentage}%`,
                            }}
                        />
                    </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-amber-600" />

                        <p className="text-sm font-black text-[#071F42]">
                            Trainers
                        </p>
                    </div>

                    <div className="mt-3 space-y-3">
                        {location.trainers
                            .length >
                        0 ? (
                            location.trainers.map(
                                (
                                    trainer,
                                ) => (
                                    <TrainerMiniCard
                                        key={
                                            trainer.id
                                        }
                                        trainer={
                                            trainer
                                        }
                                    />
                                ),
                            )
                        ) : (
                            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                                Trainers will
                                be announced
                                soon.
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={
                        onRegister
                    }
                    disabled={
                        !canRegister ||
                        !location.id
                    }
                    className="mt-auto inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#F5B400] px-5 py-3 text-sm font-black uppercase text-[#071F42] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {!canRegister
                        ? 'Registration Closed'
                        : available >
                            0
                          ? 'Register Now'
                          : 'Join Waitlist'}
                </button>
            </div>
        </article>
    );
}

function TrainerMiniCard({
    trainer,
    dark = false,
}) {
    const photoUrl =
        trainer.photo_url ||
        trainer.photoUrl ||
        getStorageUrl(
            trainer.photo_path,
        );

    return (
        <div className="flex items-center gap-3">
            {photoUrl ? (
                <img
                    src={photoUrl}
                    alt={trainer.name}
                    className="h-11 w-11 shrink-0 rounded-xl object-cover"
                />
            ) : (
                <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                        dark
                            ? 'bg-white/10 text-slate-300'
                            : 'bg-slate-100 text-slate-400'
                    }`}
                >
                    <UserRound className="h-5 w-5" />
                </div>
            )}

            <div className="min-w-0">
                <p
                    className={`truncate text-sm font-black ${
                        dark
                            ? 'text-white'
                            : 'text-[#071F42]'
                    }`}
                >
                    {trainer.name}
                </p>

                <p
                    className={`truncate text-xs ${
                        dark
                            ? 'text-slate-400'
                            : 'text-slate-500'
                    }`}
                >
                    {trainer.role ||
                        'Workshop Trainer'}
                </p>
            </div>
        </div>
    );
}

function RegistrationSuccess({
    success,
    onBack,
}) {
    return (
        <section
            id="register"
            className="scroll-mt-28 bg-white px-4 py-12 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-10">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-3xl text-white">
                    ✓
                </div>

                <h2 className="mt-5 text-3xl font-black text-[#071F42]">
                    {success.status ===
                    'confirmed'
                        ? 'Seat Reserved'
                        : 'Added to Waitlist'}
                </h2>

                <p className="mt-3 text-slate-600">
                    Your registration was
                    submitted successfully.
                </p>

                <div className="mt-6 rounded-xl border border-emerald-200 bg-white p-5">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                        Registration Reference
                    </p>

                    <p className="mt-2 text-2xl font-black text-[#071F42]">
                        {
                            success.referenceNumber
                        }
                    </p>
                </div>

                <div className="mt-6 space-y-2 text-sm text-slate-700">
                    <p>
                        <strong>
                            Workshop:
                        </strong>{' '}
                        {
                            success.workshopTitle
                        }
                    </p>

                    <p>
                        <strong>Date:</strong>{' '}
                        {
                            success.workshopDate
                        }
                    </p>

                    <p>
                        <strong>
                            Location:
                        </strong>{' '}
                        {success.locationCity}
                    </p>

                    <p>
                        <strong>Venue:</strong>{' '}
                        {success.venue}
                    </p>

                    {success.trainerNames && (
                        <p>
                            <strong>
                                Trainers:
                            </strong>{' '}
                            {
                                success.trainerNames
                            }
                        </p>
                    )}
                </div>

                {success.whatsappGroupUrl &&
                    success.status ===
                        'confirmed' && (
                        <a
                            href={
                                success.whatsappGroupUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 inline-flex rounded-lg bg-emerald-600 px-6 py-3 font-black text-white transition hover:bg-emerald-700"
                        >
                            Join WhatsApp Group
                        </a>
                    )}

                <button
                    type="button"
                    onClick={onBack}
                    className="mt-6 block w-full font-bold text-[#062C73]"
                >
                    Back to Workshops
                </button>
            </div>
        </section>
    );
}

function InfoPill({
    icon: Icon,
    children,
}) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
            <Icon className="h-4 w-4 text-amber-600" />

            {children}
        </span>
    );
}

function StatBox({
    label,
    value,
    highlight = false,
}) {
    return (
        <div
            className={`rounded-xl p-4 ${
                highlight
                    ? 'bg-emerald-50'
                    : 'bg-slate-50'
            }`}
        >
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {label}
            </p>

            <p
                className={`mt-1 text-2xl font-black ${
                    highlight
                        ? 'text-emerald-700'
                        : 'text-[#071F42]'
                }`}
            >
                {value ?? 0}
            </p>
        </div>
    );
}

function DarkInfoRow({
    label,
    value,
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl bg-white/10 px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {label}
            </span>

            <span className="text-right text-sm font-black text-white">
                {value ?? '—'}
            </span>
        </div>
    );
}

function RiskDisclaimer() {
    return (
        <div className="flex items-start gap-3 bg-amber-50 px-6 py-4 text-xs leading-5 text-slate-700">
            <span className="text-xl text-amber-600">
                ⚠
            </span>

            <p>
                <strong>
                    Risk disclaimer:
                </strong>{' '}
                Trading cryptocurrencies
                involves significant risk.
                This workshop is for
                educational purposes only
                and does not guarantee
                profits or financial
                outcomes.
            </p>
        </div>
    );
}

function FormInput({
    label,
    required = false,
    ...inputProps
}) {
    return (
        <label>
            <span className="mb-1.5 block text-xs font-black text-[#071F42]">
                {label}

                {required && (
                    <span className="text-red-500">
                        {' '}
                        *
                    </span>
                )}
            </span>

            <input
                required={required}
                {...inputProps}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-2 focus:ring-blue-100"
            />
        </label>
    );
}

function FormSelect({
    label,
    required = false,
    children,
    ...selectProps
}) {
    return (
        <label>
            <span className="mb-1.5 block text-xs font-black text-[#071F42]">
                {label}

                {required && (
                    <span className="text-red-500">
                        {' '}
                        *
                    </span>
                )}
            </span>

            <select
                required={required}
                {...selectProps}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#0B2C5D] focus:ring-2 focus:ring-blue-100"
            >
                {children}
            </select>
        </label>
    );
}

function normalizeWorkshops(
    explicitWorkshops,
    workshopPayload,
) {
    let source = [];

    if (
        Array.isArray(
            explicitWorkshops,
        ) &&
        explicitWorkshops.length > 0
    ) {
        source =
            explicitWorkshops;
    } else if (
        Array.isArray(
            workshopPayload
                ?.workshops,
        )
    ) {
        source =
            workshopPayload
                .workshops;
    } else if (
        Array.isArray(
            workshopPayload?.data
                ?.workshops,
        )
    ) {
        source =
            workshopPayload.data
                .workshops;
    } else if (
        workshopPayload?.id
    ) {
        source = [
            workshopPayload,
        ];
    }

    const uniqueItems =
        new Map();

    source.forEach(
        (
            item,
            index,
        ) => {
            const id =
                Number(item?.id);

            if (
                !Number.isFinite(id) ||
                id <= 0
            ) {
                return;
            }

            uniqueItems.set(
                id,
                {
                    ...item,

                    id,

                    title:
                        item.title ||
                        `Workshop ${index + 1}`,

                    locations:
                        normalizeLocations(
                            item,
                        ),
                },
            );
        },
    );

    return Array.from(
        uniqueItems.values(),
    );
}

function normalizeLocations(
    workshop,
) {
    if (
        !Array.isArray(
            workshop?.locations,
        )
    ) {
        return [];
    }

    return workshop.locations
        .map(
            (location) => {
                const id =
                    Number(
                        location.id,
                    );

                const capacity =
                    Number(
                        location.capacity,
                    ) || 0;

                const occupied =
                    Number(
                        location.occupied_seats ??
                            location.registered_count ??
                            location.registered ??
                            location.confirmed_count ??
                            0,
                    ) || 0;

                const suppliedAvailable =
                    location.available_seats ??
                    location.availableSeats ??
                    location.seatsRemaining;

                const availableSeats =
                    suppliedAvailable ===
                        undefined ||
                    suppliedAvailable ===
                        null
                        ? Math.max(
                              0,
                              capacity -
                                  occupied,
                          )
                        : Math.max(
                              0,
                              Number(
                                  suppliedAvailable,
                              ) || 0,
                          );

                return {
                    ...location,

                    id,

                    capacity,

                    availableSeats,

                    trainers:
                        Array.isArray(
                            location.trainers,
                        )
                            ? location.trainers
                            : [],
                };
            },
        )
        .filter(
            (location) =>
                Number.isFinite(
                    location.id,
                ) &&
                location.id > 0,
        );
}

function getWorkshopDate(
    workshop,
) {
    return (
        workshop?.date ||
        workshop?.workshop_date ||
        workshop?.dateValue ||
        'Date TBA'
    );
}

function getWorkshopStartTime(
    workshop,
) {
    return (
        workshop?.startTime ||
        workshop?.start_time ||
        '—'
    );
}

function getWorkshopEndTime(
    workshop,
) {
    return (
        workshop?.endTime ||
        workshop?.end_time ||
        '—'
    );
}

function getWorkshopCanRegister(
    workshop,
) {
    const explicitValue =
        workshop?.canRegister ??
        workshop?.can_register;

    if (
        typeof explicitValue ===
        'boolean'
    ) {
        return explicitValue;
    }

    const normalizedStatus =
        String(
            workshop?.statusCode ??
                workshop?.status_code ??
                workshop?.status ??
                '',
        )
            .trim()
            .toLowerCase()
            .replace(
                /\s+/g,
                '_',
            );

    return [
        'registration_open',
        'full',
    ].includes(
        normalizedStatus,
    );
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