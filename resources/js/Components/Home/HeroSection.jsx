import {
    motion,
    useReducedMotion,
} from 'motion/react';

const workshop = {
    title: 'Crypto Trading Free Workshop',
    presenter: 'Dinisu Indrachapa',
    date: 'July 18, 2026',
    day: 'Saturday',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    venue: 'Equest Campus, Kurunegala',
    city: 'Kurunegala, Sri Lanka',
    capacity: 120,
    registered: 83,
    status: 'Registration Open',
    mapUrl: 'https://maps.google.com',
};

const contentContainer = {
    hidden: {},
    visible: {
        transition: {
            delayChildren: 0.15,
            staggerChildren: 0.12,
        },
    },
};

const revealUp = {
    hidden: {
        opacity: 0,
        y: 30,
    },

    visible: {
        opacity: 1,
        y: 0,

        transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"
            />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7v5l3 2"
            />
        </svg>
    );
}

function LocationIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
            />

            <circle
                cx="12"
                cy="10"
                r="2.5"
            />
        </svg>
    );
}

function BuildingIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"
            />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M14 7l5 5-5 5"
            />
        </svg>
    );
}

function EventDetail({
    icon,
    children,
}) {
    return (
        <motion.div
            variants={revealUp}
            className="flex items-start gap-3"
        >
            <div className="mt-0.5 shrink-0 text-[#F5B400]">
                {icon}
            </div>

            <p className="text-sm font-semibold leading-6 text-slate-100 sm:text-base">
                {children}
            </p>
        </motion.div>
    );
}

export default function HeroSection() {
    const reduceMotion = useReducedMotion();


    return (
        <section
            id="workshop"
            className="relative scroll-mt-28 overflow-hidden bg-[#061D42] text-white"
        >
            {/* Animated background image */}
            <motion.img
                src="/images/workshop-hero.jpg"
                alt=""
                initial={
                    reduceMotion
                        ? false
                        : {
                              opacity: 0,
                              scale: 1.12,
                          }
                }
                animate={{
                    opacity: 0.35,
                    scale: 1,
                }}
                transition={{
                    duration: 1.5,
                    ease: 'easeOut',
                }}
                className="absolute inset-0 h-full w-full object-cover object-center"
                onError={(event) => {
                    event.currentTarget.style.display =
                        'none';
                }}
            />

            {/* Dark overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#061D42] via-[#061D42]/95 to-[#061D42]/60" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#061D42] via-transparent to-[#061D42]/30" />

            {/* Animated glow left */}
            <motion.div
                className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
                animate={
                    reduceMotion
                        ? undefined
                        : {
                              x: [
                                  0,
                                  25,
                                  0,
                              ],
                              y: [
                                  0,
                                  -18,
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
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Animated glow right */}
            <motion.div
                className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#F5B400]/15 blur-3xl"
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
                                  1.1,
                                  1,
                              ],
                          }
                }
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
                {/* Left content */}
                <motion.div
                    variants={contentContainer}
                    initial={
                        reduceMotion
                            ? false
                            : 'hidden'
                    }
                    animate="visible"
                >
                    <motion.p
                        variants={revealUp}
                        className="text-sm font-black uppercase tracking-[0.2em] text-[#F5B400]"
                    >
                        Free Practical Workshop
                    </motion.p>

                    <motion.h1
                        variants={revealUp}
                        className="mt-5 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
                    >
                        Crypto Trading

                        <span className="mt-2 block text-[#F5B400]">
                            Free Workshop
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={revealUp}
                        className="mt-5 text-2xl font-medium italic text-white sm:text-3xl"
                    >
                        by {workshop.presenter}
                    </motion.p>

                    <motion.p
                        variants={revealUp}
                        className="mt-4 text-sm font-semibold text-slate-200 sm:text-base"
                    >
                        Powered by{' '}

                        <span className="font-black text-[#F5B400]">
                            Equest Institute of Higher
                            Education
                        </span>
                    </motion.p>

                    <div className="mt-8 grid max-w-xl gap-3">
                        <EventDetail
                            icon={
                                <CalendarIcon />
                            }
                        >
                            {workshop.date} (
                            {workshop.day})
                        </EventDetail>

                        <EventDetail
                            icon={<ClockIcon />}
                        >
                            {workshop.startTime} –{' '}
                            {workshop.endTime}
                        </EventDetail>

                        <EventDetail
                            icon={
                                <LocationIcon />
                            }
                        >
                            {workshop.venue}
                        </EventDetail>

                        <EventDetail
                            icon={
                                <BuildingIcon />
                            }
                        >
                            {workshop.city}
                        </EventDetail>
                    </div>

                    <motion.div
                        variants={revealUp}
                        className="mt-9 flex flex-col gap-3 sm:flex-row"
                    >
                        <motion.a
                            href="#register"
                            whileHover={
                                reduceMotion
                                    ? undefined
                                    : {
                                          y: -4,
                                          scale: 1.02,
                                      }
                            }
                            whileTap={{
                                scale: 0.97,
                            }}
                            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-[#F5B400] px-7 py-4 text-sm font-black uppercase tracking-wide text-[#061D42] shadow-[0_10px_30px_rgba(245,180,0,0.25)] hover:bg-[#ffca27]"
                        >
                            Reserve Your Seat

                            <motion.span
                                animate={
                                    reduceMotion
                                        ? undefined
                                        : {
                                              x: [
                                                  0,
                                                  5,
                                                  0,
                                              ],
                                          }
                                }
                                transition={{
                                    duration: 1.3,
                                    repeat: Infinity,
                                }}
                            >
                                <ArrowIcon />
                            </motion.span>
                        </motion.a>

                        <motion.a
                            href={
                                workshop.mapUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            whileHover={
                                reduceMotion
                                    ? undefined
                                    : {
                                          y: -4,
                                          scale: 1.02,
                                      }
                            }
                            whileTap={{
                                scale: 0.97,
                            }}
                            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg border border-white/45 bg-[#061D42]/40 px-7 py-4 text-sm font-black uppercase tracking-wide text-white backdrop-blur hover:border-[#F5B400] hover:text-[#F5B400]"
                        >
                            <LocationIcon />

                            View Location
                        </motion.a>
                    </motion.div>
                </motion.div>


                {/* Animated presenter / workshop image */}
                <motion.div
                    initial={
                        reduceMotion
                            ? false
                            : {
                                  opacity: 0,
                                  x: 90,
                                  scale: 0.88,
                              }
                    }
                    animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.9,
                        delay: 0.35,
                        ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                        ],
                    }}
                    className="relative mx-auto flex min-h-[440px] w-full max-w-[540px] items-end justify-center lg:ml-auto lg:min-h-[570px]"
                >
                    {/* Soft animated glow behind image */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute bottom-8 left-1/2 h-[330px] w-[330px] -translate-x-1/2 rounded-full bg-[#F5B400]/20 blur-3xl sm:h-[420px] sm:w-[420px]"
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                      scale: [
                                          1,
                                          1.1,
                                          1,
                                      ],
                                      opacity: [
                                          0.55,
                                          0.85,
                                          0.55,
                                      ],
                                  }
                        }
                        transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Decorative rotating ring */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute bottom-12 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full border border-[#F5B400]/35 sm:h-[390px] sm:w-[390px]"
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                      rotate: 360,
                                  }
                        }
                        transition={{
                            duration: 22,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5B400] shadow-[0_0_22px_rgba(245,180,0,0.9)]" />

                        <span className="absolute bottom-4 right-8 h-2.5 w-2.5 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.7)]" />
                    </motion.div>

                    {/* Main image */}
                    <motion.img
                        src="/images/workshop-presenter.png"
                        alt={`${workshop.presenter} presenting the crypto trading workshop`}
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                    y: [
                                        0,
                                        -14,
                                        0,
                                    ],
                                }
                        }
                        transition={{
                            duration: 4.2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        whileHover={
                            reduceMotion
                                ? undefined
                                : {
                                    scale: 1.025,
                                }
                        }
                        className="relative z-10 h-auto w-[115%] max-w-none object-contain object-bottom drop-shadow-[0_30px_45px_rgba(0,0,0,0.42)] sm:w-[120%] lg:w-[135%]"
                    />

                    {/* Floating yellow accent */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute right-4 top-16 h-16 w-16 rounded-2xl border border-white/15 bg-[#F5B400]/90 shadow-[0_18px_45px_rgba(245,180,0,0.25)] backdrop-blur sm:right-8 sm:h-20 sm:w-20"
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                      y: [
                                          0,
                                          12,
                                          0,
                                      ],
                                      rotate: [
                                          8,
                                          -5,
                                          8,
                                      ],
                                  }
                        }
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Floating blue accent */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute bottom-24 left-2 h-10 w-10 rounded-full border border-white/20 bg-blue-400/30 shadow-[0_0_30px_rgba(96,165,250,0.45)] backdrop-blur sm:left-8 sm:h-14 sm:w-14"
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                      x: [
                                          0,
                                          12,
                                          0,
                                      ],
                                      y: [
                                          0,
                                          -10,
                                          0,
                                      ],
                                  }
                        }
                        transition={{
                            duration: 4.8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </motion.div>
            </div>
        </section>
    );
}