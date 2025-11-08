export type Page = 'dashboard' | 'siswa' | 'guru' | 'jadwal' | 'pengumuman' | 'galeri' | 'kontak';

export interface Siswa {
  id: string;
  nama: string;
  nis: string;
  nisn: string;
  kelas: string;
  alamat: string;
  telepon: string;
  namaWali: string;
  foto: string;
  tanggalLulus?: string;
}

export interface Guru {
  id: string;
  nama: string;
  nip: string;
  mataPelajaran: string[];
  foto: string;
  email: string;
  telepon: string;
}

export interface MataPelajaran {
  id: string;
  jam: string;
  pelajaran: string;
  guru: string;
}

export interface JadwalPelajaran {
  hari: string;
  pelajaran: MataPelajaran[];
}

export interface Jadwal {
  [kelas: string]: JadwalPelajaran[];
}

export interface Reminder {
  id: string;
  pelajaran: string;
  guru: string;
  jam: string;
  hari: string;
  kelas: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  penulis: string;
  tanggal: string;
  kategori: string;
}

export interface GaleriFoto {
  id: string;
  src: string;
  caption: string;
}