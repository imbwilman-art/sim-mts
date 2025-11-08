import React, { useState, FormEvent, ChangeEvent } from 'react';
import { mockJadwal, mockGuru } from '../data/mockData';
import { Reminder, MataPelajaran, JadwalPelajaran } from '../types';
import { BellIcon } from './icons/BellIcon';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';


interface JadwalProps {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  removeReminder: (reminderId: string) => void;
}

const Jadwal: React.FC<JadwalProps> = ({ reminders, addReminder, removeReminder }) => {
  const [jadwalData, setJadwalData] = useState(mockJadwal);
  const kelasOptions = Object.keys(jadwalData);
  const [selectedKelas, setSelectedKelas] = useState(kelasOptions[0]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentDay, setCurrentDay] = useState('');
  const [editingPelajaran, setEditingPelajaran] = useState<MataPelajaran | null>(null);
  const initialFormState = { jam: '', pelajaran: '', guru: '' };
  const [formData, setFormData] = useState(initialFormState);


  const jadwalKelas = jadwalData[selectedKelas] || [];

  const handleSetReminder = (mapel: MataPelajaran, hari: string, kelas: string) => {
    const reminder: Reminder = {
      id: mapel.id, // Use lesson's unique ID for reminder ID
      pelajaran: mapel.pelajaran,
      guru: mapel.guru,
      jam: mapel.jam,
      hari,
      kelas,
    };
    addReminder(reminder);
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleOpenAddModal = (hari: string) => {
    setModalMode('add');
    setCurrentDay(hari);
    setEditingPelajaran(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (mapel: MataPelajaran, hari: string) => {
    setModalMode('edit');
    setCurrentDay(hari);
    setEditingPelajaran(mapel);
    setFormData({ jam: mapel.jam, pelajaran: mapel.pelajaran, guru: mapel.guru });
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleDeletePelajaran = (pelajaranId: string, hari: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal pelajaran ini?')) {
        setJadwalData(prevData => {
            const newJadwalForKelas = prevData[selectedKelas].map(d => {
                if (d.hari === hari) {
                    return {
                        ...d,
                        pelajaran: d.pelajaran.filter(p => p.id !== pelajaranId)
                    };
                }
                return d;
            });
            return {
                ...prevData,
                [selectedKelas]: newJadwalForKelas
            };
        });
        // Also remove any associated reminder
        removeReminder(pelajaranId);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    setJadwalData(prevData => {
        const newJadwalForKelas = [...prevData[selectedKelas]];
        const dayIndex = newJadwalForKelas.findIndex(d => d.hari === currentDay);

        if (dayIndex === -1) return prevData; // Should not happen

        const daySchedule = { ...newJadwalForKelas[dayIndex] };

        if (modalMode === 'add') {
            const newPelajaran: MataPelajaran = {
                ...formData,
                id: `mapel-${Date.now()}`
            };
            daySchedule.pelajaran = [...daySchedule.pelajaran, newPelajaran];
        } else if (editingPelajaran) {
            daySchedule.pelajaran = daySchedule.pelajaran.map(p => 
                p.id === editingPelajaran.id ? { ...p, ...formData } : p
            );
        }

        newJadwalForKelas[dayIndex] = daySchedule;

        return {
            ...prevData,
            [selectedKelas]: newJadwalForKelas
        };
    });
    
    handleCloseModal();
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Jadwal Pelajaran</h1>
        <p className="mt-1 text-gray-600">Lihat jadwal pelajaran per kelas, atur pengingat, dan kelola jadwal.</p>
      </div>

      <div>
        <label htmlFor="kelas-selector" className="block text-sm font-medium text-gray-700 mb-1">
          Pilih Kelas
        </label>
        <select
          id="kelas-selector"
          value={selectedKelas}
          onChange={(e) => setSelectedKelas(e.target.value)}
          className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:ring-madrasah-green-500 focus:border-madrasah-green-500"
        >
          {kelasOptions.map((kelas) => (
            <option key={kelas} value={kelas}>
              {kelas}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-8">
        {jadwalKelas.map((hari) => (
          <div key={hari.hari} className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-madrasah-green-700">{hari.hari}</h2>
                <button 
                    onClick={() => handleOpenAddModal(hari.hari)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-madrasah-green-50 text-madrasah-green-700 font-semibold rounded-lg hover:bg-madrasah-green-100 focus:outline-none focus:ring-2 focus:ring-madrasah-green-500 focus:ring-opacity-75 transition-colors duration-200 text-sm"
                >
                    <PlusIcon className="h-4 w-4" />
                    <span>Tambah Pelajaran</span>
                </button>
            </div>
            <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guru</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {hari.pelajaran.length > 0 ? hari.pelajaran.map((mapel) => {
                          const isReminderSet = reminders.some(r => r.id === mapel.id);
                          return (
                            <tr key={mapel.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mapel.jam}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{mapel.pelajaran}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mapel.guru}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleSetReminder(mapel, hari.hari, selectedKelas)}
                                            disabled={isReminderSet}
                                            className={`p-2 rounded-full transition-colors duration-200 ${
                                                isReminderSet 
                                                ? 'bg-madrasah-green-100 text-madrasah-green-600 cursor-not-allowed' 
                                                : 'text-gray-500 hover:bg-yellow-100 hover:text-yellow-600'
                                            }`}
                                            aria-label={isReminderSet ? `Pengingat diatur untuk ${mapel.pelajaran}` : `Atur pengingat untuk ${mapel.pelajaran}`}
                                            title={isReminderSet ? 'Pengingat sudah diatur' : 'Atur pengingat'}
                                        >
                                            <BellIcon solid={isReminderSet} />
                                        </button>
                                        <button 
                                            onClick={() => handleOpenEditModal(mapel, hari.hari)}
                                            className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200" title="Edit Pelajaran">
                                            <PencilIcon />
                                        </button>
                                        <button 
                                            onClick={() => handleDeletePelajaran(mapel.id, hari.hari)}
                                            className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors duration-200" title="Hapus Pelajaran">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                          );
                        }) : (
                            <tr>
                                <td colSpan={4} className="text-center py-6 text-gray-500">Tidak ada jadwal untuk hari ini.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        ))}
      </div>
      
       {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" onClick={handleCloseModal}>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleFormSubmit}>
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">{modalMode === 'add' ? 'Tambah Pelajaran Baru' : 'Edit Pelajaran'}</h2>
                            <p className="text-sm text-gray-500">Untuk kelas {selectedKelas} pada hari {currentDay}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label htmlFor="jam" className="block text-sm font-medium text-gray-700">Jam</label>
                                <input type="text" name="jam" id="jam" value={formData.jam} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" placeholder="Contoh: 07:00 - 08:30" required />
                            </div>
                             <div>
                                <label htmlFor="pelajaran" className="block text-sm font-medium text-gray-700">Mata Pelajaran</label>
                                <input type="text" name="pelajaran" id="pelajaran" value={formData.pelajaran} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required />
                            </div>
                             <div>
                                <label htmlFor="guru" className="block text-sm font-medium text-gray-700">Guru</label>
                                <select name="guru" id="guru" value={formData.guru} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500 bg-white" required>
                                    <option value="" disabled>Pilih seorang guru</option>
                                    {mockGuru.map(guru => (
                                        <option key={guru.id} value={guru.nama}>{guru.nama}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-4 rounded-b-xl">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
                                Batal
                            </button>
                            <button type="submit" className="px-4 py-2 bg-madrasah-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-madrasah-green-700 focus:outline-none focus:ring-2 focus:ring-madrasah-green-500 focus:ring-opacity-75">
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Jadwal;