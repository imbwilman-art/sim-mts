import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { PhoneIcon } from './icons/PhoneIcon';
import { MailIcon } from './icons/MailIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { UserIcon } from './icons/UserIcon';
import { PencilAltIcon } from './icons/PencilAltIcon';
import { ChatAltDotsIcon } from './icons/ChatAltDotsIcon';
import { PencilIcon } from './icons/PencilIcon';
import { QrcodeIcon } from './icons/QrcodeIcon';
import { CloseIcon } from './icons/MenuIcons';

declare var jsQR: any;

const Kontak: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [contactData, setContactData] = useState({
        alamat: 'Jl. Panyingkiran No. 70, Ciamis, Jawa Barat',
        telepon: '(0265) 771039',
        email: 'info@mtsn1ciamis.sch.id',
    });
    const [editedData, setEditedData] = useState(contactData);
    const [phoneError, setPhoneError] = useState('');

    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        subjek: '',
        pesan: '',
    });
    const [formMessage, setFormMessage] = useState('');

    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scanResult, setScanResult] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const validatePhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^[+]?[\d\s()-]{8,15}$/;
        if (!phoneRegex.test(phone)) {
            setPhoneError('Format nomor telepon tidak valid.');
            return false;
        }
        setPhoneError('');
        return true;
    };

    const handleEdit = () => {
        setEditedData(contactData);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPhoneError('');
    };

    const handleSave = () => {
        if (!validatePhoneNumber(editedData.telepon)) {
            return;
        }
        setContactData(editedData);
        setIsEditing(false);
        setPhoneError('');
    };

    const handleInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
        if (name === 'telepon') {
            validatePhoneNumber(value);
        }
    };
    
    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        setFormMessage('Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.');
        setFormData({ nama: '', email: '', subjek: '', pesan: '' });
        setTimeout(() => setFormMessage(''), 5000);
    }
    
    const stopScanner = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };

    const startScanner = async () => {
        setScanResult(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
                videoRef.current.play();
                requestAnimationFrame(tick);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setScanResult({ type: 'error', message: 'Gagal mengakses kamera. Pastikan Anda telah memberikan izin.' });
            setIsScannerOpen(false);
        }
    };
    
    const tick = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            if (canvasRef.current) {
                const canvas = canvasRef.current.getContext('2d');
                if (canvas) {
                    canvasRef.current.height = videoRef.current.videoHeight;
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvas.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    const imageData = canvas.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: 'dontInvert',
                    });

                    if (code) {
                        setScanResult({ type: 'success', message: `Hasil Pindai: ${code.data}` });
                        setIsScannerOpen(false);
                        return;
                    }
                }
            }
        }
        if (streamRef.current) { // Only continue if stream is supposed to be active
           requestAnimationFrame(tick);
        }
    };

    useEffect(() => {
        if (isScannerOpen) {
            startScanner();
        } else {
            stopScanner();
        }
        return () => stopScanner(); // Cleanup on component unmount
    }, [isScannerOpen]);


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Kontak Sekolah</h1>
                <p className="mt-1 text-gray-600">Hubungi kami melalui informasi di bawah ini atau kirimkan pesan melalui form.</p>
            </div>
            
            {scanResult && (
                <div 
                    className={`p-4 rounded-md flex justify-between items-center ${scanResult.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'} border-l-4`}
                    role="alert"
                >
                    <p>{scanResult.message}</p>
                    <button onClick={() => setScanResult(null)} className="font-bold text-lg">&times;</button>
                </div>
            )}


            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-semibold text-madrasah-green-700">Informasi Sekolah</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsScannerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition-colors duration-200 text-sm">
                            <QrcodeIcon className="h-4 w-4" />
                            <span>Scan QR</span>
                        </button>
                        {!isEditing ? (
                            <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200 text-sm">
                                <PencilIcon className="h-4 w-4" />
                                <span>Edit Informasi</span>
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                 <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm">
                                    Batal
                                </button>
                                <button onClick={handleSave} className="px-4 py-2 bg-madrasah-green-600 text-white font-semibold rounded-lg hover:bg-madrasah-green-700 transition-colors duration-200 text-sm">
                                    Simpan
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-4">
                        <LocationMarkerIcon className="h-8 w-8 text-madrasah-green-600 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-800">Alamat</p>
                            {isEditing ? (
                                <textarea name="alamat" value={editedData.alamat} onChange={handleInfoChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500 text-gray-600 text-sm" />
                            ) : (
                                <p className="text-gray-600 text-sm">{contactData.alamat}</p>
                            )}
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <PhoneIcon className="h-8 w-8 text-madrasah-green-600 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-800">Telepon</p>
                             {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        name="telepon"
                                        value={editedData.telepon}
                                        onChange={handleInfoChange}
                                        className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none text-gray-600 text-sm ${phoneError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-madrasah-green-500 focus:border-madrasah-green-500'}`}
                                        aria-invalid={!!phoneError}
                                        aria-describedby="phone-error"
                                    />
                                    {phoneError && <p id="phone-error" className="mt-1 text-xs text-red-600">{phoneError}</p>}
                                </>
                            ) : (
                                <p className="text-gray-600 text-sm">{contactData.telepon}</p>
                            )}
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <MailIcon className="h-8 w-8 text-madrasah-green-600 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-800">Email</p>
                            {isEditing ? (
                                <input type="email" name="email" value={editedData.email} onChange={handleInfoChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-madrasah-green-500 focus:border-madrasah-green-500 text-gray-600 text-sm" />
                            ) : (
                                <p className="text-gray-600 text-sm">{contactData.email}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                     <h2 className="text-2xl font-semibold text-madrasah-green-700 mb-4">Kirim Pesan</h2>
                     <form onSubmit={handleFormSubmit} className="space-y-4">
                        {formMessage && <div className="p-3 bg-green-100 text-green-800 rounded-lg text-sm">{formMessage}</div>}
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="text" name="nama" placeholder="Nama Lengkap" value={formData.nama} onChange={handleFormChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MailIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="email" name="email" placeholder="Alamat Email" value={formData.email} onChange={handleFormChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required />
                        </div>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <PencilAltIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="text" name="subjek" placeholder="Subjek" value={formData.subjek} onChange={handleFormChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required />
                        </div>
                        <div className="relative">
                            <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                                <ChatAltDotsIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <textarea name="pesan" placeholder="Pesan Anda" rows={5} value={formData.pesan} onChange={handleFormChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-madrasah-green-500 focus:border-madrasah-green-500" required></textarea>
                        </div>
                         <button type="submit" className="w-full px-4 py-2 bg-madrasah-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-madrasah-green-700 focus:outline-none focus:ring-2 focus:ring-madrasah-green-500 focus:ring-opacity-75 transition-colors duration-200">
                            Kirim Pesan
                        </button>
                     </form>
                </div>
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-madrasah-green-700 mb-6">Peta Lokasi</h2>
                    <div className="relative rounded-lg overflow-hidden ring-1 ring-black ring-opacity-5" style={{ paddingTop: '75%' }}>
                        <iframe
                            key={contactData.alamat}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(contactData.alamat)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            title="Peta Lokasi MTsN 1 Ciamis"
                        ></iframe>
                    </div>
                     <div className="mt-4">
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contactData.alamat)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full px-4 py-2 bg-madrasah-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-madrasah-green-700 focus:outline-none focus:ring-2 focus:ring-madrasah-green-500 focus:ring-opacity-75 transition-colors duration-200"
                        >
                            <LocationMarkerIcon className="h-5 w-5 mr-2" />
                            Dapatkan Petunjuk Arah
                        </a>
                    </div>
                </div>
            </div>
            {isScannerOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center p-4">
                     <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-4">
                        <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">Pindai QR Code</h3>
                        <p className="text-sm text-center text-gray-500 mb-4">Arahkan kamera ke QR code</p>
                        <div className="relative w-full" style={{paddingTop: '100%'}}>
                             <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover rounded-lg" playsInline></video>
                              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                 <div className="w-2/3 h-2/3 border-4 border-white border-dashed rounded-lg opacity-75"></div>
                             </div>
                        </div>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                        <button 
                            onClick={() => setIsScannerOpen(false)} 
                            className="mt-4 w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors duration-200"
                        >
                            Batal
                        </button>
                     </div>
                 </div>
            )}
        </div>
    );
};

export default Kontak;