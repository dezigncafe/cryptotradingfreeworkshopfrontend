export default function AnnouncementBar({
    workshop,
}) {
    if (!workshop) {
        return null;
    }

    return (
        <div className="bg-[#F5B400] px-4 py-2.5 text-[#071F42]">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-xs font-black uppercase sm:text-sm">
                <span>{workshop.status}</span>

                <span aria-hidden="true">•</span>

                <span>{workshop.city}</span>

                <span aria-hidden="true">•</span>

                <span>{workshop.date}</span>

                <span aria-hidden="true">•</span>

                <span>
                    {workshop.seatsRemaining}{' '}
                    Seats Remaining
                </span>

                <a
                    href="#register"
                    className="rounded-md bg-[#071F42] px-3 py-1 text-white"
                >
                    {workshop.ctaLabel}
                </a>
            </div>
        </div>
    );
}