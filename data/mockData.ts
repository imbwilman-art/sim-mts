import { Siswa, Guru, Jadwal, Pengumuman, GaleriFoto } from '../types';

export const mockSiswa: Siswa[] = [
  { id: 's1', nama: 'Ahmad Abdullah', nis: '12345', nisn: '0012345678', kelas: 'IX A', alamat: 'Jl. Merdeka No. 1', telepon: '081234567890', namaWali: 'Budi Abdullah', foto: 'https://i.pravatar.cc/150?u=s1' },
  { id: 's2', nama: 'Budi Santoso', nis: '12346', nisn: '0023456789', kelas: 'IX B', alamat: 'Jl. Pahlawan No. 2', telepon: '081234567891', namaWali: 'Joko Santoso', foto: 'https://i.pravatar.cc/150?u=s2' },
  { id: 's3', nama: 'Citra Lestari', nis: '12347', nisn: '0034567890', kelas: 'VIII A', alamat: 'Jl. Sudirman No. 3', telepon: '081234567892', namaWali: 'Dewi Lestari', foto: 'https://i.pravatar.cc/150?u=s3', tanggalLulus: '2023-06-10' },
  { id: 's4', nama: 'Dewi Anggraini', nis: '12348', nisn: '0045678901', kelas: 'VII C', alamat: 'Jl. Gatot Subroto No. 4', telepon: '081234567893', namaWali: 'Eko Anggraini', foto: 'https://i.pravatar.cc/150?u=s4' },
];

export const mockGuru: Guru[] = [
  { id: 'g1', nama: 'Dr. H. Agus Salim', nip: '197001012000011001', mataPelajaran: ['Matematika', 'Fisika'], foto: 'https://i.pravatar.cc/150?u=g1', email: 'agus.salim@sekolah.id', telepon: '081122334455' },
  { id: 'g2', nama: 'Dra. Siti Aminah', nip: '197502022001022002', mataPelajaran: ['Bahasa Indonesia'], foto: 'https://i.pravatar.cc/150?u=g2', email: 'siti.aminah@sekolah.id', telepon: '081122334466' },
  { id: 'g3', nama: 'Bambang Pamungkas, S.Pd.', nip: '198003032005031003', mataPelajaran: ['Pendidikan Jasmani'], foto: 'https://i.pravatar.cc/150?u=g3', email: 'bambang.p@sekolah.id', telepon: '081122334477' },
  { id: 'g4', nama: 'Sri Mulyani, S.Ag.', nip: '197804042003042004', mataPelajaran: ['Pendidikan Agama Islam', 'SKI'], foto: 'https://i.pravatar.cc/150?u=g4', email: 'sri.mulyani@sekolah.id', telepon: '081122334488' },
];

export const mockJadwal: Jadwal = {
  'IX A': [
    {
      hari: 'Senin',
      pelajaran: [
        { id: 'm1', jam: '07:00 - 08:30', pelajaran: 'Matematika', guru: 'Dr. H. Agus Salim' },
        { id: 'm2', jam: '08:30 - 10:00', pelajaran: 'Bahasa Indonesia', guru: 'Dra. Siti Aminah' },
      ],
    },
    {
      hari: 'Selasa',
      pelajaran: [
        { id: 'm3', jam: '07:00 - 08:30', pelajaran: 'Pendidikan Jasmani', guru: 'Bambang Pamungkas, S.Pd.' },
      ],
    },
  ],
  'IX B': [
    {
      hari: 'Senin',
      pelajaran: [
        { id: 'm4', jam: '07:00 - 08:30', pelajaran: 'Bahasa Indonesia', guru: 'Dra. Siti Aminah' },
        { id: 'm5', jam: '08:30 - 10:00', pelajaran: 'Matematika', guru: 'Dr. H. Agus Salim' },
      ],
    },
  ],
};

export const mockPengumuman: Pengumuman[] = [
  { id: 'p1', judul: 'Pelaksanaan Ujian Akhir Semester', isi: 'Diberitahukan kepada seluruh siswa bahwa Ujian Akhir Semester (UAS) akan dilaksanakan pada tanggal 1 - 7 Juni 2024. Harap mempersiapkan diri dengan baik.', penulis: 'Kepala Sekolah', tanggal: '20 Mei 2024', kategori: 'Akademik' },
  { id: 'p2', judul: 'Kegiatan Class Meeting', isi: 'Setelah UAS, akan diadakan kegiatan Class Meeting pada tanggal 8 - 10 Juni 2024. Akan ada berbagai perlombaan antar kelas. Segera daftarkan kelasmu!', penulis: 'OSIS MTsN 1 Ciamis', tanggal: '22 Mei 2024', kategori: 'Kegiatan' },
  { id: 'p3', judul: 'Pengambilan Raport', isi: 'Pengambilan raport semester genap akan dilaksanakan pada tanggal 15 Juni 2024 pukul 08:00 - 12:00 WIB. Mohon kehadiran orang tua/wali.', penulis: 'Tata Usaha', tanggal: '1 Juni 2024', kategori: 'Informasi Umum' },
  { id: 'p4', judul: 'Lomba Kebersihan Kelas', isi: 'Dalam rangka menjaga kebersihan lingkungan sekolah, akan diadakan Lomba Kebersihan Kelas mulai tanggal 10 Juni 2024. Hadiah menarik menanti!', penulis: 'Kesiswaan', tanggal: '5 Juni 2024', kategori: 'Kesiswaan' },
];

export const mockGaleri: GaleriFoto[] = [
    { id: 'gal1', src: 'https://picsum.photos/seed/picsum1/400/300', caption: 'Upacara Bendera Hari Kemerdekaan' },
    { id: 'gal2', src: 'https://picsum.photos/seed/picsum2/400/300', caption: 'Lomba Cerdas Cermat Tingkat Kabupaten' },
    { id: 'gal3', src: 'https://picsum.photos/seed/picsum3/400/300', caption: 'Kegiatan Pramuka Perkemahan Sabtu Minggu' },
    { id: 'gal4', src: 'https://picsum.photos/seed/picsum4/400/300', caption: 'Pentas Seni Akhir Tahun Ajaran' },
    { id: 'gal5', src: 'https://picsum.photos/seed/picsum5/400/300', caption: 'Kerja Bakti Membersihkan Lingkungan Sekolah' },
    { id: 'gal6', src: 'https://picsum.photos/seed/picsum6/400/300', caption: 'Wisuda dan Pelepasan Siswa Kelas IX' },
];