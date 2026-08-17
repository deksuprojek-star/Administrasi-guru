/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  Calendar,
  School,
  User,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  HeartHandshake,
} from 'lucide-react';
import { BimbinganSiswa, Kelas, Siswa, JenisBimbingan } from '../types';
import { apiService } from '../services/apiService';

const JENIS_BIMBINGAN: JenisBimbingan[] = [
  'Akademik',
  'Karakter',
  'Sosial',
  'Kedisiplinan',
  'Karir',
  'Lainnya',
];

export const BimbinganSiswaView: React.FC = () => {
  const [bimbinganList, setBimbinganList] = useState<BimbinganSiswa[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelasFilter, setSelectedKelasFilter] = useState('ALL');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formTanggal, setFormTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [formKelasId, setFormKelasId] = useState('');
  const [formSiswaId, setFormSiswaId] = useState('');
  const [formJenis, setFormJenis] = useState<JenisBimbingan>('Akademik');
  const [formMasalah, setFormMasalah] = useState('');
  const [formSolusi, setFormSolusi] = useState('');
  const [formTindakLanjut, setFormTindakLanjut] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [b, k, s] = await Promise.all([
      apiService.getBimbinganList(),
      apiService.getKelasList(),
      apiService.getSiswaList(),
    ]);
    setBimbinganList(b);
    setKelasList(k);
    setSiswaList(s);
    if (k.length > 0 && !formKelasId) setFormKelasId(k[0].kelas_id);
    if (s.length > 0 && !formSiswaId) setFormSiswaId(s[0].siswa_id);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Filter students based on selected form class
  const classStudents = siswaList.filter((s) => s.kelas_id === formKelasId);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormTanggal(new Date().toISOString().split('T')[0]);
    const firstClass = kelasList[0]?.kelas_id || '';
    setFormKelasId(firstClass);
    const studentsInFirst = siswaList.filter((s) => s.kelas_id === firstClass);
    setFormSiswaId(studentsInFirst[0]?.siswa_id || '');
    setFormJenis('Akademik');
    setFormMasalah('');
    setFormSolusi('');
    setFormTindakLanjut('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BimbinganSiswa) => {
    setEditingId(item.bimbingan_id);
    setFormTanggal(item.tanggal);
    setFormKelasId(item.kelas_id);
    setFormSiswaId(item.siswa_id);
    setFormJenis(item.jenis_bimbingan);
    setFormMasalah(item.masalah_observasi);
    setFormSolusi(item.solusi_rekomendasi);
    setFormTindakLanjut(item.tindak_lanjut);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = siswaList.find((s) => s.siswa_id === formSiswaId);
    if (!formTanggal || !formSiswaId || !formMasalah.trim() || !targetStudent) {
      showToast('Mohon lengkapi seluruh isian data bimbingan siswa', 'error');
      return;
    }

    setIsSaving(true);
    const payload: BimbinganSiswa = {
      bimbingan_id: editingId || `BIM-${formTanggal.replace(/-/g, '')}-${targetStudent.nis}`,
      tanggal: formTanggal,
      siswa_id: targetStudent.siswa_id,
      nis: targetStudent.nis,
      nama_siswa: targetStudent.nama_lengkap,
      kelas_id: formKelasId,
      jenis_bimbingan: formJenis,
      masalah_observasi: formMasalah.trim(),
      solusi_rekomendasi: formSolusi.trim(),
      tindak_lanjut: formTindakLanjut.trim(),
      guru_id: 'GURU-001',
      created_at: new Date().toISOString(),
    };

    try {
      const res = await apiService.saveBimbingan(payload);
      if (res.success) {
        showToast(res.message);
        setIsModalOpen(false);
        loadData();
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus rekaman bimbingan siswa ini?')) {
      const res = await apiService.deleteBimbingan(id);
      if (res.success) {
        showToast(res.message);
        loadData();
      }
    }
  };

  const filteredList = bimbinganList.filter((b) => {
    const matchKelas = selectedKelasFilter === 'ALL' || b.kelas_id === selectedKelasFilter;
    const matchSearch =
      !searchQuery ||
      b.nama_siswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.nis.includes(searchQuery) ||
      b.masalah_observasi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 shadow-md ${
            toast.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border border-rose-300 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Bimbingan Siswa & Layanan Guru Wali
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan kasus belajar, pendampingan karakter, kedisiplinan, dan solusi tindak lanjut siswa
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Bimbingan Baru</span>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-700">Filter Kelas:</span>
          <select
            value={selectedKelasFilter}
            onChange={(e) => setSelectedKelasFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50 font-medium"
          >
            <option value="ALL">Semua Kelas ({bimbinganList.length} Catatan)</option>
            {kelasList.map((k) => (
              <option key={k.kelas_id} value={k.kelas_id}>
                Kelas {k.nama_kelas}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari siswa atau kasus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3.5">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
            <HeartHandshake className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">Belum ada catatan bimbingan</p>
            <p className="text-xs text-slate-500 mt-1">
              Catat setiap observasi, pembinaan siswa bermasalah, atau apresiasi prestasi belajar.
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.bimbingan_id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:border-teal-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    {item.nama_siswa}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    (NIS: {item.nis})
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                    Kelas {item.nama_kelas || item.kelas_id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                    {item.jenis_bimbingan}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>{item.tanggal}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1 text-slate-400 hover:text-teal-600 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.bimbingan_id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Masalah & Solusi Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80">
                  <span className="font-semibold text-amber-900 block mb-1 text-[11px] uppercase tracking-wider">
                    Masalah / Observasi:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{item.masalah_observasi}</p>
                </div>

                <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200/80">
                  <span className="font-semibold text-teal-900 block mb-1 text-[11px] uppercase tracking-wider">
                    Solusi / Rekomendasi:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{item.solusi_rekomendasi || '-'}</p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200/80">
                  <span className="font-semibold text-indigo-900 block mb-1 text-[11px] uppercase tracking-wider">
                    Tindak Lanjut & Evaluasi:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{item.tindak_lanjut || '-'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit Bimbingan */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              {editingId ? 'Edit Catatan Bimbingan' : 'Catat Bimbingan Siswa'}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Rekam pembinaan perilaku, evaluasi belajar, atau pendampingan konseling siswa.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={formTanggal}
                    onChange={(e) => setFormTanggal(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Bimbingan *</label>
                  <select
                    value={formJenis}
                    onChange={(e) => setFormJenis(e.target.value as JenisBimbingan)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 font-medium"
                  >
                    {JENIS_BIMBINGAN.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Kelas & Siswa */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Kelas *</label>
                  <select
                    value={formKelasId}
                    onChange={(e) => {
                      const nextKelas = e.target.value;
                      setFormKelasId(nextKelas);
                      const stds = siswaList.filter((s) => s.kelas_id === nextKelas);
                      if (stds.length > 0) setFormSiswaId(stds[0].siswa_id);
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 font-medium"
                  >
                    {kelasList.map((k) => (
                      <option key={k.kelas_id} value={k.kelas_id}>
                        Kelas {k.nama_kelas}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa *</label>
                  <select
                    value={formSiswaId}
                    onChange={(e) => setFormSiswaId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 font-semibold text-teal-900"
                  >
                    {classStudents.length === 0 ? (
                      <option value="">Tidak ada siswa di kelas ini</option>
                    ) : (
                      classStudents.map((s) => (
                        <option key={s.siswa_id} value={s.siswa_id}>
                          {s.nama_lengkap} ({s.nis})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Masalah */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Masalah / Observasi / Laporan Kasus *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formMasalah}
                  onChange={(e) => setFormMasalah(e.target.value)}
                  placeholder="Deskripsi masalah yang dihadapi atau perilaku yang diobservasi..."
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              {/* Solusi */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Solusi / Arahan / Kesepakatan Bersama
                </label>
                <textarea
                  rows={2}
                  value={formSolusi}
                  onChange={(e) => setFormSolusi(e.target.value)}
                  placeholder="Langkah penyelesaian yang disepakati dengan siswa/wali murid..."
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              {/* Tindak Lanjut */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Rencana Tindak Lanjut & Monitoring
                </label>
                <textarea
                  rows={2}
                  value={formTindakLanjut}
                  onChange={(e) => setFormTindakLanjut(e.target.value)}
                  placeholder="Evaluasi berkala, koordinasi guru BK / orang tua..."
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Catatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
