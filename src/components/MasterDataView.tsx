/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  School,
  BookOpen,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Kelas, MataPelajaran, Siswa } from '../types';
import { apiService } from '../services/apiService';

export const MasterDataView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'siswa' | 'kelas' | 'mapel'>('siswa');
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [mapelList, setMapelList] = useState<MataPelajaran[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State for Siswa
  const [isSiswaModalOpen, setIsSiswaModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [siswaForm, setSiswaForm] = useState<Partial<Siswa>>({
    nis: '',
    nama_lengkap: '',
    jenis_kelamin: 'L',
    kelas_id: '',
    status: 'Aktif',
  });

  // Modal State for Kelas
  const [isKelasModalOpen, setIsKelasModalOpen] = useState(false);
  const [kelasForm, setKelasForm] = useState<Partial<Kelas>>({
    kelas_id: '',
    nama_kelas: '',
    tingkat: 'VII',
    tahun_ajaran: '2026/2027',
  });

  // Modal State for Mapel
  const [isMapelModalOpen, setIsMapelModalOpen] = useState(false);
  const [editingMapel, setEditingMapel] = useState<MataPelajaran | null>(null);
  const [mapelForm, setMapelForm] = useState<Partial<MataPelajaran>>({
    mapel_id: '',
    kode_mapel: '',
    nama_mapel: '',
    tingkat: 'VII, VIII, IX',
    kkm_default: 75,
  });

  // Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importTargetKelas, setImportTargetKelas] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [k, m, s] = await Promise.all([
        apiService.getKelasList(),
        apiService.getMapelList(),
        apiService.getSiswaList(),
      ]);
      setKelasList(k);
      setMapelList(m);
      setSiswaList(s);
      if (k.length > 0 && !importTargetKelas) {
        setImportTargetKelas(k[0].kelas_id);
        setSiswaForm((prev) => ({ ...prev, kelas_id: k[0].kelas_id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- SISWA HANDLERS ---
  const handleOpenAddSiswa = () => {
    setEditingSiswa(null);
    setSiswaForm({
      nis: '',
      nama_lengkap: '',
      jenis_kelamin: 'L',
      kelas_id: selectedKelasFilter !== 'ALL' ? selectedKelasFilter : kelasList[0]?.kelas_id || '',
      status: 'Aktif',
    });
    setIsSiswaModalOpen(true);
  };

  const handleOpenEditSiswa = (siswa: Siswa) => {
    setEditingSiswa(siswa);
    setSiswaForm({ ...siswa });
    setIsSiswaModalOpen(true);
  };

  const handleSaveSiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siswaForm.nis || !siswaForm.nama_lengkap || !siswaForm.kelas_id) {
      showToast('NIS, Nama Lengkap, dan Kelas wajib diisi', 'error');
      return;
    }

    const payload: Siswa = {
      siswa_id: editingSiswa?.siswa_id || `SIS-${siswaForm.kelas_id}-${siswaForm.nis}`,
      nis: siswaForm.nis,
      nama_lengkap: siswaForm.nama_lengkap,
      jenis_kelamin: (siswaForm.jenis_kelamin as 'L' | 'P') || 'L',
      kelas_id: siswaForm.kelas_id,
      status: (siswaForm.status as any) || 'Aktif',
    };

    const res = await apiService.saveSiswa(payload);
    if (res.success) {
      showToast(res.message);
      setIsSiswaModalOpen(false);
      loadAllData();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleDeleteSiswa = async (siswaId: string, nama: string) => {
    if (confirm(`Yakin ingin menghapus data siswa "${nama}"?`)) {
      const res = await apiService.deleteSiswa(siswaId);
      if (res.success) {
        showToast(res.message);
        loadAllData();
      }
    }
  };

  // --- KELAS HANDLERS ---
  const handleSaveKelas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kelasForm.nama_kelas) {
      showToast('Nama kelas wajib diisi', 'error');
      return;
    }
    const cleanId = kelasForm.kelas_id || `KLS-${kelasForm.nama_kelas.replace(/\s+/g, '')}`;
    const payload: Kelas = {
      kelas_id: cleanId,
      nama_kelas: kelasForm.nama_kelas,
      tingkat: kelasForm.tingkat || 'VII',
      tahun_ajaran: kelasForm.tahun_ajaran || '2026/2027',
    };
    const res = await apiService.saveKelas(payload);
    if (res.success) {
      showToast(res.message);
      setIsKelasModalOpen(false);
      loadAllData();
    }
  };

  const handleDeleteKelas = async (kelasId: string) => {
    if (confirm(`Yakin ingin menghapus kelas ini? Siswa yang terkait tidak akan terhapus otomatis.`)) {
      const res = await apiService.deleteKelas(kelasId);
      if (res.success) {
        showToast(res.message);
        loadAllData();
      }
    }
  };

  // --- MAPEL HANDLERS ---
  const handleOpenAddMapel = () => {
    setEditingMapel(null);
    setMapelForm({
      mapel_id: '',
      kode_mapel: '',
      nama_mapel: '',
      tingkat: 'VII, VIII, IX',
      kkm_default: 75,
    });
    setIsMapelModalOpen(true);
  };

  const handleOpenEditMapel = (m: MataPelajaran) => {
    setEditingMapel(m);
    setMapelForm({
      mapel_id: m.mapel_id,
      kode_mapel: m.kode_mapel,
      nama_mapel: m.nama_mapel,
      tingkat: m.tingkat,
      kkm_default: m.kkm_default,
    });
    setIsMapelModalOpen(true);
  };

  const handleSaveMapel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapelForm.nama_mapel || !mapelForm.kode_mapel) {
      showToast('Kode dan Nama Mapel wajib diisi', 'error');
      return;
    }
    const cleanId = editingMapel?.mapel_id || mapelForm.mapel_id || `MP-${mapelForm.kode_mapel.toUpperCase().replace(/\s+/g, '')}`;
    const payload: MataPelajaran = {
      mapel_id: cleanId,
      kode_mapel: mapelForm.kode_mapel.toUpperCase(),
      nama_mapel: mapelForm.nama_mapel,
      tingkat: mapelForm.tingkat || 'VII, VIII, IX',
      kkm_default: Number(mapelForm.kkm_default) || 75,
    };
    const res = await apiService.saveMapel(payload);
    if (res.success) {
      showToast(res.message);
      setIsMapelModalOpen(false);
      loadAllData();
    }
  };

  const handleDeleteMapel = async (mapelId: string, namaMapel: string) => {
    if (confirm(`Yakin ingin menghapus mata pelajaran "${namaMapel}"?`)) {
      const res = await apiService.deleteMapel(mapelId);
      if (res.success) {
        showToast(res.message);
        loadAllData();
      }
    }
  };

  // --- BATCH IMPORT SISWA ---
  const handleBatchImport = async () => {
    if (!importText.trim() || !importTargetKelas) {
      showToast('Silakan pilih kelas dan masukkan teks data siswa', 'error');
      return;
    }

    const lines = importText.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsed: Siswa[] = [];

    lines.forEach((line) => {
      // Supports tab-separated or comma-separated: NIS, Nama Lengkap, JK (L/P)
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      if (parts.length >= 2) {
        const nis = parts[0].trim();
        const nama = parts[1].trim();
        const jk = parts[2]?.trim().toUpperCase().startsWith('P') ? 'P' : 'L';

        if (nis && nama) {
          parsed.push({
            siswa_id: `SIS-${importTargetKelas}-${nis}`,
            nis,
            nama_lengkap: nama,
            jenis_kelamin: jk,
            kelas_id: importTargetKelas,
            status: 'Aktif',
          });
        }
      }
    });

    if (parsed.length === 0) {
      showToast('Tidak ada data siswa yang valid dalam format yang dimasukkan', 'error');
      return;
    }

    const res = await apiService.importSiswaBatch(parsed);
    if (res.success) {
      showToast(res.message);
      setIsImportModalOpen(false);
      setImportText('');
      loadAllData();
    }
  };

  // Filtered Siswa
  const filteredSiswa = siswaList.filter((s) => {
    const matchKelas = selectedKelasFilter === 'ALL' || s.kelas_id === selectedKelasFilter;
    const matchQuery =
      !searchQuery ||
      s.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery);
    return matchKelas && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 shadow-md ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border border-rose-300 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Data Master & Peserta Didik
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data terpusat master kelas, mata pelajaran, dan biodata siswa (Google Sheets DB)
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('siswa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'siswa'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Data Siswa ({siswaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kelas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'kelas'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Master Kelas ({kelasList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mapel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'mapel'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mata Pelajaran ({mapelList.length})</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: DATA SISWA --- */}
      {activeTab === 'siswa' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* Filter Kelas */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Filter className="w-3.5 h-3.5 text-teal-600" />
                <span>Kelas:</span>
              </div>
              <select
                value={selectedKelasFilter}
                onChange={(e) => setSelectedKelasFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:outline-hidden font-medium"
              >
                <option value="ALL">Semua Kelas ({siswaList.length} Siswa)</option>
                {kelasList.map((k) => (
                  <option key={k.kelas_id} value={k.kelas_id}>
                    Kelas {k.nama_kelas} ({k.jumlah_siswa || 0} Siswa)
                  </option>
                ))}
              </select>

              {/* Search Box */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari NIS / Nama Siswa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-3 py-1.5 rounded-lg border border-teal-600 text-teal-700 hover:bg-teal-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Nama Siswa</span>
              </button>

              <button
                onClick={handleOpenAddSiswa}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Siswa</span>
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">NIS</th>
                    <th className="py-3 px-4">Nama Lengkap Siswa</th>
                    <th className="py-3 px-4 text-center">L/P</th>
                    <th className="py-3 px-4">Kelas</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSiswa.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Tidak ada data siswa ditemukan untuk kriteria ini.
                      </td>
                    </tr>
                  ) : (
                    filteredSiswa.map((siswa, idx) => (
                      <tr key={siswa.siswa_id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 text-center font-medium text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-800">
                          <div>{siswa.nis}</div>
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {siswa.nama_lengkap}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-block w-5 h-5 rounded-full text-[10px] font-bold leading-5 text-center ${
                              siswa.jenis_kelamin === 'L'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-pink-100 text-pink-800'
                            }`}
                          >
                            {siswa.jenis_kelamin}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
                            Kelas {siswa.nama_kelas || siswa.kelas_id}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {siswa.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditSiswa(siswa)}
                              className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-md transition-colors"
                              title="Edit Siswa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSiswa(siswa.siswa_id, siswa.nama_lengkap)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Hapus Siswa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: MASTER KELAS --- */}
      {activeTab === 'kelas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Daftar ruang rombongan belajar (Rombel) yang terdaftar pada tahun ajaran aktif.
            </p>
            <button
              onClick={() => {
                setKelasForm({
                  kelas_id: '',
                  nama_kelas: '',
                  tingkat: 'VII',
                  tahun_ajaran: '2026/2027',
                });
                setIsKelasModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kelas</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kelasList.map((k) => (
              <div key={k.kelas_id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                    Tingkat {k.tingkat}
                  </span>
                  <button
                    onClick={() => handleDeleteKelas(k.kelas_id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Hapus Kelas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-bold text-slate-900">Kelas {k.nama_kelas}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Jumlah: <span className="font-bold text-teal-700">{k.jumlah_siswa || 0} Siswa</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tahun Ajaran: {k.tahun_ajaran}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  ID: {k.kelas_id}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: MATA PELAJARAN --- */}
      {activeTab === 'mapel' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Daftar mata pelajaran kurikulum dan batas KKM kelulusan standar.
            </p>
            <button
              onClick={handleOpenAddMapel}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Mapel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mapelList.map((m) => (
              <div key={m.mapel_id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {m.kode_mapel}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        KKM: {m.kkm_default}
                      </span>
                      <button
                        onClick={() => handleOpenEditMapel(m)}
                        className="p-1 text-slate-400 hover:text-teal-600 rounded transition-colors"
                        title="Edit Mata Pelajaran"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMapel(m.mapel_id, m.nama_mapel)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Hapus Mata Pelajaran"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2">{m.nama_mapel}</h3>
                  <p className="text-xs text-slate-500 mt-1">Sasaran: Tingkat {m.tingkat}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>ID: {m.mapel_id}</span>
                  <button
                    onClick={() => handleOpenEditMapel(m)}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL ADD / EDIT SISWA --- */}
      {isSiswaModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              {editingSiswa ? 'Edit Biodata Siswa' : 'Tambah Siswa Baru'}
            </h2>
            <form onSubmit={handleSaveSiswa} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Induk Siswa (NIS) *</label>
                <input
                  type="text"
                  required
                  value={siswaForm.nis}
                  onChange={(e) => setSiswaForm({ ...siswaForm, nis: e.target.value })}
                  placeholder="Contoh: 260101"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  value={siswaForm.nama_lengkap}
                  onChange={(e) => setSiswaForm({ ...siswaForm, nama_lengkap: e.target.value })}
                  placeholder="Nama sesuai akta / raport"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={siswaForm.jenis_kelamin}
                    onChange={(e) => setSiswaForm({ ...siswaForm, jenis_kelamin: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas *</label>
                  <select
                    required
                    value={siswaForm.kelas_id}
                    onChange={(e) => setSiswaForm({ ...siswaForm, kelas_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    {kelasList.map((k) => (
                      <option key={k.kelas_id} value={k.kelas_id}>
                        Kelas {k.nama_kelas}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSiswaModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL BATCH IMPORT SISWA --- */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Import Massal Nama Siswa
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Salin data dari Excel/Spreadsheet (Format baris: <span className="font-mono font-bold">NIS, Nama Lengkap, JK (L/P)</span>).
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Kelas Import *</label>
                <select
                  value={importTargetKelas}
                  onChange={(e) => setImportTargetKelas(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden font-medium"
                >
                  {kelasList.map((k) => (
                    <option key={k.kelas_id} value={k.kelas_id}>
                      Kelas {k.nama_kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Data Teks Siswa (Tiap Baris Satu Siswa)</label>
                <textarea
                  rows={6}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={`Contoh:\n260120, Muhammad Farhan, L\n260121, Nadya Salsabila, P\n260122, Rian Pratama, L`}
                  className="w-full p-3 font-mono text-xs border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleBatchImport}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
                >
                  Proses Import Batch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TAMBAH KELAS --- */}
      {isKelasModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">Tambah Kelas Baru</h2>
            <form onSubmit={handleSaveKelas} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kelas *</label>
                <input
                  type="text"
                  required
                  value={kelasForm.nama_kelas}
                  onChange={(e) => setKelasForm({ ...kelasForm, nama_kelas: e.target.value })}
                  placeholder="Contoh: VII C / VIII B"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat</label>
                  <select
                    value={kelasForm.tingkat}
                    onChange={(e) => setKelasForm({ ...kelasForm, tingkat: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="VII">VII</option>
                    <option value="VIII">VIII</option>
                    <option value="IX">IX</option>
                    <option value="X">X</option>
                    <option value="XI">XI</option>
                    <option value="XII">XII</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={kelasForm.tahun_ajaran}
                    onChange={(e) => setKelasForm({ ...kelasForm, tahun_ajaran: e.target.value })}
                    placeholder="2026/2027"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsKelasModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-teal-600 text-white rounded-lg font-semibold"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL TAMBAH / EDIT MAPEL --- */}
      {isMapelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              {editingMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
            </h2>
            <form onSubmit={handleSaveMapel} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Mapel *</label>
                <input
                  type="text"
                  required
                  value={mapelForm.kode_mapel}
                  onChange={(e) => setMapelForm({ ...mapelForm, kode_mapel: e.target.value })}
                  placeholder="Contoh: IPA / MAT / PJOK"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  value={mapelForm.nama_mapel}
                  onChange={(e) => setMapelForm({ ...mapelForm, nama_mapel: e.target.value })}
                  placeholder="Contoh: Pendidikan Pancasila"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sasaran Tingkat</label>
                  <input
                    type="text"
                    value={mapelForm.tingkat}
                    onChange={(e) => setMapelForm({ ...mapelForm, tingkat: e.target.value })}
                    placeholder="VII, VIII, IX"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">KKM Default</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={mapelForm.kkm_default}
                    onChange={(e) => setMapelForm({ ...mapelForm, kkm_default: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsMapelModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-teal-600 text-white rounded-lg font-semibold"
                >
                  {editingMapel ? 'Perbarui Mapel' : 'Simpan Mapel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
