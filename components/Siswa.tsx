
import React, { useState, useMemo, ChangeEvent, FormEvent } from 'react';
import { mockSiswa } from '../data/mockData';
import { SearchIcon } from './icons/SearchIcon';
import { PlusIcon } from './icons/PlusIcon';
import { UploadIcon } from './icons/UploadIcon';
import { PrinterIcon } from './icons/PrinterIcon'; // Import the new icon
import { Siswa as SiswaType } from '../types';

interface SiswaCardProps {
    siswa: SiswaType;
    onPhotoChange: (studentId: string, file: File) => void;
    onEdit: (siswa: SiswaType) => void;
    onDelete: (studentId: string) => void;
}

const SiswaCard: React.FC<SiswaCardProps> = ({ siswa, onPhotoChange, onEdit, onDelete }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onPhotoChange(siswa.id, e.target.files[0]);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-4 transform hover:-translate-y-1 transition-transform duration-300 flex items-center justify-between">
            <div className="flex items-center flex-grow">
                <img className="h-16 w-16 rounded-full object-cover" src={siswa.foto || 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'} alt={`Foto ${siswa.nama}`} />
                <div className="ml-4">
                    <div className="text-lg font-bold text-madrasah-green-800">{siswa.nama}</div>
                    <p className="text-gray-500 text-sm">{siswa.kelas}</p>
                    <p className="text-xs text-gray-500">NISN: {siswa.nisn}</p>
                    {siswa.tanggalLulus && (
                        <p className="text-xs text-green-600 font-medium mt-1 bg-green-50 px-2 py-0.5 rounded-full inline-block">
                            Lulus: {new Date(siswa.tanggalLulus).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <label htmlFor={`upload-${siswa.id}`} className="cursor-pointer text-center block bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm">
                    Ganti Foto
                </label>
                <input
                    id={`upload-${siswa.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <button
                    onClick={() => onEdit(siswa)}
                    className="text-center block bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(siswa.id)}
                    className="text-center block bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                >
                    Hapus
                </button>
            </div>
        </div>
    );
};


const Siswa: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('Semua Kelas');
    const [siswaList, setSiswaList] = useState<SiswaType[]>(mockSiswa);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSiswa, setEditingSiswa] = useState<SiswaType | null>(null);
    const [importSuccessMessage, setImportSuccessMessage] = useState('');

    const initialFormState = {
        nama: '',
        nis: '',
        nisn: '',
        kelas: '',
        alamat: '',
        telepon: '',
        namaWali: '',
        foto: '',
        tanggalLulus: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    const handlePhotoChange = (studentId: string, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSiswaList(currentSiswaList =>
                currentSiswaList.map(s =>
                    s.id === studentId ? { ...s, foto: reader.result as string } : s
                )
            );
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    
    const uniqueClasses = useMemo(() => {
        const classes = new Set(siswaList.map(s => s.kelas));
        return ['Semua Kelas', ...Array.from(classes).sort()];
    }, [siswaList]);

    const filteredSiswa = useMemo(() => {
        return siswaList.filter(siswa => {
             const matchesSearch = siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                siswa.nisn.includes(searchTerm);
            
            const matchesClass = classFilter === 'Semua Kelas' || siswa.kelas === classFilter;

            return matchesSearch && matchesClass;
        });
    }, [searchTerm, classFilter, siswaList]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setEditingSiswa(null);
        setFormData(initialFormState);
    };

    const handleOpenAddModal = () => {
        setEditingSiswa(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (siswa: SiswaType) => {
        setEditingSiswa(siswa);
        setFormData({
            nama: siswa.nama,
            nis: siswa.nis,
            nisn: siswa.nisn,
            kelas: siswa.kelas,
            alamat: siswa.alamat,
            telepon: siswa.telepon,
            namaWali: siswa.namaWali,
            foto: siswa.foto,
            tanggalLulus: siswa.tanggalLulus || '',
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        const submittedData = {
            ...formData,
            tanggalLulus: formData.tanggalLulus || undefined, // Set to undefined if empty
        };

        if (editingSiswa) {
            // Update existing student
            setSiswaList(prevList =>
              prevList.map(s =>
                s.id === editingSiswa.id ? { ...editingSiswa, ...submittedData } : s
              )
            );
        } else {
            // Add new student
            const newStudent: SiswaType = {
                ...submittedData,
                id: `new-${Date.now()}`,
            };
            setSiswaList(prevList => [newStudent, ...prevList]);
        }
        handleCloseModal();
    };

    const handleDeleteSiswa = (studentId: string) => {
        const studentToDelete = siswaList.find(s => s.id === studentId);
        if (studentToDelete) {
            if (window.confirm(`Apakah Anda yakin ingin menghapus data siswa "${studentToDelete.nama}"?`)) {
                setSiswaList(currentSiswaList =>
                    currentSiswaList.filter(s => s.id !== studentId)
                );
            }
        }
    };
    
    const handleSiswaFileImport = (e: ChangeEvent<HTMLInputElement>) => {
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
                const requiredHeaders = ['nama', 'nis', 'nisn', 'kelas', 'foto', 'alamat', 'telepon', 'namaWali'];
                
                const headerIndices = requiredHeaders.reduce((acc, h) => {
                    acc[h] = header.indexOf(h);
                    return acc;
                }, {} as Record<string, number>);
                
                const optionalHeaderIndex = header.indexOf('tanggalLulus');

                if (Object.values(headerIndices).some(index => index === -1)) {
                     alert(`Header CSV tidak valid. Pastikan terdapat kolom: ${requiredHeaders.join(', ')}`);
                     return;
                }
                
                const newSiswa: SiswaType[] = [];
                for (let i = 1; i < lines.length; i++) {
                    const data = lines[i].split(',');
                    const siswaData: SiswaType = {
                        id: `s-import-${Date.now()}-${i}`,
                        nama: data[headerIndices.nama]?.trim() || '',
                        nis: data[headerIndices.nis]?.trim() || '',
                        nisn: data[headerIndices.nisn]?.trim() || '',
                        kelas: data[headerIndices.kelas]?.trim() || '',
                        foto: data[headerIndices.foto]?.trim() || '',
                        alamat: data[headerIndices.alamat]?.trim() || '',
                        telepon: data[headerIndices.telepon]?.trim() || '',
                        namaWali: data[headerIndices.namaWali]?.trim() || '',
                        tanggalLulus: optionalHeaderIndex !== -1 && data[optionalHeaderIndex]?.trim() !== '' ? data[optionalHeaderIndex]?.trim() : undefined,
                    };
                    if (siswaData.nama && siswaData.nisn) {
                       newSiswa.push(siswaData);
                    }
                }
                
                setSiswaList(prev => [...newSiswa, ...prev]);
                setImportSuccessMessage(`${newSiswa.length} data siswa berhasil diimpor.`);
                setTimeout(() => setImportSuccessMessage(''), 5000);

            } catch (error) {
                console.error("Error parsing CSV:", error);
                alert('Gagal memproses file CSV. Periksa format file Anda.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleGenerateReport = () => {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Gagal membuka jendela cetak. Pastikan pop-up diizinkan.');
        return;
      }

      const today = new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const reportContent = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Laporan Data Siswa MTsN 1 Ciamis</title>
            <style>
                body { font-family: 'Inter', sans-serif; margin: 20mm; color: #333; }
                @media print {
                    @page { size: A4; margin: 20mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
                h1 { color: #16a34a; text-align: center; margin-bottom: 5px; }
                h2 { text-align: center; font-size: 1.1em; margin-top: 0; margin-bottom: 20px; }
                p.date { text-align: right; font-size: 0.9em; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 0.9em; }
                th { background-color: #f0fdf4; color: #14532d; font-weight: 600; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                tr:hover { background-color: #f1f1f1; }
            </style>
        </head>
        <body>
            <h1>Laporan Data Siswa MTsN 1 Ciamis</h1>
            <h2>${classFilter !== 'Semua Kelas' ? `Kelas: ${classFilter}` : 'Semua Kelas'}</h2>
            <p class="date">Dicetak pada: ${today}</p>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Nama Lengkap</th>
                        <th>NIS</th>
                        <th>NISN</th>
                        <th>Kelas</th>
                        <th>Alamat</th>
                        <th>Telepon</th>
                        <th>Nama Wali</th>
                        <th>Tanggal Lulus</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredSiswa.map((siswa, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${siswa.nama}</td>
                            <td>${siswa.nis}</td>
                            <td>${siswa.nisn}</td>
                            <td>${siswa.kelas}</td>
                            <td>${siswa.alamat}</td>
                            <td>${siswa.telepon}</td>
                            <td>${siswa.namaWali}</td>
                            <td>${siswa.tanggalLulus ? new Date(siswa.tanggalLulus).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
      `;

      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Data Siswa</h1>
                    <p className="mt-1 text-gray-600">Cari dan lihat profil siswa MTsN 1 Ciamis.</p>
                </div>
                <div className="flex items-center gap-2">
                     <label htmlFor="csv-upload-siswa" className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-madrasah-green-500 focus:ring-opacity-75 transition-colors duration-200 cursor-pointer">
                        <UploadIcon className="h-5 w-5" />
                        <span>Impor CSV</span>
                    </label>
                    <input id="csv-upload-siswa" type="file" className="hidden" accept=".csv" onChange={handleSiswaFileImport} />
                    <button
                        onClick={handleGenerateReport}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg shadow-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200"
                        aria-label="Cetak Laporan Data Siswa"
                    >
                        <PrinterIcon className="h-5 w-5" />
                        <span>Cetak Laporan</span>
                    </button>
                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-madrasah-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-madrasah-green-700 focus:outline-none focus:ring-2 focus:ring-madrasah-green-500 focus:ring-opacity-75 transition-colors duration-200"
                        aria-label="Tambah Siswa Baru"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Tambah Siswa Baru</span>
                    </button>
                </div>
            </div>
            
             {importSuccessMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Sukses</p>
                    <p>{importSuccessMessage}</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama atau NISN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-madrasah-green-500 focus:border-madrasah-green-500"
                        aria-label="Cari siswa berdasarkan nama atau NISN"
                    />
                </div>
                <div className="flex-shrink-0">
                    <select
                        aria-label="Filter berdasarkan kelas"
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        className="w-full sm:w-auto h-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-madrasah-green-500 focus:border-madrasah-green-500 bg-white"
                    >
                        {uniqueClasses.map(kelas => (
                            <option key={kelas} value={kelas}>{kelas}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {filteredSiswa.length > 0 ? (
                    filteredSiswa.map(siswa => <SiswaCard key={siswa.id} siswa={siswa} onPhotoChange={handlePhotoChange} onEdit={handleOpenEditModal} onDelete={handleDeleteSiswa} />)
                ) : (
                    <p className="text-gray-500 text-center py-8">Data siswa tidak ditemukan.</p>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" onClick={handleCloseModal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleFormSubmit}>
                            <div className="p-6 border-b">
                                <h2 id="modal-title" className="text-2xl font-bold text-gray-800">{editingSiswa ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 flex items-center gap-4">
                                    <img 
                                        src={formData.foto || 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'} 
                                        alt="Foto Siswa" 
                                        className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                                    />
                                    <div>
                                        <label htmlFor="foto-upload-modal" className="block text-sm font-medium text-gray-700 mb-1">Foto Siswa</label>
                                        <label htmlFor="foto-upload-modal" className="cursor-pointer mt-1 inline-block bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-madrasah-green-500">
                                            <span>Pilih File</span>
                                        </label>
                                        <input id="foto-upload-modal" name="foto" type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, atau GIF.</p>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                    <input type="text" name="nama" id="nama" value={formData.nama} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required aria-required="true" />
                                </div>
                                <div>
                                    <label htmlFor="nis" className="block text-sm font-medium text-gray-700">NIS</label>
                                    <input type="text" name="nis" id="nis" value={formData.nis} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required aria-required="true" />
                                </div>
                                <div>
                                    <label htmlFor="nisn" className="block text-sm font-medium text-gray-700">NISN</label>
                                    <input type="text" name="nisn" id="nisn" value={formData.nisn} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required aria-required="true" />
                                </div>
                                <div>
                                    <label htmlFor="kelas" className="block text-sm font-medium text-gray-700">Kelas</label>
                                    <input type="text" name="kelas" id="kelas" value={formData.kelas} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required aria-required="true" />
                                </div>
                                <div>
                                    <label htmlFor="tanggalLulus" className="block text-sm font-medium text-gray-700">Tanggal Lulus (Opsional)</label>
                                    <input type="date" name="tanggalLulus" id="tanggalLulus" value={formData.tanggalLulus || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" />
                                </div>
                                 <div>
                                    <label htmlFor="telepon" className="block text-sm font-medium text-gray-700">Telepon</label>
                                    <input type="tel" name="telepon" id="telepon" value={formData.telepon} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required aria-required="true" />
                                </div>
                                 <div className="md:col-span-2">
                                    <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
                                    <textarea name="alamat" id="alamat" value={formData.alamat} onChange={handleInputChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required aria-required="true"></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="namaWali" className="block text-sm font-medium text-gray-700">Nama Wali</label>
                                    <input type="text" name="namaWali" id="namaWali" value={formData.namaWali} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required aria-required="true" />
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

export default Siswa;
