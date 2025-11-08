import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Siswa from './components/Siswa';
import Guru from './components/Guru';
import Jadwal from './components/Jadwal';
import Pengumuman from './components/Pengumuman';
import Galeri from './components/Galeri';
import Kontak from './components/Kontak';
import { Page, Reminder } from './types';
import { MenuIcon } from './components/icons/MenuIcons';
import { BellIcon } from './components/icons/BellIcon';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addReminder = (newReminder: Reminder) => {
    if (!reminders.some(r => r.id === newReminder.id)) {
        setReminders(prev => [...prev, newReminder]);
    }
  };

  const removeReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard reminders={reminders} setCurrentPage={setCurrentPage} />;
      case 'siswa':
        return <Siswa />;
      case 'guru':
        return <Guru />;
      case 'jadwal':
        return <Jadwal reminders={reminders} addReminder={addReminder} removeReminder={removeReminder} />;
      case 'pengumuman':
        return <Pengumuman />;
      case 'galeri':
        return <Galeri />;
      case 'kontak':
        return <Kontak />;
      default:
        return <Dashboard reminders={reminders} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <header className="bg-white shadow-sm p-4 flex justify-between items-center lg:justify-end">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <MenuIcon className="h-6 w-6 text-gray-600" />
            </button>
            <div className="relative">
                <BellIcon className="h-6 w-6 text-gray-600" />
                {reminders.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">
                            {reminders.length}
                        </span>
                    </span>
                )}
            </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
