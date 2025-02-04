import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router';

const LandingLayout: React.FC = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <header className="md:col-span-12">
                    {/* Header content */}
                </header>
                
                <main className="md:col-span-12">
                    {/* Main content */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LandingLayout;