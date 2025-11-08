import React, { useState, ChangeEvent, FormEvent, useMemo } from 'react';
import { mockPengumuman } from '../data/mockData';
import { Pengumuman as PengumumanType } from '../types';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

const Pengumuman: React.FC = () => {
  const [pengumumanList, setPengumumanList] = useState<PengumumanType[]>(mockPengumuman);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPengumuman, setEditingPengumuman] = useState<PengumumanType | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');

  const availableCategories = useMemo(() => {
    const categories = new Set(pengumumanList.map(p => p.kategori));
    return ['Semua Kategori', ...Array.from(categories).sort()];
  }, [pengumumanList]);

  const filteredPengumuman = useMemo(() => {
    return pengumumanList.filter(p => 
      categoryFilter === 'Semua Kategori' || p.kategori === categoryFilter
    );
  }, [pengumumanList, categoryFilter]);

  const initialFormState = { judul: '', isi: '', penulis: '', kategori: '' };
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAddModal = () => {
    setEditingPengumuman(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pengumuman: PengumumanType) => {
    setEditingPengumuman(pengumuman);
    setFormData({
      judul: pengumuman.judul,
      isi: pengumuman.isi,
      penulis: pengumuman.penulis,
      kategori: pengumuman.kategori,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPengumuman(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingPengumuman) {
      // Update existing announcement
      setPengumumanList(prevList =>
        prevList.map(p =>
          p.id === editingPengumuman.id
            ? {
                ...editingPengumuman,
                ...formData,
                tanggal: new Date().toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
              }
            : p
        )
      );
    } else {
      // Add new announcement
      const newPengumuman: PengumumanType = {
        id: `p-${Date.now()}`,
        ...formData,
        tanggal: new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
      setPengumumanList(prevList => [newPengumuman, ...prevList]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const pengumumanToDelete = pengumumanList.find(p => p.id === id);
    if (pengumumanToDelete && window.confirm(`Apakah Anda yakin ingin menghapus pengumuman "${pengumumanToDelete.judul}"?`)) {
      setPengumumanList(prevList => prevList.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pengumuman</h1>
          <p className="mt-1 text-gray-600">Informasi dan pengumuman terbaru dari MTsN 1 Ciamis.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-madrasah-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-madrasah-green-700 focus:outline-none focus:ring-2 focus:ring-madrasah-green-500 focus:ring-opacity-75 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tambah Pengumuman</span>
        </button>
      </div>

      <div className="flex justify-end">
        <select
          aria-label="Filter berdasarkan kategori"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-madrasah-green-500 focus:border-madrasah-green-500 bg-white"
        >
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {filteredPengumuman.length > 0 ? (
          filteredPengumuman.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-madrasah-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{item.judul}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.tanggal} - oleh {item.penulis}
                  </p>
                  <span className="mt-2 inline-block px-3 py-1 text-xs font-semibold text-madrasah-green-800 bg-madrasah-green-100 rounded-full">
                    {item.kategori}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button onClick={() => handleOpenEditModal(item)} className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200" title="Edit Pengumuman">
                        <PencilIcon />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors duration-200" title="Hapus Pengumuman">
                        <TrashIcon />
                    </button>
                </div>
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.isi}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">Tidak ada pengumuman yang ditemukan untuk kategori ini.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleFormSubmit}>
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{editingPengumuman ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="judul" className="block text-sm font-medium text-gray-700">Judul</label>
                  <input type="text" name="judul" id="judul" value={formData.judul} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required />
                </div>
                <div>
                  <label htmlFor="penulis" className="block text-sm font-medium text-gray-700">Penulis</label>
                  <input type="text" name="penulis" id="penulis" value={formData.penulis} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required />
                </div>
                <div>
                  <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori</label>
                  <select name="kategori" id="kategori" value={formData.kategori} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500 bg-white" required>
                    <option value="" disabled>Pilih Kategori</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Informasi Umum">Informasi Umum</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Kurikulum">Kurikulum</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="isi" className="block text-sm font-medium text-gray-700">Isi Pengumuman</label>
                  <textarea name="isi" id="isi" value={formData.isi} onChange={handleInputChange} rows={6} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required></textarea>
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

export default Pengumuman;