/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  User,
  Award,
  BookOpen,
  Mail,
  Phone,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Upload,
} from 'lucide-react';
import { GuruProfile } from '../types';
import { apiService } from '../services/apiService';

interface ProfilGuruViewProps {
  guruProfile: GuruProfile;
  onProfileUpdated: (profile: GuruProfile) => void;
}

export const ProfilGuruView: React.FC<ProfilGuruViewProps> = ({
  guruProfile,
  onProfileUpdated,
}) => {
  const [formData, setFormData] = useState<GuruProfile>({ ...guruProfile });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof GuruProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran berkas foto maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData((prev) => ({ ...prev, foto_profil_url: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await apiService.saveGuruProfile(formData);
      if (res.success) {
        onProfileUpdated(formData);
        setSaveStatus({ type: 'success', message: 'Data profil guru berhasil diperbarui!' });
      } else {
        setSaveStatus({ type: 'error', message: res.message || 'Gagal menyimpan profil' });
      }
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err.message || 'Terjadi kesalahan sistem' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Profil Guru & Pengajar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola biodata resmi pendidik, pangkat golongan, dan identitas administrasi PBM
          </p>
        </div>
      </div>

      {saveStatus && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 ${
            saveStatus.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border border-rose-300 text-rose-800'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{saveStatus.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Profile Card Header with Avatar */}
        <div className="bg-gradient-to-r from-slate-900 to-teal-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <img
              src={formData.foto_profil_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt="Foto Profil Guru"
              className="w-28 h-28 sm:w-32 sm:size-32 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-900/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs font-semibold text-white transition-opacity cursor-pointer backdrop-blur-2xs"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span>Ubah Foto</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/30 border border-teal-400/40 text-teal-200 text-[11px] font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>NIP: {formData.nip || 'Belum diatur'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {formData.nama_lengkap}
            </h2>
            <p className="text-xs sm:text-sm text-teal-200/90 mt-1">
              {formData.jabatan} • Guru {formData.mata_pelajaran}
            </p>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700">
                Pangkat: {formData.pangkat_golongan || 'Pembina / IV a'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nama Lengkap & Gelar */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap & Gelar *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.nama_lengkap}
                  onChange={(e) => handleChange('nama_lengkap', e.target.value)}
                  placeholder="Contoh: Drs. Hendra Gunawan, M.Pd."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* NIP */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor Induk Pegawai (NIP) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FileCheck className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.nip}
                  onChange={(e) => handleChange('nip', e.target.value)}
                  placeholder="19820514 200801 1 009"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Pangkat / Golongan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pangkat / Golongan Ruang
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Award className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.pangkat_golongan}
                  onChange={(e) => handleChange('pangkat_golongan', e.target.value)}
                  placeholder="Pembina / IV a, Penata Tk. I / III d"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Jabatan / Tugas Tambahan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jabatan / Tugas Tambahan
              </label>
              <input
                type="text"
                value={formData.jabatan}
                onChange={(e) => handleChange('jabatan', e.target.value)}
                placeholder="Guru Ahli Madya / Guru Pembimbing / Wakasek"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Mata Pelajaran Utama */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mata Pelajaran Utama Diampu *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.mata_pelajaran}
                  onChange={(e) => handleChange('mata_pelajaran', e.target.value)}
                  placeholder="Matematika / IPA / Bahasa Indonesia"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Email Kontak */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Resmi / Kontak
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="guru@sekolah.sch.id"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* No. Telepon / WhatsApp */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor Telepon / WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.telepon}
                  onChange={(e) => handleChange('telepon', e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Profil</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
