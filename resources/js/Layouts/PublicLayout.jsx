import Header from '../Components/Home/Header';
// import Footer from '../Components/Home/Footer';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {children}

           
        </div>
    );
}