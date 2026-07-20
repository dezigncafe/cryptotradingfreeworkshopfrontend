const announcementItems = [
    'Registration Open',
    'Kurunegala',
    'July 18',
    'Limited Seats',
];

export default function AnnouncementBar() {
    const handleRegisterClick = (event) => {
        event.preventDefault();

        document
            .getElementById('register')
            ?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
    };

    return (
        <div className="bg-[#F5B400] text-[#061D42]">
            <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-center px-4 py-2 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[11px] font-extrabold sm:gap-x-4 sm:text-sm">
                    <span
                        className="hidden text-base sm:inline"
                        aria-hidden="true"
                    >
                        📢
                    </span>

                    {announcementItems.map(
                        (item, index) => (
                            <div
                                key={item}
                                className="flex items-center gap-3 sm:gap-4"
                            >
                                <span>{item}</span>

                                {index <
                                    announcementItems.length -
                                        1 && (
                                    <span
                                        className="h-4 w-px bg-[#061D42]/35"
                                        aria-hidden="true"
                                    />
                                )}
                            </div>
                        ),
                    )}

                    <span
                        className="hidden h-4 w-px bg-[#061D42]/35 sm:block"
                        aria-hidden="true"
                    />

                    <a
                        href="#register"
                        onClick={handleRegisterClick}
                        className="font-black transition hover:underline hover:underline-offset-4"
                    >
                        Reserve Your Seat
                    </a>
                </div>
            </div>
        </div>
    );
}