import Header from '../Components/Home/Header';
import Footer from '../Components/Home/Footer';

export default function PublicLayout({
    children,
    workshop,
}) {
    return (
        <div className="min-h-screen bg-white">
            <Header workshop={workshop} />

            {children}

            <Footer />
        </div>
    );
}