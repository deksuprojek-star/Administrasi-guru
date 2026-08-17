/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { School, Lock, User, KeyRound, AlertCircle, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { apiService } from '../services/apiService';
import { UserAccount } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('guru');
  const [password, setPassword] = useState('guru123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [gasUrlInput, setGasUrlInput] = useState(apiService.getGasUrl());
  const [showGasConfig, setShowGasConfig] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await apiService.login(username, password);
      if (res.success && res.data) {
        onLoginSuccess(res.data);
      } else {
        setErrorMessage(res.message || 'Login gagal. Periksa kembali username dan kata sandi.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan pada koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGasUrl = () => {
    apiService.setGasUrl(gasUrlInput);
    alert('URL Google Apps Script berhasil disimpan!');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background grid and glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600 text-white shadow-xl shadow-teal-900/40 mb-4 ring-4 ring-teal-500/20">
            <School className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Sistem Administrasi Guru
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            PBM • Jadwal • Presensi • Jurnal • Penilaian • Bimbingan
          </p>
        </div>

        {/* Card Body */}
        <div className="mt-8 bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username / NIP
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username (contoh: guru)"
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi (contoh: guru123)"
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <p className="text-[11px] font-medium text-slate-400 mb-2.5 text-center">
              Akses Cepat Demo Pengguna:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setUsername('guru');
                  setPassword('guru123');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 text-left text-xs transition-colors"
              >
                <div className="font-semibold text-teal-300">Akun Guru</div>
                <div className="text-[10px] text-slate-400">guru / guru123</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('admin123');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 text-left text-xs transition-colors"
              >
                <div className="font-semibold text-teal-300">Akun Admin</div>
                <div className="text-[10px] text-slate-400">admin / admin123</div>
              </button>
            </div>
          </div>

          {/* Google Apps Script Web App Endpoint Setting Toggle */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setShowGasConfig(!showGasConfig)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{showGasConfig ? 'Sembunyikan URL GAS' : 'Hubungkan ke URL Google Apps Script'}</span>
            </button>

            {showGasConfig && (
              <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-700 text-left">
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Google Apps Script Web App Exec URL:
                </label>
                <input
                  type="url"
                  value={gasUrlInput}
                  onChange={(e) => setGasUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-hidden focus:border-teal-500 mb-2"
                />
                <button
                  type="button"
                  onClick={handleSaveGasUrl}
                  className="w-full py-1 text-xs font-semibold bg-teal-700 hover:bg-teal-600 text-white rounded transition-colors"
                >
                  Simpan Endpoint
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="mt-6 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Arsitektur Resmi: Google Apps Script • Google Sheets • Google Drive</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Aplikasi ini dikembangkan oleh Dewa Suwika -- 2026
          </p>
        </div>
      </div>
    </div>
  );
};
