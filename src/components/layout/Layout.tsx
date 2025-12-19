import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAppContext } from '../../context/AppContext';

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { vadState, toggleRecording, isPermissionsGranted } = useAppContext();

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <Header
                onOpenSettings={() => setSidebarOpen(true)}
                vadState={vadState}
                onToggleRecording={toggleRecording}
                isPermissionsGranted={isPermissionsGranted}
            />

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="pt-20"> {/* Header offset moved here to be global */}
                <Outlet />
            </div>
        </div>
    );
}
