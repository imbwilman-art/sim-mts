import React, { useState, ChangeEvent, FormEvent } from 'react';
import { mockGaleri } from '../data/mockData';
import { GaleriFoto } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

const Galeri: React.FC = () => {
  const [photos, setPhotos] = useState<GaleriFoto[]>(mockGaleri);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GaleriFoto | null>(null);

  const initialFormState = { src: '', caption: '' };
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAddModal = () => {
    setEditingPhoto(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (photo: GaleriFoto) => {
    setEditingPhoto(photo);
    setFormData({ src: photo.src, caption: photo.caption });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPhoto(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, src: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.src || !formData.caption) {
      alert('Silakan unggah gambar dan isi keterangannya.');
      return;
    }

    if (editingPhoto) {
      setPhotos(prevPhotos =>
        prevPhotos.map(p => (p.id === editingPhoto.id ? { ...editingPhoto, ...formData } : p))
      );
    } else {
      const newPhoto: GaleriFoto = {
        id: `gal-${Date.now()}`,
        ...formData,
      };
      setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const photoToDelete = photos.find(p => p.id === id);
    if (photoToDelete && window.confirm(`Apakah Anda yakin ingin menghapus foto "${photoToDelete.caption}"?`)) {
      setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Galeri Kegiatan</h1>
          <p className="mt-1 text-gray-600">Dokumentasi berbagai kegiatan dan acara di MTsN 1 Ciamis.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-madrasah-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-madrasah-green-700 focus:outline-none focus:ring-2 focus:ring-madrasah-green-500 focus:ring-opacity-75 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tambah Foto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map(foto => (
          <div key={foto.id} className="group relative overflow-hidden rounded-xl shadow-lg">
            <img 
              src={foto.src} 
              alt={foto.caption} 
              className="w-full h-60 object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-white font-semibold text-lg">{foto.caption}</h3>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
              <button onClick={() => handleOpenEditModal(foto)} className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors" title="Edit">
                <PencilIcon />
              </button>
              <button onClick={() => handleDelete(foto.id)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors" title="Hapus">
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
         {photos.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-10">Belum ada foto di galeri.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{editingPhoto ? 'Edit Foto' : 'Tambah Foto Baru'}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pratinjau Gambar</label>
                  <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed">
                    {formData.src ? (
                      <img src={formData.src} alt="Pratinjau" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-gray-400">Pilih gambar</span>
                    )}
                  </div>
                </div>
                <div>
                    <label htmlFor="image-upload" className="cursor-pointer mt-1 inline-block bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-madrasah-green-500">
                        <span>Pilih File Gambar</span>
                    </label>
                    <input id="image-upload" name="image" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </div>
                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Keterangan (Caption)</label>
                  <input type="text" name="caption" id="caption" value={formData.caption} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required />
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

export default Galeri;