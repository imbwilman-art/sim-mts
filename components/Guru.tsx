import React, { useState, useMemo, ChangeEvent, FormEvent } from 'react';
import { mockGuru } from '../data/mockData';
import { SearchIcon } from './icons/SearchIcon';
import { PlusIcon } from './icons/PlusIcon';
import { UploadIcon } from './icons/UploadIcon';
import { Guru as GuruType } from '../types';

interface GuruCardProps {
    guru: GuruType;
    onEdit: (guru: GuruType) => void;
    onDelete: (guruId: string) => void;
}

const GuruCard: React.FC<GuruCardProps> = ({ guru, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl shadow-md p-6 transform hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
        <div className="text-center">
            <img className="h-24 w-24 rounded-full object-cover mx-auto" src={guru.foto || 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'} alt={`Foto ${guru.nama}`} />
            <div className="mt-4">
                <p className="text-lg font-semibold text-madrasah-green-800">{guru.nama}</p>
                <p className="text-sm text-gray-500">NIP: {guru.nip}</p>
                <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">Mata Pelajaran:</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {guru.mataPelajaran.map(mapel => (
                            <span key={mapel} className="px-2 py-1 text-xs font-semibold text-madrasah-green-800 bg-madrasah-green-100 rounded-full">
                                {mapel}
                            </span>
                        ))}
                    </div>
                </div>
                 <div className="mt-4 border-t pt-3 text-sm text-gray-600 space-y-1">
                    <p>{guru.email}</p>
                    <p>{guru.telepon}</p>
                </div>
            </div>
        </div>
         <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2">
            <button
                onClick={() => onEdit(guru)}
                className="text-center block bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm w-full"
            >
                Edit
            </button>
            <button
                onClick={() => onDelete(guru.id)}
                className="text-center block bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm w-full"
            >
                Hapus
            </button>
        </div>
    </div>
);


const Guru: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [guruList, setGuruList] = useState<GuruType[]>(mockGuru);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuru, setEditingGuru] = useState<GuruType | null>(null);
    const [importSuccessMessage, setImportSuccessMessage] = useState('');
    const [addSuccessMessage, setAddSuccessMessage] = useState('');
    
    const initialFormState = {
        nama: '',
        nip: '',
        mataPelajaran: '', // Will be comma-separated string
        foto: '',
        email: '',
        telepon: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    const filteredGuru = useMemo(() => {
        return guruList.filter(guru =>
            guru.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guru.nip.includes(searchTerm) ||
            guru.mataPelajaran.some(mapel => mapel.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, guruList]);
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, foto: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingGuru(null);
        setFormData(initialFormState);
    };

    const handleOpenAddModal = () => {
        setEditingGuru(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (guru: GuruType) => {
        setEditingGuru(guru);
        setFormData({
            nama: guru.nama,
            nip: guru.nip,
            mataPelajaran: guru.mataPelajaran.join(', '),
            foto: guru.foto,
            email: guru.email,
            telepon: guru.telepon,
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        const submittedData = {
            nama: formData.nama,
            nip: formData.nip,
            mataPelajaran: formData.mataPelajaran.split(',').map(s => s.trim()).filter(Boolean),
            foto: formData.foto,
            email: formData.email,
            telepon: formData.telepon,
        };

        if (editingGuru) {
            const updatedGuru = { ...editingGuru, ...submittedData };
            setGuruList(prevList =>
                prevList.map(g => (g.id === editingGuru.id ? updatedGuru : g))
            );
            setAddSuccessMessage(`Data guru "${updatedGuru.nama}" berhasil diperbarui.`);
        } else {
            const newGuru: GuruType = {
                ...submittedData,
                id: `g-${Date.now()}`,
            };
            setGuruList(prevList => [newGuru, ...prevList]);
            setAddSuccessMessage(`Data guru "${newGuru.nama}" berhasil ditambahkan.`);
        }
        
        setTimeout(() => setAddSuccessMessage(''), 5000);
        handleCloseModal();
    };

    const handleDeleteGuru = (guruId: string) => {
        const guruToDelete = guruList.find(g => g.id === guruId);
        if (guruToDelete) {
            if (window.confirm(`Apakah Anda yakin ingin menghapus data guru "${guruToDelete.nama}"?`)) {
                setGuruList(currentGuruList => currentGuruList.filter(g => g.id !== guruId));
            }
        }
    };

    const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim() !== '');
                if (lines.length < 2) {
                    alert('File CSV kosong atau hanya berisi header.');
                    return;
                }
                const header = lines[0].split(',').map(h => h.trim());
                const requiredHeaders = ['nama', 'nip', 'mataPelajaran', 'foto', 'email', 'telepon'];
                
                const headerIndices = requiredHeaders.reduce((acc, h) => {
                    acc[h] = header.indexOf(h);
                    return acc;
                }, {} as Record<string, number>);

                if (Object.values(headerIndices).some(index => index === -1)) {
                     alert(`Header CSV tidak valid. Pastikan terdapat kolom: ${requiredHeaders.join(', ')}`);
                     return;
                }

                const newGurus: GuruType[] = [];
                for (let i = 1; i < lines.length; i++) {
                    const data = lines[i].split(',');
                    const guruData: GuruType = {
                        id: `g-import-${Date.now()}-${i}`,
                        nama: data[headerIndices.nama]?.trim() || '',
                        nip: data[headerIndices.nip]?.trim() || '',
                        mataPelajaran: data[headerIndices.mataPelajaran]?.split(';').map(s => s.trim()).filter(Boolean) || [],
                        foto: data[headerIndices.foto]?.trim() || '',
                        email: data[headerIndices.email]?.trim() || '',
                        telepon: data[headerIndices.telepon]?.trim() || '',
                    };
                    if (guruData.nama && guruData.nip) {
                       newGurus.push(guruData);
                    }
                }
                
                setGuruList(prev => [...newGurus, ...prev]);
                setImportSuccessMessage(`${newGurus.length} data guru berhasil diimpor.`);
                setTimeout(() => setImportSuccessMessage(''), 5000);

            } catch (error) {
                console.error("Error parsing CSV:", error);
                alert('Gagal memproses file CSV. Periksa format file Anda.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Data Guru</h1>
                    <p className="mt-1 text-gray-600">Direktori guru dan tenaga pengajar di MTsN 1 Ciamis.</p>
                </div>
                 <div className="flex items-center gap-2">
                    <label htmlFor="csv-upload" className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-madrasah-green-500 focus:ring-opacity-75 transition-colors duration-200 cursor-pointer">
                        <UploadIcon className="h-5 w-5" />
                        <span>Impor CSV</span>
                    </label>
                    <input id="csv-upload" type="file" className="hidden" accept=".csv" onChange={handleFileImport} />

                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-madrasah-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-madrasah-green-700 focus:outline-none focus:ring-2 focus:ring-madrasah-green-500 focus:ring-opacity-75 transition-colors duration-200"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Tambah Guru Baru</span>
                    </button>
                 </div>
            </div>

            {importSuccessMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Sukses</p>
                    <p>{importSuccessMessage}</p>
                </div>
            )}
            
            {addSuccessMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Sukses</p>
                    <p>{addSuccessMessage}</p>
                </div>
            )}

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama, NIP, atau mata pelajaran..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-madrasah-green-500 focus:border-madrasah-green-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuru.length > 0 ? (
                    filteredGuru.map(guru => <GuruCard key={guru.id} guru={guru} onEdit={handleOpenEditModal} onDelete={handleDeleteGuru} />)
                ) : (
                    <p className="text-gray-500 md:col-span-2 lg:col-span-3 text-center py-8">Data guru tidak ditemukan.</p>
                )}
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" onClick={handleCloseModal}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleFormSubmit}>
                            <div className="p-6 border-b">
                                <h2 className="text-2xl font-bold text-gray-800">{editingGuru ? 'Edit Data Guru' : 'Tambah Guru Baru'}</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 flex items-center gap-4">
                                    <img 
                                        src={formData.foto || 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'} 
                                        alt="Foto Guru" 
                                        className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                                    />
                                    <div>
                                        <label htmlFor="foto-upload" className="cursor-pointer mt-1 inline-block bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-madrasah-green-500">
                                            <span>Pilih Foto</span>
                                        </label>
                                        <input id="foto-upload" name="foto" type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, atau GIF.</p>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                    <input type="text" name="nama" id="nama" value={formData.nama} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required />
                                </div>
                                <div>
                                    <label htmlFor="nip" className="block text-sm font-medium text-gray-700">NIP</label>
                                    <input type="text" name="nip" id="nip" value={formData.nip} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required />
                                </div>
                                 <div>
                                    <label htmlFor="telepon" className="block text-sm font-medium text-gray-700">Telepon</label>
                                    <input type="tel" name="telepon" id="telepon" value={formData.telepon} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="mataPelajaran" className="block text-sm font-medium text-gray-700">Mata Pelajaran</label>
                                    <input type="text" name="mataPelajaran" id="mataPelajaran" value={formData.mataPelajaran} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" placeholder="Contoh: Matematika, Fisika" required />
                                    <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma jika lebih dari satu.</p>
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

export default Guru;