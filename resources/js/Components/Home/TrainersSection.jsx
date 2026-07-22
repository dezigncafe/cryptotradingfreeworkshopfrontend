import {
    ExternalLink,
    Globe2,
    Play,
    RefreshCw,
} from 'lucide-react';

import {
    useEffect,
    useState,
} from 'react';

import {
    motion,
    useReducedMotion,
} from 'motion/react';

import api from '../../services/api';

const sectionVariants = {
    hidden: {
        opacity: 0,
    },

    visible: {
        opacity: 1,

        transition: {
            staggerChildren: 0.16,
            delayChildren: 0.1,
        },
    },
};

const headingVariants = {
    hidden: {
        opacity: 0,
        x: -35,
    },

    visible: {
        opacity: 1,
        x: 0,

        transition: {
            duration: 0.6,
            ease: [
                0.22,
                1,
                0.36,
                1,
            ],
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 45,
        scale: 0.96,
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1,

        transition: {
            duration: 0.65,
            ease: [
                0.22,
                1,
                0.36,
                1,
            ],
        },
    },
};

export default function TrainersSection() {
    const reduceMotion =
        useReducedMotion();

    const [trainers, setTrainers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [
        refreshKey,
        setRefreshKey,
    ] = useState(0);

    useEffect(() => {
        const controller =
            new AbortController();

        const loadTrainers =
            async () => {
                setLoading(true);
                setError('');

                try {
                    const response =
                        await api.get(
                            '/trainers',
                            {
                                signal:
                                    controller
                                        .signal,
                            },
                        );

                    const data =
                        Array.isArray(
                            response.data
                                ?.data,
                        )
                            ? response
                                  .data
                                  .data
                            : [];

                    setTrainers(data);
                } catch (
                    requestError
                ) {
                    if (
                        requestError
                            .code ===
                        'ERR_CANCELED'
                    ) {
                        return;
                    }

                    setError(
                        requestError
                            .response
                            ?.data
                            ?.message ||
                            'Unable to load trainer information.',
                    );
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setLoading(
                            false,
                        );
                    }
                }
            };

        loadTrainers();

        return () => {
            controller.abort();
        };
    }, [refreshKey]);

    return (
        <motion.section
            id="trainers"
            initial={
                reduceMotion
                    ? false
                    : 'hidden'
            }
            whileInView="visible"
            viewport={{
                once: true,
                amount: 0.15,
            }}
            variants={
                sectionVariants
            }
            className="relative scroll-mt-28 overflow-hidden bg-white px-4 pb-20 pt-8 sm:px-6 lg:px-8"
        >
            <div className="pointer-events-none absolute -left-28 top-20 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

            <div className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <motion.div
                    variants={
                        headingVariants
                    }
                >
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F5B400]">
                        Expert Guidance
                    </p>

                    <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#071F42] sm:text-3xl">
                        Meet the Trainers
                    </h2>

                    <motion.div
                        initial={{
                            width: 0,
                        }}
                        whileInView={{
                            width: 72,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            duration: 0.7,
                            delay: 0.25,
                        }}
                        className="mt-3 h-1 rounded-full bg-[#F5B400]"
                    />
                </motion.div>

                {loading && (
                    <LoadingState />
                )}

                {!loading && error && (
                    <ErrorState
                        message={
                            error
                        }
                        onRetry={() =>
                            setRefreshKey(
                                (current) =>
                                    current +
                                    1,
                            )
                        }
                    />
                )}

                {!loading &&
                    !error &&
                    trainers.length ===
                        0 && (
                        <EmptyState />
                    )}

                {!loading &&
                    !error &&
                    trainers.length >
                        0 && (
                        <motion.div
                            variants={
                                sectionVariants
                            }
                            className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                        >
                            {trainers.map(
                                (
                                    trainer,
                                ) => (
                                    <TrainerCard
                                        key={
                                            trainer.id
                                        }
                                        trainer={
                                            trainer
                                        }
                                        reduceMotion={
                                            reduceMotion
                                        }
                                    />
                                ),
                            )}
                        </motion.div>
                    )}
            </div>
        </motion.section>
    );
}

function TrainerCard({
    trainer,
    reduceMotion,
}) {
    const initials =
        getInitials(
            trainer.name,
        );

    return (
        <motion.article
            variants={cardVariants}
            whileHover={
                reduceMotion
                    ? undefined
                    : {
                          y: -8,
                          scale: 1.01,
                      }
            }
            transition={{
                duration: 0.25,
                ease: 'easeOut',
            }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:border-amber-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.15)]"
        >
            <div className="absolute inset-x-0 top-0 z-20 h-1 bg-[#F5B400]" />

            <div className="grid min-h-[270px] grid-cols-[135px_1fr] sm:grid-cols-[155px_1fr]">
                <TrainerImage
                    trainer={trainer}
                    initials={
                        initials
                    }
                />

                <div className="flex min-w-0 flex-col p-5">
                    <h3 className="text-xl font-black text-[#0B2C5D]">
                        {trainer.name}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-amber-600">
                        {trainer.role ||
                            'Workshop Trainer'}
                    </p>

                    <div className="mt-3 h-px w-full bg-slate-100" />

                    <p className="mt-4 flex-1 text-sm font-medium leading-6 text-slate-700">
                        {trainer.bio ||
                            'Experienced trainer and educator.'}
                    </p>

                    <TrainerSocialLinks
                        trainer={
                            trainer
                        }
                        reduceMotion={
                            reduceMotion
                        }
                    />
                </div>
            </div>
        </motion.article>
    );
}

function TrainerImage({
    trainer,
    initials,
}) {
    const [
        imageStatus,
        setImageStatus,
    ] = useState(
        trainer.photo_url ||
            trainer.photoUrl
            ? 'loading'
            : 'missing',
    );

    const [
        retryCount,
        setRetryCount,
    ] = useState(0);

    const baseSource =
        trainer.photo_url ||
        trainer.photoUrl ||
        '';

    useEffect(() => {
        setRetryCount(0);

        setImageStatus(
            baseSource
                ? 'loading'
                : 'missing',
        );
    }, [
        trainer.id,
        baseSource,
    ]);

    const imageSource =
        addRetryParameter(
            baseSource,
            retryCount,
        );

    const handleError = () => {
        if (retryCount < 2) {
            window.setTimeout(
                () => {
                    setRetryCount(
                        (current) =>
                            current + 1,
                    );

                    setImageStatus(
                        'loading',
                    );
                },
                700,
            );

            return;
        }

        setImageStatus(
            'failed',
        );
    };

    const showImage =
        Boolean(imageSource) &&
        imageStatus !==
            'failed' &&
        imageStatus !==
            'missing';

    return (
        <div className="relative min-h-[270px] overflow-hidden bg-slate-200">
            {showImage && (
                <>
                    {imageStatus ===
                        'loading' && (
                        <div className="absolute inset-0 animate-pulse bg-slate-200" />
                    )}

                    <motion.img
                        key={`${trainer.id}-${retryCount}-${imageSource}`}
                        src={
                            imageSource
                        }
                        alt={
                            trainer.name
                        }
                        loading="eager"
                        decoding="async"
                        onLoad={() =>
                            setImageStatus(
                                'loaded',
                            )
                        }
                        onError={
                            handleError
                        }
                        whileHover={{
                            scale: 1.07,
                        }}
                        transition={{
                            duration: 0.45,
                            ease: 'easeOut',
                        }}
                        className={`h-full min-h-[270px] w-full object-cover object-top transition-opacity duration-300 ${
                            imageStatus ===
                            'loaded'
                                ? 'opacity-100'
                                : 'opacity-0'
                        }`}
                    />
                </>
            )}

            {!showImage && (
                <div className="flex h-full min-h-[270px] w-full items-center justify-center bg-gradient-to-br from-[#0B2C5D] to-[#174E91] text-3xl font-black text-[#F5B400]">
                    {initials}
                </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071F42]/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

            <div className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-lg bg-[#F5B400] text-xs font-black text-[#071F42] shadow-lg">
                {initials}
            </div>
        </div>
    );
}

function TrainerSocialLinks({
    trainer,
    reduceMotion,
}) {
    const links = [
        {
            href:
                trainer.linkedin_url,

            label:
                'LinkedIn',

            shortLabel:
                'in',

            className:
                'bg-[#0A66C2]',
        },

        {
            href:
                trainer.youtube_url,

            label:
                'YouTube',

            shortLabel:
                'YT',

            className:
                'bg-red-600',
        },

        {
            href:
                trainer.facebook_url,

            label:
                'Facebook',

            shortLabel:
                'f',

            className:
                'bg-blue-700',
        },
    ].filter(
        (link) =>
            Boolean(link.href),
    );

    if (
        links.length === 0
    ) {
        return null;
    }

    return (
        <div className="mt-5 flex items-center gap-2">
            {links.map(
                ({
                    href,
                    label,
                    shortLabel,
                    className,
                }) => (
                    <motion.a
                        key={
                            label
                        }
                        href={
                            href
                        }
                        target="_blank"
                        rel="noreferrer"
                        aria-label={
                            label
                        }
                        title={
                            label
                        }
                        whileHover={
                            reduceMotion
                                ? undefined
                                : {
                                      y: -3,
                                      scale: 1.1,
                                  }
                        }
                        whileTap={{
                            scale: 0.92,
                        }}
                        className={`grid h-9 min-w-9 place-items-center rounded-full px-2 text-xs font-black text-white shadow-md ${className}`}
                    >
                        {
                            shortLabel
                        }
                    </motion.a>
                ),
            )}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#F5B400]" />

            <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading trainers...
            </p>
        </div>
    );
}

function ErrorState({
    message,
    onRetry,
}) {
    return (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
                {message}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#071F42] px-4 py-2 text-sm font-black text-white transition hover:bg-[#0B2C5D]"
            >
                <RefreshCw className="h-4 w-4" />

                Try Again
            </button>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="font-bold text-slate-600">
                Trainer information
                will be available soon.
            </p>
        </div>
    );
}

function addRetryParameter(
    url,
    retryCount,
) {
    if (
        !url ||
        retryCount === 0
    ) {
        return url;
    }

    const separator =
        url.includes('?')
            ? '&'
            : '?';

    return `${url}${separator}retry=${retryCount}`;
}

function getInitials(name) {
    if (!name) {
        return 'TR';
    }

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) =>
            part
                .charAt(0)
                .toUpperCase(),
        )
        .join('');
}