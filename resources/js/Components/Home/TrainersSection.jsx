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
            staggerChildren: 0.18,
            delayChildren: 0.12,
        },
    },
};

const headingVariants = {
    hidden: {
        opacity: 0,
        x: -40,
    },

    visible: {
        opacity: 1,
        x: 0,

        transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 55,
        scale: 0.95,
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1,

        transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const contentVariants = {
    hidden: {
        opacity: 0,
        x: 25,
    },

    visible: {
        opacity: 1,
        x: 0,

        transition: {
            duration: 0.55,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
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

    useEffect(() => {
        const controller =
            new AbortController();

        const loadTrainers = async () => {
            setLoading(true);
            setError('');

            try {
                const response =
                    await api.get(
                        '/trainers',
                        {
                            signal:
                                controller.signal,
                        },
                    );

                setTrainers(
                    response.data.data || [],
                );
            } catch (requestError) {
                if (
                    requestError.code ===
                    'ERR_CANCELED'
                ) {
                    return;
                }

                setError(
                    requestError.response?.data
                        ?.message ||
                        'Unable to load trainer information.',
                );
            } finally {
                setLoading(false);
            }
        };

        loadTrainers();

        return () => {
            controller.abort();
        };
    }, []);

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
                amount: 0.2,
            }}
            variants={sectionVariants}
            className="relative scroll-mt-28 overflow-hidden bg-white px-4 pb-20 pt-8 sm:px-6 lg:px-8"
        >
            <motion.div
                animate={
                    reduceMotion
                        ? undefined
                        : {
                              x: [
                                  0,
                                  30,
                                  0,
                              ],

                              y: [
                                  0,
                                  -20,
                                  0,
                              ],

                              scale: [
                                  1,
                                  1.1,
                                  1,
                              ],
                          }
                }
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="pointer-events-none absolute -left-28 top-20 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl"
            />

            <motion.div
                animate={
                    reduceMotion
                        ? undefined
                        : {
                              x: [
                                  0,
                                  -25,
                                  0,
                              ],

                              y: [
                                  0,
                                  20,
                                  0,
                              ],

                              scale: [
                                  1,
                                  1.08,
                                  1,
                              ],
                          }
                }
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl">
                <motion.div
                    variants={headingVariants}
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
                            delay: 0.3,
                        }}
                        className="mt-3 h-1 rounded-full bg-[#F5B400]"
                    />
                </motion.div>

                {loading && (
                    <div className="py-16 text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#F5B400]" />

                        <p className="mt-4 text-sm font-semibold text-slate-500">
                            Loading trainers...
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    trainers.length === 0 && (
                        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                            <p className="font-bold text-slate-600">
                                Trainer information
                                will be available
                                soon.
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    trainers.length > 0 && (
                        <motion.div
                            variants={
                                sectionVariants
                            }
                            className="mt-7 grid gap-5 lg:grid-cols-3"
                        >
                            {trainers.map(
                                (trainer) => (
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
    const initials = getInitials(
        trainer.name,
    );

    return (
        <motion.article
            variants={cardVariants}
            whileHover={
                reduceMotion
                    ? undefined
                    : {
                          y: -10,
                          scale: 1.015,
                      }
            }
            transition={{
                duration: 0.3,
                ease: 'easeOut',
            }}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:border-amber-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.15)]"
        >
            <motion.div
                initial={{
                    scaleX: 0,
                }}
                whileInView={{
                    scaleX: 1,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    duration: 0.7,
                    delay: 0.25,
                }}
                className="absolute inset-x-0 top-0 z-20 h-1 origin-left bg-[#F5B400]"
            />

            <div className="grid min-h-[250px] grid-cols-[135px_1fr] sm:grid-cols-[155px_1fr]">
                <TrainerImage
                    trainer={trainer}
                    initials={initials}
                />

                <motion.div
                    variants={contentVariants}
                    className="flex flex-col p-5"
                >
                    <motion.h3
                        whileHover={
                            reduceMotion
                                ? undefined
                                : {
                                      x: 3,
                                  }
                        }
                        className="text-xl font-black text-[#0B2C5D]"
                    >
                        {trainer.name}
                    </motion.h3>

                    <p className="mt-1 text-sm font-semibold text-amber-600">
                        {trainer.role}
                    </p>

                    <div className="mt-3 h-px w-full bg-slate-100" />

                    <p className="mt-4 flex-1 text-sm font-medium leading-6 text-slate-700">
                        {trainer.bio ||
                            'Experienced trainer and educator.'}
                    </p>

                    {trainer.linkedin_url && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.45,
                            }}
                            className="mt-5 flex items-center gap-3"
                        >
                            <SocialLink
                                href={
                                    trainer.linkedin_url
                                }
                                label="LinkedIn"
                                reduceMotion={
                                    reduceMotion
                                }
                            />
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.article>
    );
}

function TrainerImage({
    trainer,
    initials,
}) {
    const [sourceIndex, setSourceIndex] =
        useState(0);

    const sources = [];

    if (trainer.photo_url) {
        sources.push(
            trainer.photo_url,
        );
    }

    if (trainer.photo_path) {
        const cleanPath = String(
            trainer.photo_path,
        ).replace(/^\/+/, '');

        sources.push(
            `/storage/${cleanPath}`,
        );
    }

    const uniqueSources = [
        ...new Set(sources),
    ];

    const imageSource =
        uniqueSources[sourceIndex] ||
        null;

    useEffect(() => {
        setSourceIndex(0);
    }, [
        trainer.id,
        trainer.photo_url,
        trainer.photo_path,
    ]);

    return (
        <motion.div
            className="relative overflow-hidden bg-slate-200"
            whileHover="hover"
        >
            {imageSource ? (
                <motion.img
                    src={imageSource}
                    alt={trainer.name}
                    variants={{
                        hover: {
                            scale: 1.08,
                        },
                    }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeOut',
                    }}
                    className="h-full w-full object-cover object-top"
                    onError={() => {
                        setSourceIndex(
                            (current) =>
                                current + 1,
                        );
                    }}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B2C5D] to-[#174E91] text-3xl font-black text-[#F5B400]">
                    {initials}
                </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071F42]/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.5,
                }}
                whileInView={{
                    opacity: 1,
                    scale: 1,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 14,
                    delay: 0.5,
                }}
                className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-lg bg-[#F5B400] text-xs font-black text-[#071F42] shadow-lg"
            >
                {initials}
            </motion.div>
        </motion.div>
    );
}

function SocialLink({
    href,
    label,
    reduceMotion,
}) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            whileHover={
                reduceMotion
                    ? undefined
                    : {
                          y: -4,
                          scale: 1.15,
                          rotate: 5,
                      }
            }
            whileTap={{
                scale: 0.9,
            }}
            transition={{
                type: 'spring',
                stiffness: 320,
                damping: 18,
            }}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#0A66C2] text-xs font-black text-white shadow-md"
        >
            in
        </motion.a>
    );
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
            part.charAt(0).toUpperCase(),
        )
        .join('');
}