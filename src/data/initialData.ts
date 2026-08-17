/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GuruProfile,
  UserAccount,
  Kelas,
  MataPelajaran,
  Siswa,
  JadwalMengajar,
  AbsensiRecord,
  JurnalMengajar,
  PenilaianRecord,
  BimbinganRecord,
  KonfigurasiSekolah,
  LogAktivitas,
} from '../types';

export const initialGuruProfile: GuruProfile = {
  guru_id: 'GURU-001',
  nama_lengkap: 'Drs. Hendra Gunawan, M.Pd.',
  nip: '19820514 200801 1 009',
  pangkat_golongan: 'Pembina / IV a',
  jabatan: 'Guru Ahli Madya / Guru Pembimbing',
  mata_pelajaran: 'Matematika',
  foto_profil_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  email: 'hendra.gunawan@sekolah.sch.id',
  telepon: '0812-3456-7890',
  kelas_diampu: ['KLS-7A', 'KLS-7B'],
};

export const initialGuruProfiles: GuruProfile[] = [
  {
    guru_id: 'GURU-001',
    nama_lengkap: 'Drs. Hendra Gunawan, M.Pd.',
    nip: '19820514 200801 1 009',
    pangkat_golongan: 'Pembina / IV a',
    jabatan: 'Guru Ahli Madya / Guru Pembimbing',
    mata_pelajaran: 'Matematika',
    foto_profil_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    email: 'hendra.gunawan@sekolah.sch.id',
    telepon: '0812-3456-7890',
    kelas_diampu: ['KLS-7A', 'KLS-7B'],
  },
  {
    guru_id: 'GURU-002',
    nama_lengkap: 'Ni Made Ayu Wulandari, S.Pd.',
    nip: '19850312 201001 2 015',
    pangkat_golongan: 'Penata Tk. I / III d',
    jabatan: 'Guru Ahli Muda / Wali Kelas VIII A',
    mata_pelajaran: 'Bahasa Indonesia',
    foto_profil_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    email: 'ayu.wulandari@sekolah.sch.id',
    telepon: '0813-9876-5432',
    kelas_diampu: ['KLS-8A', 'KLS-8B'],
  },
  {
    guru_id: 'GURU-003',
    nama_lengkap: 'I Wayan Sudarma, S.Kom.',
    nip: '19880720 201402 1 003',
    pangkat_golongan: 'Penata / III c',
    jabatan: 'Guru Ahli Muda / Pembina OSIS',
    mata_pelajaran: 'Informatika',
    foto_profil_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    email: 'wayan.sudarma@sekolah.sch.id',
    telepon: '0819-1234-5678',
    kelas_diampu: ['KLS-7A', 'KLS-8A', 'KLS-9A'],
  },
  {
    guru_id: 'GURU-004',
    nama_lengkap: 'Dr. I Gusti Bagus Arya, M.Si.',
    nip: '19790610 200501 1 008',
    pangkat_golongan: 'Pembina Utama Muda / IV c',
    jabatan: 'Guru Ahli Utama / Wakasek Kurikulum',
    mata_pelajaran: 'Fisika',
    foto_profil_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    email: 'gusti.arya@sekolah.sch.id',
    telepon: '0812-7788-9900',
    kelas_diampu: ['KLS-9A', 'KLS-9B'],
  },
];

export const initialUserAccounts: UserAccount[] = [
  {
    user_id: 'USR-ADMIN-01',
    username: 'admin',
    password: 'admin123',
    guru_id: 'GURU-ADMIN',
    role: 'admin',
    nama_guru: 'Administrator Sistem',
    nip: '19720415 199802 1 004',
    email: 'admin@sman1tabanan.sch.id',
    status_aktif: true,
    created_at: '2026-08-01T00:00:00.000Z',
  },
  {
    user_id: 'USR-GURU-01',
    username: 'guru',
    password: 'guru123',
    guru_id: 'GURU-001',
    role: 'guru',
    nama_guru: 'Drs. Hendra Gunawan, M.Pd.',
    nip: '19820514 200801 1 009',
    email: 'hendra.gunawan@sekolah.sch.id',
    status_aktif: true,
    created_at: '2026-08-01T00:00:00.000Z',
    kelas_diampu: ['KLS-7A', 'KLS-7B'],
  },
  {
    user_id: 'USR-GURU-02',
    username: '198503122010012015',
    password: 'guru123',
    guru_id: 'GURU-002',
    role: 'guru',
    nama_guru: 'Ni Made Ayu Wulandari, S.Pd.',
    nip: '19850312 201001 2 015',
    email: 'ayu.wulandari@sekolah.sch.id',
    status_aktif: true,
    created_at: '2026-08-01T00:00:00.000Z',
    kelas_diampu: ['KLS-8A', 'KLS-8B'],
  },
];

export const initialUserAccount: UserAccount = initialUserAccounts[1];

export const initialKonfigurasiSekolah: KonfigurasiSekolah = {
  nama_sekolah: 'SMA NEGERI 1 TABANAN',
  npsn: '50101123',
  alamat_sekolah: 'Jl. Gunung Agung No. 122, Tabanan',
  kelurahan_desa: 'Dajan Peken',
  kecamatan: 'Tabanan',
  kabupaten_kota: 'Kabupaten Tabanan',
  provinsi: 'Bali',
  telepon: '(0361) 811234',
  email: 'info@sman1tabanan.sch.id',
  website: 'https://sman1tabanan.sch.id',
  nama_kepala_sekolah: 'I Wayan Sudarta, S.Pd., M.Pd.',
  nip_kepala_sekolah: '19720415 199802 1 004',
  tahun_ajaran: '2026/2027',
  semester_aktif: 'Ganjil',
  logo_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
  kop_surat_url: '',
  kop_text_baris1: 'PEMERINTAH PROVINSI BALI',
  kop_text_baris2: 'DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA',
  kop_text_baris3: 'SMA NEGERI 1 TABANAN (TERAKREDITASI A)',
  kop_text_baris4: 'Jl. Gunung Agung No. 122, Tabanan, Bali | Telp: (0361) 811234 | Email: info@sman1tabanan.sch.id | NPSN: 50101123',
  kop_logo_kiri_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
};

export const initialKelasList: Kelas[] = [
  {
    kelas_id: 'KLS-10A',
    nama_kelas: 'X A',
    tingkat: 'X',
    tahun_ajaran: '2026/2027',
    jumlah_siswa: 0,
  },
  {
    kelas_id: 'KLS-10B',
    nama_kelas: 'X B',
    tingkat: 'X',
    tahun_ajaran: '2026/2027',
    jumlah_siswa: 0,
  },
  {
    kelas_id: 'KLS-11A',
    nama_kelas: 'XI A',
    tingkat: 'XI',
    tahun_ajaran: '2026/2027',
    jumlah_siswa: 0,
  },
  {
    kelas_id: 'KLS-12A',
    nama_kelas: 'XII A',
    tingkat: 'XII',
    tahun_ajaran: '2026/2027',
    jumlah_siswa: 0,
  },
];

export const initialMapelList: MataPelajaran[] = [
  {
    mapel_id: 'MP-01',
    kode_mapel: 'MAT',
    nama_mapel: 'Matematika',
    tingkat: 'X, XI, XII',
    kkm_default: 75,
  },
  {
    mapel_id: 'MP-02',
    kode_mapel: 'FIS',
    nama_mapel: 'Fisika',
    tingkat: 'X, XI, XII',
    kkm_default: 75,
  },
  {
    mapel_id: 'MP-03',
    kode_mapel: 'BIN',
    nama_mapel: 'Bahasa Indonesia',
    tingkat: 'X, XI, XII',
    kkm_default: 78,
  },
  {
    mapel_id: 'MP-04',
    kode_mapel: 'ING',
    nama_mapel: 'Bahasa Inggris',
    tingkat: 'X, XI, XII',
    kkm_default: 75,
  },
];

export const initialSiswaList: Siswa[] = [];

export const initialJadwalList: JadwalMengajar[] = [
  {
    jadwal_id: 'JDW-01',
    hari: 'Senin',
    mapel_id: 'MP-01',
    nama_mapel: 'Matematika',
    jam_ke: '1,2,3',
    kelas_id: 'KLS-10A',
    nama_kelas: 'X A',
    guru_id: 'GURU-001',
    ruang: 'R. X-A',
  },
  {
    jadwal_id: 'JDW-02',
    hari: 'Senin',
    mapel_id: 'MP-01',
    nama_mapel: 'Matematika',
    jam_ke: '5,6,7',
    kelas_id: 'KLS-10B',
    nama_kelas: 'X B',
    guru_id: 'GURU-001',
    ruang: 'R. X-B',
  },
  {
    jadwal_id: 'JDW-03',
    hari: 'Selasa',
    mapel_id: 'MP-01',
    nama_mapel: 'Matematika',
    jam_ke: '1,2,3',
    kelas_id: 'KLS-11A',
    nama_kelas: 'XI A',
    guru_id: 'GURU-001',
    ruang: 'R. XI-A',
  },
  {
    jadwal_id: 'JDW-04',
    hari: 'Kamis',
    mapel_id: 'MP-01',
    nama_mapel: 'Matematika',
    jam_ke: '1,2,3',
    kelas_id: 'KLS-12A',
    nama_kelas: 'XII A',
    guru_id: 'GURU-001',
    ruang: 'R. XII-A',
  },
];

export const initialAbsensiList: AbsensiRecord[] = [];

export const initialJurnalList: JurnalMengajar[] = [];

export const initialPenilaianList: PenilaianRecord[] = [];

export const initialBimbinganList: BimbinganRecord[] = [];

export const initialLogList: LogAktivitas[] = [];

