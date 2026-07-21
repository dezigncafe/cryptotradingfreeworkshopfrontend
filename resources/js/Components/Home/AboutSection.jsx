export default function AboutSection() {
    return (
        <section
            id="about"
            className="bg-white px-4 pb-4 pt-14 sm:px-6 lg:px-8"
        >
            <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[360px_1fr]">
                <div className="overflow-hidden rounded-xl bg-slate-200 shadow-sm">
                    <img
                        src="/images/workshop-about.jpg"
                        alt="Crypto trading workshop training session"
                        className="h-[230px] w-full object-cover"
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-[#071F42] sm:text-3xl">
                        About the Workshop
                    </h2>

                    <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-700 sm:text-base">
                        This free workshop is designed for absolute
                        beginners who want to understand cryptocurrency
                        trading in a practical and simple way. You will
                        learn the essentials, set up your Binance account,
                        explore trading strategies, understand risk
                        management, and learn through live demonstrations
                        and real-life examples.
                    </p>

                    <div className="mt-5 flex items-start gap-4">
                        <span
                            className="mt-0.5 h-7 w-1.5 shrink-0 rounded-full bg-[#0B2C5D]"
                            aria-hidden="true"
                        />

                        <p className="font-black text-[#071F42]">
                            No prior knowledge needed. Just your
                            willingness to learn.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}