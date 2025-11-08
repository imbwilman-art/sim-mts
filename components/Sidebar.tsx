import React from 'react';
import { Page } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { UsersIcon } from './icons/UsersIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { CloseIcon } from './icons/MenuIcons';
import { MtsnLogo } from './icons/MtsnLogo';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 transform rounded-lg ${
      isActive
        ? 'bg-madrasah-green-600 text-white'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-700'
    }`}
  >
    {icon}
    <span className="mx-4">{label}</span>
  </a>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    if(window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const navItems = [
    { page: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { page: 'siswa', label: 'Data Siswa', icon: <UsersIcon /> },
    { page: 'guru', label: 'Data Guru', icon: <AcademicCapIcon /> },
    { page: 'jadwal', label: 'Jadwal Pelajaran', icon: <CalendarIcon /> },
    { page: 'pengumuman', label: 'Pengumuman', icon: <MegaphoneIcon /> },
    { page: 'galeri', label: 'Galeri', icon: <PhotoIcon /> },
    { page: 'kontak', label: 'Kontak', icon: <PhoneIcon /> },
  ] as const;

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col h-full px-4 py-8 overflow-y-auto bg-white border-r w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between">
         <div className="flex items-center">
            <MtsnLogo className="h-10 w-10" />
            <h2 className="ml-3 text-2xl font-semibold text-gray-800">
                <span className="text-madrasah-green-700">SIM</span> MTsN 1
            </h2>
         </div>
         <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <CloseIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="space-y-2">
            {navItems.map(item => (
                <NavLink 
                    key={item.page}
                    icon={item.icon}
                    label={item.label}
                    isActive={currentPage === item.page}
                    onClick={() => handleNavClick(item.page)}
                />
            ))}
        </nav>

        <div className="text-center text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} MTsN 1 Ciamis</p>
            <p>All rights reserved.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;