import React from 'react';
import { mockSiswa, mockGuru, mockPengumuman } from '../data/mockData';
import { Reminder, Page } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { BellAlertIcon } from './icons/BellAlertIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';

interface DashboardProps {
    reminders: Reminder[];
    setCurrentPage: (page: Page) => void;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string; onClick: () => void }> = ({ title, value, icon, color, onClick }) => (
    <div onClick={onClick} className={`bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 border-l-4 ${color}`}>
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ reminders, setCurrentPage }) => {
    const totalSiswa = mockSiswa.length;
    const totalGuru = mockGuru.length;
    const latestPengumuman = mockPengumuman.slice(0, 3);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="mt-1 text-gray-600">Selamat datang di Sistem Informasi Manajemen MTsN 1 Ciamis.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Siswa" 
                    value={totalSiswa} 
                    icon={<UsersIcon className="h-10 w-10 text-blue-500"/>}
                    color="border-blue-500"
                    onClick={() => setCurrentPage('siswa')}
                />
                <StatCard 
                    title="Total Guru" 
                    value={totalGuru} 
                    icon={<AcademicCapIcon className="h-10 w-10 text-green-500"/>}
                    color="border-green-500"
                    onClick={() => setCurrentPage('guru')}
                />
                <StatCard 
                    title="Pengingat Aktif" 
                    value={reminders.length} 
                    icon={<BellAlertIcon className="h-10 w-10 text-yellow-500"/>}
                    color="border-yellow-500"
                    onClick={() => setCurrentPage('jadwal')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center gap-3">
                        <MegaphoneIcon className="h-6 w-6 text-madrasah-green-700"/>
                        <h2 className="text-xl font-bold text-gray-800">Pengumuman Terbaru</h2>
                    </div>
                    <div className="mt-4 space-y-4">
                        {latestPengumuman.length > 0 ? latestPengumuman.map(p => (
                            <div key={p.id} className="border-l-4 border-madrasah-green-200 pl-4 py-2">
                                <p className="font-semibold text-gray-700">{p.judul}</p>
                                <p className="text-sm text-gray-500">{p.tanggal} - {p.penulis}</p>
                            </div>
                        )) : <p className="text-gray-500">Tidak ada pengumuman terbaru.</p>}
                    </div>
                    <button onClick={() => setCurrentPage('pengumuman')} className="mt-4 text-sm font-semibold text-madrasah-green-600 hover:text-madrasah-green-800">
                        Lihat Semua &rarr;
                    </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center gap-3">
                         <BellAlertIcon className="h-6 w-6 text-yellow-600"/>
                         <h2 className="text-xl font-bold text-gray-800">Pengingat Jadwal Terdekat</h2>
                    </div>
                    <div className="mt-4 space-y-3">
                         {reminders.length > 0 ? reminders.map(r => (
                            <div key={r.id} className="bg-yellow-50 p-3 rounded-lg flex items-start gap-3">
                                <BellAlertIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <p className="font-semibold text-yellow-800">{r.pelajaran} - {r.kelas}</p>
                                    <p className="text-sm text-yellow-700">{r.hari}, {r.jam}</p>
                                </div>
                            </div>
                         )) : <p className="text-gray-500">Tidak ada pengingat yang aktif.</p>}
                    </div>
                     <button onClick={() => setCurrentPage('jadwal')} className="mt-4 text-sm font-semibold text-madrasah-green-600 hover:text-madrasah-green-800">
                        Kelola Jadwal &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
