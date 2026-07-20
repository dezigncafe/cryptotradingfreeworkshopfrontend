import { useEffect } from 'react';

import PublicLayout from '../Layouts/PublicLayout';
import HeroSection from '../Components/Home/HeroSection';
import BenefitsStrip from '../Components/Home/BenefitsStrip';

export default function Home() {
    useEffect(() => {
        document.title =
            'Crypto Trading Free Workshop';
    }, []);

    return (
        <PublicLayout>
            <main>
                <HeroSection />
                <BenefitsStrip />

                <section
                    id="learn"
                    className="scroll-mt-28 bg-slate-50 py-24"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <p className="font-bold uppercase tracking-widest text-amber-600">
                            What You Will Learn
                        </p>

                        <h2 className="mt-4 text-4xl font-black text-[#0B2C5D]">
                            Build the correct trading foundation.
                        </h2>
                    </div>
                </section>
            </]">
                            Build the correct trading foundation.
main>
        </PublicLayout>
    );
}