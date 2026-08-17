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
  guru_id: 'GURU-ADMIN',
  nama_lengkap: 'Administrator Sistem',
  nip: '19720415 199802 1 004',
  pangkat_golongan: 'Pembina Utama Muda / IV c',
  jabatan: 'Administrator Sistem & TI',
  mata_pelajaran: 'Teknologi Informasi',
  foto_profil_url: '',
  email: 'admin@sman1tabanan.sch.id',
  telepon: '(0361) 811234',
  kelas_diampu: [],
};

export const initialGuruProfiles: GuruProfile[] = [initialGuruProfile];

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
];

export const initialUserAccount: UserAccount = initialUserAccounts[0];

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

export const initialJadwalList: JadwalMengajar[] = [];

export const initialAbsensiList: AbsensiRecord[] = [];

export const initialJurnalList: JurnalMengajar[] = [];

export const initialPenilaianList: PenilaianRecord[] = [];

export const initialBimbinganList: BimbinganRecord[] = [];

export const initialLogList: LogAktivitas[] = [];

