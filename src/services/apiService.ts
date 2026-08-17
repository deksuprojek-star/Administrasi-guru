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
  BimbinganSiswa,
  KonfigurasiSekolah,
  LogAktivitas,
  ApiResponse,
} from '../types';
import {
  initialGuruProfile,
  initialGuruProfiles,
  initialUserAccount,
  initialUserAccounts,
  initialKonfigurasiSekolah,
  initialKelasList,
  initialMapelList,
  initialSiswaList,
  initialJadwalList,
  initialAbsensiList,
  initialJurnalList,
  initialPenilaianList,
  initialBimbinganList,
  initialLogList,
} from '../data/initialData';

const STORAGE_KEYS = {
  GAS_URL: 'SAG_GAS_WEBAPP_URL',
  GURU: 'SAG_GURU_PROFILE',
  GURU_PROFILES: 'SAG_GURU_PROFILES_LIST',
  USER: 'SAG_USER_ACCOUNT',
  USERS: 'SAG_USERS_LIST',
  CONFIG: 'SAG_CONFIG_SEKOLAH',
  KELAS: 'SAG_MASTER_KELAS',
  MAPEL: 'SAG_MASTER_MAPEL',
  SISWA: 'SAG_MASTER_SISWA',
  JADWAL: 'SAG_JADWAL_MENGAJAR',
  ABSENSI: 'SAG_ABSENSI_DATA',
  JURNAL: 'SAG_JURNAL_DATA',
  PENILAIAN: 'SAG_PENILAIAN_DATA',
  BIMBINGAN: 'SAG_BIMBINGAN_DATA',
  LOGS: 'SAG_LOGS_DATA',
};

class ApiService {
  private gasUrl: string = '';

  constructor() {
    this.gasUrl = localStorage.getItem(STORAGE_KEYS.GAS_URL) || '';
    this.initLocalStorage();
  }

  public getGasUrl(): string {
    return this.gasUrl;
  }

  public setGasUrl(url: string): void {
    this.gasUrl = url.trim();
    localStorage.setItem(STORAGE_KEYS.GAS_URL, this.gasUrl);
  }

  public setGasWebAppUrl(url: string): void {
    this.setGasUrl(url);
  }

  public isOnlineGasMode(): boolean {
    return Boolean(this.gasUrl && this.gasUrl.startsWith('http'));
  }

  public isOnlineMode(): boolean {
    return this.isOnlineGasMode();
  }

  public async checkGasConnection(): Promise<{ connected: boolean; message: string }> {
    if (!this.isOnlineGasMode()) {
      return { connected: false, message: 'Offline / Local Database Mode' };
    }
    try {
      const res = await fetch(this.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({ action: 'ping' }),
      });
      const data = await res.json();
      return {
        connected: data.success === true,
        message: data.message || 'Connected to Google Apps Script',
      };
    } catch (e: any) {
      return { connected: false, message: e.message || 'Gagal menghubungi GAS' };
    }
  }

  public async testConnection(url?: string): Promise<{ success: boolean; message: string }> {
    const targetUrl = url || this.gasUrl;
    if (!targetUrl) {
      return { success: false, message: 'URL Google Apps Script kosong' };
    }
    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({ action: 'ping' }),
      });
      const data = await res.json();
      return {
        success: data.success === true,
        message: data.message || 'Koneksi ke Google Sheets & GAS berhasil!',
      };
    } catch (e: any) {
      return { success: false, message: 'Gagal terhubung ke GAS: ' + e.message };
    }
  }

  private initLocalStorage() {
    const CLEAN_VERSION_KEY = 'SAG_CLEAN_DATA_STATE_V4';
    if (!localStorage.getItem(CLEAN_VERSION_KEY)) {
      // Clear legacy dummy transaction records so tables are clean and ready for real use
      localStorage.setItem(STORAGE_KEYS.ABSENSI, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.JURNAL, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.PENILAIAN, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.BIMBINGAN, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(initialKelasList));
      localStorage.setItem(STORAGE_KEYS.MAPEL, JSON.stringify(initialMapelList));
      localStorage.setItem(STORAGE_KEYS.SISWA, JSON.stringify(initialSiswaList));
      localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(initialJadwalList));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUserAccounts));
      localStorage.setItem(STORAGE_KEYS.GURU_PROFILES, JSON.stringify(initialGuruProfiles));
      localStorage.setItem(STORAGE_KEYS.GURU, JSON.stringify(initialGuruProfile));

      // If active session was one of the removed dummy teachers, reset session to admin
      const activeSession = localStorage.getItem(STORAGE_KEYS.USER);
      if (activeSession) {
        try {
          const parsed = JSON.parse(activeSession);
          if (parsed.username !== 'admin') {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(initialUserAccounts[0]));
          }
        } catch (e) {
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }

      localStorage.setItem(CLEAN_VERSION_KEY, 'true');
    }

    if (!localStorage.getItem(STORAGE_KEYS.GURU)) {
      localStorage.setItem(STORAGE_KEYS.GURU, JSON.stringify(initialGuruProfile));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GURU_PROFILES)) {
      localStorage.setItem(STORAGE_KEYS.GURU_PROFILES, JSON.stringify(initialGuruProfiles));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUserAccounts));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(initialKonfigurasiSekolah));
    }
    if (!localStorage.getItem(STORAGE_KEYS.KELAS)) {
      localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(initialKelasList));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MAPEL)) {
      localStorage.setItem(STORAGE_KEYS.MAPEL, JSON.stringify(initialMapelList));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SISWA)) {
      localStorage.setItem(STORAGE_KEYS.SISWA, JSON.stringify(initialSiswaList));
    }
    if (!localStorage.getItem(STORAGE_KEYS.JADWAL)) {
      localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(initialJadwalList));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ABSENSI)) {
      localStorage.setItem(STORAGE_KEYS.ABSENSI, JSON.stringify(initialAbsensiList));
    }
    if (!localStorage.getItem(STORAGE_KEYS.JURNAL)) {
      localStorage.setItem(STORAGE_KEYS.JURNAL, JSON.stringify(initialJurnalList));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PENILAIAN)) {
      localStorage.setItem(STORAGE_KEYS.PENILAIAN, JSON.stringify(initialPenilaianList));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BIMBINGAN)) {
      localStorage.setItem(STORAGE_KEYS.BIMBINGAN, JSON.stringify(initialBimbinganList));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(initialLogList));
    }
  }

  private async callGas(action: string, payload: any = {}): Promise<ApiResponse> {
    if (!this.isOnlineGasMode()) {
      throw new Error('Google Apps Script URL belum dikonfigurasi');
    }
    const response = await fetch(this.gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, ...payload }),
    });
    return await response.json();
  }

  // --- LOGGING ---
  public async addLog(
    action: string,
    module: string,
    details: string,
    recordId?: string,
    status: 'SUCCESS' | 'FAILED' | 'WARNING' = 'SUCCESS'
  ): Promise<void> {
    const userProfile = await this.getGuruProfile();
    const currentUser = this.getCurrentUser();
    const newLog: LogAktivitas = {
      log_id: 'LOG-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      user: currentUser?.nama_guru || userProfile?.nama_lengkap || 'Pengguna',
      action,
      module,
      record_id: recordId,
      status,
      details,
    };

    const currentLogs: LogAktivitas[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    currentLogs.unshift(newLog);
    if (currentLogs.length > 200) currentLogs.pop();
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(currentLogs));
  }

  public async getLogs(): Promise<LogAktivitas[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
  }

  // --- AUTH & USER MANAGEMENT ---
  public async getUserList(): Promise<UserAccount[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUserAccounts));
      return initialUserAccounts;
    }
    return JSON.parse(raw);
  }

  public async saveUser(user: UserAccount): Promise<ApiResponse> {
    const users = await this.getUserList();
    const existingIndex = users.findIndex((u) => u.user_id === user.user_id || u.username.toLowerCase() === user.username.toLowerCase());
    
    if (existingIndex >= 0 && users[existingIndex].user_id !== user.user_id) {
      return { success: false, message: `Username "${user.username}" sudah digunakan oleh akun lain.` };
    }

    const assignedGuruId = user.guru_id || (existingIndex >= 0 ? users[existingIndex].guru_id : 'GURU-' + Math.random().toString(36).substring(2, 7).toUpperCase());

    const updatedUser: UserAccount = {
      ...user,
      guru_id: assignedGuruId,
      user_id: user.user_id || (existingIndex >= 0 ? users[existingIndex].user_id : 'USR-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
      created_at: user.created_at || (existingIndex >= 0 ? users[existingIndex].created_at : new Date().toISOString()),
      status_aktif: user.status_aktif !== false,
    };

    if (existingIndex >= 0) {
      users[existingIndex] = updatedUser;
    } else {
      users.push(updatedUser);
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Synchronize corresponding GuruProfile
    const profiles = await this.getGuruProfileList();
    const profileIdx = profiles.findIndex((p) => p.guru_id === assignedGuruId || (user.nip && p.nip === user.nip));
    
    const guruProfileData: GuruProfile = {
      guru_id: assignedGuruId,
      nama_lengkap: user.nama_guru,
      nip: user.nip || '',
      pangkat_golongan: (user as any).pangkat_golongan || (user.role === 'admin' ? 'Pembina Utama Muda / IV c' : 'Penata / III c'),
      jabatan: (user as any).jabatan || (user.role === 'admin' ? 'Administrator Sistem' : 'Guru Pengajar'),
      mata_pelajaran: (user as any).mata_pelajaran || (user.role === 'admin' ? 'Teknologi Informasi' : 'Matematika'),
      foto_profil_url: (user as any).foto_profil_url || '',
      email: user.email || '',
      telepon: (user as any).telepon || '',
      kelas_diampu: user.kelas_diampu || [],
    };

    if (profileIdx >= 0) {
      profiles[profileIdx] = { ...profiles[profileIdx], ...guruProfileData };
    } else {
      profiles.push(guruProfileData);
    }
    localStorage.setItem(STORAGE_KEYS.GURU_PROFILES, JSON.stringify(profiles));

    // If current session is this user, update session
    const currentSession = this.getCurrentUser();
    if (currentSession && currentSession.user_id === updatedUser.user_id) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      localStorage.setItem(STORAGE_KEYS.GURU, JSON.stringify(guruProfileData));
    }

    this.addLog('SAVE_USER', 'AUTH', `Menyimpan akun pengguna: ${user.nama_guru} (${user.role.toUpperCase()})`, updatedUser.user_id);
    return { success: true, message: `Akun ${user.nama_guru} (${user.role === 'admin' ? 'Administrator' : 'Guru'}) berhasil disimpan!` };
  }

  public async deleteUser(userId: string): Promise<ApiResponse> {
    const currentUser = this.getCurrentUser();
    if (currentUser?.user_id === userId) {
      return { success: false, message: 'Anda tidak dapat menghapus akun yang sedang aktif digunakan.' };
    }

    const users = await this.getUserList();
    const target = users.find((u) => u.user_id === userId);
    const filtered = users.filter((u) => u.user_id !== userId);

    if (filtered.length === users.length) {
      return { success: false, message: 'Akun pengguna tidak ditemukan.' };
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));

    // Also remove from profiles if exists
    if (target?.guru_id) {
      const profiles = (await this.getGuruProfileList()).filter((p) => p.guru_id !== target.guru_id);
      localStorage.setItem(STORAGE_KEYS.GURU_PROFILES, JSON.stringify(profiles));
    }

    this.addLog('DELETE_USER', 'AUTH', `Menghapus akun pengguna: ${target?.nama_guru || userId}`, userId);
    return { success: true, message: 'Akun pengguna berhasil dihapus!' };
  }

  public async resetUserPassword(userId: string, newPass: string): Promise<ApiResponse> {
    const users = await this.getUserList();
    const user = users.find((u) => u.user_id === userId);
    if (!user) {
      return { success: false, message: 'Akun tidak ditemukan.' };
    }
    user.password = newPass;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.addLog('RESET_PASSWORD', 'AUTH', `Reset kata sandi untuk akun: ${user.nama_guru}`, userId);
    return { success: true, message: `Kata sandi untuk ${user.nama_guru} berhasil diperbarui!` };
  }

  public async login(username: string, password: string): Promise<ApiResponse<UserAccount>> {
    await new Promise((r) => setTimeout(r, 350));
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      return { success: false, message: 'Silakan isi username dan kata sandi.' };
    }

    if (this.isOnlineGasMode()) {
      try {
        const res = await this.callGas('login', { username: cleanUsername, password: cleanPassword });
        if (res.success && res.data) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
          this.addLog('LOGIN', 'AUTH', `Login online berhasil via Google Apps Script sebagai ${res.data.role?.toUpperCase()}`);
          return res;
        }
      } catch (err: any) {
        console.warn('Fallback to local auth due to GAS error:', err);
      }
    }

    // Verify against saved accounts
    const users = await this.getUserList();
    const matchedUser = users.find(
      (u) =>
        (u.username.toLowerCase() === cleanUsername.toLowerCase() || (u.nip && u.nip.replace(/\s+/g, '') === cleanUsername.replace(/\s+/g, ''))) &&
        (u.password === cleanPassword || (!u.password && cleanPassword === 'guru123'))
    );

    if (matchedUser) {
      if (matchedUser.status_aktif === false) {
        return { success: false, message: 'Akun ini sedang dinonaktifkan. Hubungi administrator.' };
      }

      // Safe user object for session
      const sessionUser: UserAccount = {
        user_id: matchedUser.user_id,
        username: matchedUser.username,
        guru_id: matchedUser.guru_id,
        role: matchedUser.role,
        nama_guru: matchedUser.nama_guru,
        nip: matchedUser.nip,
        email: matchedUser.email,
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));
      this.addLog('LOGIN', 'AUTH', `Login berhasil sebagai ${matchedUser.role.toUpperCase()} (${matchedUser.nama_guru})`);
      return {
        success: true,
        message: `Selamat datang, ${matchedUser.nama_guru}! Role aktif: ${matchedUser.role.toUpperCase()}`,
        data: sessionUser,
      };
    }

    this.addLog('LOGIN_FAILED', 'AUTH', `Percobaan login gagal untuk username: ${cleanUsername}`, undefined, 'FAILED');
    return {
      success: false,
      message: 'Username atau kata sandi tidak valid. Pastikan data yang dimasukkan benar.',
    };
  }

  public getCurrentUser(): UserAccount | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  }

  public logout(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    this.addLog('LOGOUT', 'AUTH', 'Pengguna telah keluar dari sistem');
  }

  // --- GURU PROFILE ---
  public async getGuruProfileList(): Promise<GuruProfile[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.GURU_PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GURU_PROFILES, JSON.stringify(initialGuruProfiles));
      return initialGuruProfiles;
    }
    const list: GuruProfile[] = JSON.parse(raw);
    return list.length > 0 ? list : initialGuruProfiles;
  }

  public async getGuruProfile(guruIdOrNip?: string): Promise<GuruProfile> {
    const profiles = await this.getGuruProfileList();
    const currentUser = this.getCurrentUser();

    if (guruIdOrNip) {
      const found = profiles.find(
        (p) => p.guru_id === guruIdOrNip || (p.nip && p.nip === guruIdOrNip) || p.nama_lengkap.toLowerCase() === guruIdOrNip.toLowerCase()
      );
      if (found) return found;
    }

    if (currentUser?.guru_id || currentUser?.nip || currentUser?.nama_guru) {
      const found = profiles.find(
        (p) =>
          (currentUser.guru_id && p.guru_id === currentUser.guru_id) ||
          (currentUser.nip && p.nip === currentUser.nip) ||
          (currentUser.nama_guru && p.nama_lengkap.toLowerCase() === currentUser.nama_guru.toLowerCase())
      );
      if (found) return found;
    }

    if (currentUser) {
      return {
        guru_id: currentUser.guru_id || 'GURU-' + currentUser.user_id,
        nama_lengkap: currentUser.nama_guru || currentUser.username,
        nip: currentUser.nip || '-',
        pangkat_golongan: currentUser.role === 'admin' ? 'Pembina Utama Muda / IV c' : 'Penata / III c',
        jabatan: currentUser.role === 'admin' ? 'Administrator Sistem' : 'Guru Pengajar',
        mata_pelajaran: currentUser.role === 'admin' ? 'Teknologi Informasi' : 'Matematika',
        foto_profil_url: '',
        email: currentUser.email || '',
        telepon: '',
        kelas_diampu: currentUser.kelas_diampu || [],
      };
    }

    const raw = localStorage.getItem(STORAGE_KEYS.GURU);
    return raw ? JSON.parse(raw) : (profiles[0] || initialGuruProfile);
  }

  public async saveGuruProfile(profile: GuruProfile): Promise<ApiResponse> {
    const profiles = await this.getGuruProfileList();
    const idx = profiles.findIndex((p) => p.guru_id === profile.guru_id || p.nip === profile.nip);
    if (idx >= 0) {
      profiles[idx] = { ...profiles[idx], ...profile };
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(STORAGE_KEYS.GURU_PROFILES, JSON.stringify(profiles));
    localStorage.setItem(STORAGE_KEYS.GURU, JSON.stringify(profile));

    if (this.isOnlineGasMode()) {
      try {
        await this.callGas('saveGuruProfile', { profile });
      } catch (err) {
        console.error('GAS save error:', err);
      }
    }
    this.addLog('SAVE_PROFILE', 'PROFIL', `Memperbarui data profil guru ${profile.nama_lengkap}`, profile.guru_id);
    return { success: true, message: 'Profil guru berhasil diperbarui!' };
  }

  // --- MASTER DATA ---
  public async getKelasList(): Promise<Kelas[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.KELAS);
    const classes: Kelas[] = raw ? JSON.parse(raw) : initialKelasList;
    const students: Siswa[] = await this.getSiswaList();
    return classes.map((k) => ({
      ...k,
      jumlah_siswa: students.filter((s) => s.kelas_id === k.kelas_id && s.status === 'Aktif').length,
    }));
  }

  public async saveKelas(kelas: Kelas): Promise<ApiResponse> {
    const list = await this.getKelasList();
    const idx = list.findIndex((k) => k.kelas_id === kelas.kelas_id);
    if (idx >= 0) {
      list[idx] = kelas;
    } else {
      list.push(kelas);
    }
    localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(list));
    this.addLog('SAVE_KELAS', 'MASTER_DATA', `Menyimpan data kelas ${kelas.nama_kelas}`, kelas.kelas_id);
    return { success: true, message: `Kelas ${kelas.nama_kelas} berhasil disimpan!` };
  }

  public async deleteKelas(kelasId: string): Promise<ApiResponse> {
    const list = (await this.getKelasList()).filter((k) => k.kelas_id !== kelasId);
    localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(list));
    this.addLog('DELETE_KELAS', 'MASTER_DATA', `Menghapus data kelas ${kelasId}`, kelasId);
    return { success: true, message: 'Kelas berhasil dihapus!' };
  }

  public async getMapelList(): Promise<MataPelajaran[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.MAPEL);
    return raw ? JSON.parse(raw) : initialMapelList;
  }

  public async saveMapel(mapel: MataPelajaran): Promise<ApiResponse> {
    const list = await this.getMapelList();
    const idx = list.findIndex((m) => m.mapel_id === mapel.mapel_id);
    if (idx >= 0) {
      list[idx] = mapel;
    } else {
      list.push(mapel);
    }
    localStorage.setItem(STORAGE_KEYS.MAPEL, JSON.stringify(list));
    this.addLog('SAVE_MAPEL', 'MASTER_DATA', `Menyimpan mata pelajaran ${mapel.nama_mapel}`, mapel.mapel_id);
    return { success: true, message: `Mata pelajaran ${mapel.nama_mapel} berhasil disimpan!` };
  }

  public async deleteMapel(mapelId: string): Promise<ApiResponse> {
    const list = (await this.getMapelList()).filter((m) => m.mapel_id !== mapelId);
    localStorage.setItem(STORAGE_KEYS.MAPEL, JSON.stringify(list));
    this.addLog('DELETE_MAPEL', 'MASTER_DATA', `Menghapus mata pelajaran ${mapelId}`, mapelId);
    return { success: true, message: 'Mata pelajaran berhasil dihapus!' };
  }

  public async getSiswaList(kelasId?: string): Promise<Siswa[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.SISWA);
    let students: Siswa[] = raw ? JSON.parse(raw) : initialSiswaList;
    if (kelasId && kelasId !== 'ALL') {
      students = students.filter((s) => s.kelas_id === kelasId);
    }
    const classes = JSON.parse(localStorage.getItem(STORAGE_KEYS.KELAS) || '[]') as Kelas[];
    const classMap = new Map(classes.map((c) => [c.kelas_id, c.nama_kelas]));
    return students.map((s) => ({
      ...s,
      nama_kelas: classMap.get(s.kelas_id) || s.nama_kelas || s.kelas_id,
    }));
  }

  public async saveSiswa(siswa: Siswa): Promise<ApiResponse> {
    const list = await this.getSiswaList();
    const idx = list.findIndex((s) => s.siswa_id === siswa.siswa_id);
    if (idx >= 0) {
      list[idx] = siswa;
    } else {
      list.push(siswa);
    }
    localStorage.setItem(STORAGE_KEYS.SISWA, JSON.stringify(list));
    this.addLog('SAVE_SISWA', 'DATA_SISWA', `Menyimpan data siswa: ${siswa.nama_lengkap} (${siswa.nis})`, siswa.siswa_id);
    return { success: true, message: `Data siswa ${siswa.nama_lengkap} berhasil disimpan!` };
  }

  public async deleteSiswa(siswaId: string): Promise<ApiResponse> {
    const list = (await this.getSiswaList()).filter((s) => s.siswa_id !== siswaId);
    localStorage.setItem(STORAGE_KEYS.SISWA, JSON.stringify(list));
    this.addLog('DELETE_SISWA', 'DATA_SISWA', `Menghapus siswa ID ${siswaId}`, siswaId);
    return { success: true, message: 'Data siswa berhasil dihapus!' };
  }

  public async importSiswaBatch(imported: Siswa[]): Promise<ApiResponse> {
    const existing = await this.getSiswaList();
    const existingMap = new Map(existing.map((s) => [s.nis, s]));
    let countNew = 0;
    let countUpdated = 0;

    imported.forEach((item) => {
      if (existingMap.has(item.nis)) {
        const old = existingMap.get(item.nis)!;
        Object.assign(old, item);
        countUpdated++;
      } else {
        existing.push(item);
        countNew++;
      }
    });

    localStorage.setItem(STORAGE_KEYS.SISWA, JSON.stringify(existing));
    this.addLog('IMPORT_SISWA', 'DATA_SISWA', `Import data siswa: ${countNew} baru, ${countUpdated} diperbarui`);
    return {
      success: true,
      message: `Berhasil mengimpor siswa! (${countNew} data baru, ${countUpdated} data diperbarui)`,
    };
  }

  // --- JADWAL MENGAJAR ---
  public async getJadwalList(): Promise<JadwalMengajar[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.JADWAL);
    const jadwal: JadwalMengajar[] = raw ? JSON.parse(raw) : initialJadwalList;
    const classes = await this.getKelasList();
    const mapels = await this.getMapelList();
    const classMap = new Map(classes.map((c) => [c.kelas_id, c.nama_kelas]));
    const mapelMap = new Map(mapels.map((m) => [m.mapel_id, m.nama_mapel]));

    return jadwal.map((j) => ({
      ...j,
      nama_kelas: classMap.get(j.kelas_id) || j.nama_kelas || j.kelas_id,
      nama_mapel: mapelMap.get(j.mapel_id) || j.nama_mapel || j.mapel_id,
    }));
  }

  public async saveJadwal(jadwal: JadwalMengajar): Promise<ApiResponse> {
    const list = await this.getJadwalList();
    const idx = list.findIndex((j) => j.jadwal_id === jadwal.jadwal_id);
    if (idx >= 0) {
      list[idx] = jadwal;
    } else {
      list.push(jadwal);
    }
    localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(list));
    this.addLog('SAVE_JADWAL', 'JADWAL', `Menyimpan jadwal hari ${jadwal.hari}, jam ${jadwal.jam_ke}`, jadwal.jadwal_id);
    return { success: true, message: 'Jadwal mengajar berhasil disimpan!' };
  }

  public async deleteJadwal(jadwalId: string): Promise<ApiResponse> {
    const list = (await this.getJadwalList()).filter((j) => j.jadwal_id !== jadwalId);
    localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(list));
    this.addLog('DELETE_JADWAL', 'JADWAL', `Menghapus jadwal ID: ${jadwalId}`, jadwalId);
    return { success: true, message: 'Jadwal mengajar berhasil dihapus!' };
  }

  // --- ABSENSI SISWA (BATCH OPERATIONS) ---
  public async getAbsensiList(filter?: { kelas_id?: string; tanggal?: string }): Promise<AbsensiRecord[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.ABSENSI);
    let records: AbsensiRecord[] = raw ? JSON.parse(raw) : initialAbsensiList;
    if (filter?.kelas_id && filter.kelas_id !== 'ALL') {
      records = records.filter((r) => r.kelas_id === filter.kelas_id);
    }
    if (filter?.tanggal) {
      records = records.filter((r) => r.tanggal === filter.tanggal);
    }
    return records;
  }

  public async saveBatchAttendance(records: AbsensiRecord[]): Promise<ApiResponse> {
    if (!records || records.length === 0) {
      return { success: false, message: 'Tidak ada data absensi untuk disimpan' };
    }
    const currentList = await this.getAbsensiList();
    const targetDate = records[0].tanggal;
    const targetKelas = records[0].kelas_id;

    const cleaned = currentList.filter((r) => !(r.tanggal === targetDate && r.kelas_id === targetKelas));
    const merged = [...cleaned, ...records];

    localStorage.setItem(STORAGE_KEYS.ABSENSI, JSON.stringify(merged));

    if (this.isOnlineGasMode()) {
      try {
        await this.callGas('saveBatchAttendance', { records });
      } catch (err) {
        console.warn('Sync to GAS failed:', err);
      }
    }

    this.addLog(
      'SAVE_ABSENSI',
      'ABSENSI',
      `Menyimpan batch absensi ${records.length} siswa kelas ${targetKelas} (${targetDate})`,
      `${targetKelas}-${targetDate}`
    );
    return { success: true, message: `Absensi ${records.length} siswa berhasil disimpan dengan status terkini!` };
  }

  // --- JURNAL MENGAJAR ---
  public async getJurnalList(filter?: { kelas_id?: string; mapel_id?: string; query?: string }): Promise<JurnalMengajar[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.JURNAL);
    let list: JurnalMengajar[] = raw ? JSON.parse(raw) : initialJurnalList;
    const classes = await this.getKelasList();
    const mapels = await this.getMapelList();
    const classMap = new Map(classes.map((c) => [c.kelas_id, c.nama_kelas]));
    const mapelMap = new Map(mapels.map((m) => [m.mapel_id, m.nama_mapel]));

    list = list.map((j) => ({
      ...j,
      nama_kelas: classMap.get(j.kelas_id) || j.nama_kelas || j.kelas_id,
      nama_mapel: mapelMap.get(j.mapel_id) || j.nama_mapel || j.mapel_id,
    }));

    if (filter?.kelas_id && filter.kelas_id !== 'ALL') {
      list = list.filter((j) => j.kelas_id === filter.kelas_id);
    }
    if (filter?.mapel_id && filter.mapel_id !== 'ALL') {
      list = list.filter((j) => j.mapel_id === filter.mapel_id);
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      list = list.filter((j) => j.materi_pembelajaran.toLowerCase().includes(q) || j.catatan.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }

  public async saveJurnal(jurnal: JurnalMengajar): Promise<ApiResponse> {
    const list = await this.getJurnalList();
    const idx = list.findIndex((j) => j.jurnal_id === jurnal.jurnal_id);
    if (idx >= 0) {
      list[idx] = jurnal;
    } else {
      list.unshift(jurnal);
    }
    localStorage.setItem(STORAGE_KEYS.JURNAL, JSON.stringify(list));

    if (this.isOnlineGasMode()) {
      try {
        await this.callGas('saveJournal', { journal: jurnal });
      } catch (err) {
        console.warn('Sync to GAS failed:', err);
      }
    }

    this.addLog('SAVE_JURNAL', 'JURNAL', `Menyimpan jurnal materi: ${jurnal.materi_pembelajaran}`, jurnal.jurnal_id);
    return { success: true, message: 'Jurnal Mengajar berhasil disimpan!' };
  }

  public async deleteJurnal(jurnalId: string): Promise<ApiResponse> {
    const list = (await this.getJurnalList()).filter((j) => j.jurnal_id !== jurnalId);
    localStorage.setItem(STORAGE_KEYS.JURNAL, JSON.stringify(list));
    this.addLog('DELETE_JURNAL', 'JURNAL', `Menghapus jurnal ID: ${jurnalId}`, jurnalId);
    return { success: true, message: 'Jurnal berhasil dihapus!' };
  }

  // --- PENILAIAN SISWA (BATCH OPERATIONS) ---
  public async getPenilaianList(filter?: { kelas_id?: string; jenis?: string; nama_tugas_kd?: string }): Promise<PenilaianRecord[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.PENILAIAN);
    let list: PenilaianRecord[] = raw ? JSON.parse(raw) : initialPenilaianList;
    if (filter?.kelas_id && filter.kelas_id !== 'ALL') {
      list = list.filter((p) => p.kelas_id === filter.kelas_id);
    }
    if (filter?.jenis && filter.jenis !== 'ALL') {
      list = list.filter((p) => p.jenis_penilaian === filter.jenis);
    }
    if (filter?.nama_tugas_kd) {
      list = list.filter((p) => p.nama_tugas_kd === filter.nama_tugas_kd);
    }
    return list;
  }

  public async saveBatchPenilaian(records: PenilaianRecord[]): Promise<ApiResponse> {
    if (!records || records.length === 0) {
      return { success: false, message: 'Tidak ada data nilai yang dikirim' };
    }
    const currentList = await this.getPenilaianList();
    const taskName = records[0].nama_tugas_kd;
    const kelasId = records[0].kelas_id;

    const cleaned = currentList.filter((p) => !(p.nama_tugas_kd === taskName && p.kelas_id === kelasId));
    const merged = [...cleaned, ...records];

    localStorage.setItem(STORAGE_KEYS.PENILAIAN, JSON.stringify(merged));

    if (this.isOnlineGasMode()) {
      try {
        await this.callGas('saveBatchGrades', { records });
      } catch (err) {
        console.warn('Sync to GAS failed:', err);
      }
    }

    this.addLog('SAVE_NILAI', 'PENILAIAN', `Menyimpan penilaian ${taskName} (${records.length} siswa)`, `${kelasId}-${taskName}`);
    return { success: true, message: `Nilai ${records.length} siswa berhasil disimpan!` };
  }

  // --- BIMBINGAN GURU WALI ---
  public async getBimbinganList(filter?: { kelas_id?: string; jenis?: string }): Promise<BimbinganSiswa[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.BIMBINGAN);
    let list: BimbinganSiswa[] = raw ? JSON.parse(raw) : initialBimbinganList;
    const classes = await this.getKelasList();
    const classMap = new Map(classes.map((c) => [c.kelas_id, c.nama_kelas]));
    list = list.map((b) => ({
      ...b,
      nama_kelas: classMap.get(b.kelas_id) || b.nama_kelas || b.kelas_id,
    }));

    if (filter?.kelas_id && filter.kelas_id !== 'ALL') {
      list = list.filter((b) => b.kelas_id === filter.kelas_id);
    }
    if (filter?.jenis && filter.jenis !== 'ALL') {
      list = list.filter((b) => b.jenis_bimbingan === filter.jenis);
    }
    return list.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }

  public async saveBimbingan(bimbingan: BimbinganSiswa): Promise<ApiResponse> {
    const list = await this.getBimbinganList();
    const idx = list.findIndex((b) => b.bimbingan_id === bimbingan.bimbingan_id);
    if (idx >= 0) {
      list[idx] = bimbingan;
    } else {
      list.unshift(bimbingan);
    }
    localStorage.setItem(STORAGE_KEYS.BIMBINGAN, JSON.stringify(list));
    this.addLog('SAVE_BIMBINGAN', 'BIMBINGAN', `Catatan bimbingan untuk ${bimbingan.nama_siswa} (${bimbingan.jenis_bimbingan})`, bimbingan.bimbingan_id);
    return { success: true, message: 'Data bimbingan siswa berhasil disimpan!' };
  }

  public async deleteBimbingan(bimbinganId: string): Promise<ApiResponse> {
    const list = (await this.getBimbinganList()).filter((b) => b.bimbingan_id !== bimbinganId);
    localStorage.setItem(STORAGE_KEYS.BIMBINGAN, JSON.stringify(list));
    this.addLog('DELETE_BIMBINGAN', 'BIMBINGAN', `Menghapus catatan bimbingan ID: ${bimbinganId}`, bimbinganId);
    return { success: true, message: 'Data bimbingan berhasil dihapus!' };
  }

  // --- KONFIGURASI SEKOLAH ---
  public async getConfig(): Promise<KonfigurasiSekolah> {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return raw ? JSON.parse(raw) : initialKonfigurasiSekolah;
  }

  public async saveConfig(config: KonfigurasiSekolah): Promise<ApiResponse> {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    this.addLog('SAVE_CONFIG', 'KONFIGURASI', 'Memperbarui konfigurasi sekolah dan KOP surat');
    return { success: true, message: 'Konfigurasi sekolah berhasil disimpan!' };
  }

  // --- BACKUP & RESTORE ---
  public async exportBackup(): Promise<string> {
    const backupObj = {
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      guru: await this.getGuruProfile(),
      users: await this.getUserList(),
      config: await this.getConfig(),
      kelas: await this.getKelasList(),
      mapel: await this.getMapelList(),
      siswa: await this.getSiswaList(),
      jadwal: await this.getJadwalList(),
      absensi: await this.getAbsensiList(),
      jurnal: await this.getJurnalList(),
      penilaian: await this.getPenilaianList(),
      bimbingan: await this.getBimbinganList(),
      logs: await this.getLogs(),
    };
    this.addLog('EXPORT_BACKUP', 'BACKUP', 'Melakukan backup seluruh data sistem');
    return JSON.stringify(backupObj, null, 2);
  }

  public async exportAllDataJson(): Promise<string> {
    return this.exportBackup();
  }

  public async importBackup(jsonString: string): Promise<ApiResponse> {
    try {
      const data = JSON.parse(jsonString);
      if (data.guru) localStorage.setItem(STORAGE_KEYS.GURU, JSON.stringify(data.guru));
      if (data.users) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
      if (data.config) localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(data.config));
      if (data.kelas) localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(data.kelas));
      if (data.mapel) localStorage.setItem(STORAGE_KEYS.MAPEL, JSON.stringify(data.mapel));
      if (data.siswa) localStorage.setItem(STORAGE_KEYS.SISWA, JSON.stringify(data.siswa));
      if (data.jadwal) localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(data.jadwal));
      if (data.absensi) localStorage.setItem(STORAGE_KEYS.ABSENSI, JSON.stringify(data.absensi));
      if (data.jurnal) localStorage.setItem(STORAGE_KEYS.JURNAL, JSON.stringify(data.jurnal));
      if (data.penilaian) localStorage.setItem(STORAGE_KEYS.PENILAIAN, JSON.stringify(data.penilaian));
      if (data.bimbingan) localStorage.setItem(STORAGE_KEYS.BIMBINGAN, JSON.stringify(data.bimbingan));
      if (data.logs) localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(data.logs));

      this.addLog('RESTORE_BACKUP', 'BACKUP', 'Memulihkan data dari berkas cadangan JSON');
      return { success: true, message: 'Restore backup berhasil! Seluruh data telah diperbarui.' };
    } catch (err: any) {
      return { success: false, message: 'Format berkas backup tidak valid: ' + err.message };
    }
  }

  public async restoreDataFromJson(jsonString: string): Promise<ApiResponse> {
    return this.importBackup(jsonString);
  }

  public async resetToDemoData(): Promise<ApiResponse> {
    localStorage.clear();
    this.initLocalStorage();
    this.addLog('RESET_DATA', 'SYSTEM', 'Mengembalikan data sistem ke konfigurasi contoh awal');
    return { success: true, message: 'Data contoh berhasil dimuat ulang!' };
  }
}

export const apiService = new ApiService();
