import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import PublicLayout from '../Layouts/PublicLayout';
import HeroSection from '../Components/Home/HeroSection';
import BenefitsStrip from '../Components/Home/BenefitsStrip';
import AboutSection from '../Components/Home/AboutSection';
import LearnSection from '../Components/Home/LearnSection';
import TrainersSection from '../Components/Home/TrainersSection';
import MetricsSection from '../Components/Home/MetricsSection';
import CommunitySection from '../Components/Home/CommunitySection';
import RegistrationSection from '../Components/Home/RegistrationSection';
import FaqSection from '../Components/Home/FaqSection';
import FinalCtaSection from '../Components/Home/FinalCtaSection';
import api from '../services/api';

export default function Home() {
    const [workshop, setWorkshop] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const loadWorkshop = useCallback(
        async () => {
            setLoading(true);
            setError('');

            try {
                const response = await api.get(
                    '/featured-workshop',
                );

                setWorkshop(
                    response.data.data,
                );
            } catch (requestError) {
                setWorkshop(null);

                setError(
                    requestError.response?.data
                        ?.message ||
                        'Unable to load workshop information.',
                );
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        document.title =
            'Crypto Trading Free Workshop';

        loadWorkshop();
    }, [loadWorkshop]);

    return (
        <PublicLayout workshop={workshop}>
            <main>
                {error && (
                    <div className="bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                <HeroSection
                    workshop={workshop}
                    loading={loading}
                />

                <BenefitsStrip />
                <AboutSection />
                <LearnSection />
                <TrainersSection />
                <MetricsSection />
                <CommunitySection />

                <RegistrationSection
                    workshop={workshop}
                    onRegistered={
                        loadWorkshop
                    }
                />

                <FaqSection />
                <FinalCtaSection />
            </main>
        </PublicLayout>
    );
}