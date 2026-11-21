import { useState, useMemo, useRef, type FormEvent } from 'react';
import { BookOpen, Construction, Info, X, Check, Globe, GraduationCap, ShieldAlert, Sparkles, Quote, ArrowLeft, ArrowRight, User, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DashboardView from './components/DashboardView';
import { UserSession, ArabicQuote } from './types';
import { ARABIC_QUOTES } from './data/materiData';
import { isOfflineMode, setOfflineMode } from './lib/firebase';

interface FloatingLetter {
  id: number;
  char: string;
  fontSize: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
}

function Student1Svg() {
  return (
    <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
      <rect x="18" y="6" width="12" height="7" rx="1.5" fill="#1e293b" />
      <circle cx="24" cy="18" r="7" fill="#fed7aa" />
      <path d="M15 25C15 25 18 24 24 24C30 24 33 25 33 25L35 48H13L15 25Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      <path d="M24 24V48" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="22,25 24,28 26,25" fill="#0d3b78" />
      <path d="M13 28C10 28 9 34 9 44C9 48 11 50 14 50" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 48H34L32 74H26L25 56L24 56L23 74H17L14 48Z" fill="#0d3b78" />
      <ellipse cx="19" cy="75" rx="4" ry="2.5" fill="#0f172a" />
      <ellipse cx="29" cy="75" rx="4" ry="2.5" fill="#0f172a" />
    </svg>
  );
}

function Student2Svg() {
  return (
    <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
      <path d="M24 8C17 8 15 14 15 22C15 30 18 36 24 38C30 36 33 30 33 22C33 14 31 8 24 8Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
      <ellipse cx="24" cy="20" rx="5" ry="6" fill="#fed7aa" />
      <path d="M15 30L11 44C11 46 14 48 24 48C34 48 37 46 37 44L33 30C33 30 28 35 24 35C20 35 15 30 15 30Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
      <path d="M14 46H34L37 74C37 75 35 76 24 76C13 76 11 75 11 74L14 46Z" fill="#0d3b78" />
      <ellipse cx="19" cy="76" rx="3.5" ry="2" fill="#0f172a" />
      <ellipse cx="29" cy="76" rx="3.5" ry="2" fill="#0f172a" />
    </svg>
  );
}

function Student3Svg() {
  return (
    <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
      <rect x="18" y="7" width="12" height="6.5" rx="1.5" fill="#0f172a" />
      <circle cx="24" cy="18" r="6.5" fill="#fde68a" />
      <path d="M15 25H33L35 48H13L15 25Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      <rect x="25" y="30" width="10" height="13" rx="1" fill="#f59e0b" transform="rotate(8 25 30)" />
      <rect x="27" y="32" width="7" height="9" rx="0.5" fill="#fef3c7" transform="rotate(8 25 30)" />
      <path d="M15 48H33L31 74H26L25 57L24 57L23 74H17L15 48Z" fill="#0d3b78" />
      <ellipse cx="19" cy="75" rx="3.5" ry="2.2" fill="#1e293b" />
      <ellipse cx="28" cy="75" rx="3.5" ry="2.2" fill="#1e293b" />
    </svg>
  );
}

function Student4Svg() {
  return (
    <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
      <path d="M24 9C18 9 16 15 16 22C16 29 19 35 24 37C29 35 32 29 32 22C32 15 30 9 24 9Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
      <ellipse cx="24" cy="20" rx="4.5" ry="5.5" fill="#fed7aa" />
      <path d="M16 28L12 43C12 45 15 47 24 47C33 47 36 45 36 43L32 28C32 28 28 34 24 34C20 34 16 28 16 28Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
      <rect x="8" y="27" width="6" height="14" rx="2" fill="#ea580c" />
      <path d="M14 46H34L36 74C36 75 34 76 24 76C14 76 12 75 12 74L14 46Z" fill="#0d3b78" />
      <ellipse cx="19" cy="76" rx="3" ry="1.8" fill="#0f172a" />
      <ellipse cx="29" cy="76" rx="3" ry="1.8" fill="#0f172a" />
    </svg>
  );
}

export default function App() {
  const [nama, setNama] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [peran, setPeran] = useState<'siswa' | 'guru' | 'admin'>('siswa');
  const [gender, setGender] = useState<'laki-laki' | 'perempuan'>('laki-laki');
  const [kelas, setKelas] = useState<string>('7');
  const [activeView, setActiveView] = useState<'login' | 'proverb'>('login');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const [offline, setOfflineState] = useState<boolean>(() => isOfflineMode());
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'info' | 'error' | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);

  // Global Arabic Accessibility Options
  const [arabicScale, setArabicScale] = useState<number>(1.25); // Range from 0.8 to 2.5
  const [arabicFontFamily, setArabicFontFamily] = useState<string>('Traditional Arabic');
  const [isArabicBold, setIsArabicBold] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const dragStartY = useRef<number>(0);
  const dragStartScale = useRef<number>(1.25);

  // Generate floating Arabic letters for background
  const floatingLetters = useMemo<FloatingLetter[]>(() => {
    const lettersArray = [
      'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
    ];
    const list: FloatingLetter[] = [];
    for (let i = 0; i < 22; i++) {
      const char = lettersArray[Math.floor(Math.random() * lettersArray.length)];
      const size = 18 + Math.random() * 30;
      const left = Math.random() * 100;
      const durationNum = 14 + Math.random() * 18;
      const delayNum = -Math.random() * durationNum;
      list.push({
        id: i,
        char,
        fontSize: `${size.toFixed(1)}px`,
        left: `${left.toFixed(2)}%`,
        animationDuration: `${durationNum.toFixed(2)}s`,
        animationDelay: `${delayNum.toFixed(2)}s`,
      });
    }
    return list;
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = nama.trim();

    if (peran === 'admin') {
      const normalizeName = (str: string): string => {
        return str
          .toLowerCase()
          .replace(/[.,]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      };

      const normalizedInput = normalizeName(trimmedName);
      const normalizedTarget = normalizeName('Miftah Rizki Abdulloh, S.Ag.');

      // Flexible check allowing minor spacing/punctuation/casing differences
      const isMatch = normalizedInput === normalizedTarget || normalizedInput === 'miftah rizki abdulloh';

      if (!isMatch) {
        setIsLoading(false);
        setStatusType('error');
        setStatusMessage('Maaf, hanya Miftah Rizki Abdulloh, S.Ag. yang memiliki hak akses sebagai Administrator.');
        return;
      }

      // Check Admin Password ("21 04 02")
      const cleanAdminPass = password.replace(/\s+/g, '');
      if (cleanAdminPass !== '210402') {
        setIsLoading(false);
        setStatusType('error');
        setStatusMessage('Kata sandi Administrator salah. Silakan periksa kembali kata sandi khusus Admin Anda.');
        return;
      }
    }

    if (peran === 'guru') {
      if (!trimmedName) {
        setIsLoading(false);
        setStatusType('error');
        setStatusMessage('Nama Guru wajib diisi dan harus menyertakan gelar akademik/keagamaan.');
        return;
      }

      // Check Guru Password ("Tsanawiyyah Nurul islam")
      const cleanGuruPass = password.toLowerCase().trim();
      if (cleanGuruPass !== 'tsanawiyyah nurul islam' && cleanGuruPass.replace(/\s+/g, '') !== 'tsanawiyyahnurulislam') {
        setIsLoading(false);
        setStatusType('error');
        setStatusMessage('Kata sandi Guru salah. Silakan periksa kembali kata sandi khusus Guru (Tsanawiyyah Nurul islam).');
        return;
      }

      // Helper function to check for titles
      const hasGelar = (name: string): boolean => {
        const lowerName = name.toLowerCase();
        const commonTitles = [
          's.ag', 'spd', 's.pd', 'mpd', 'm.pd', 'lc', 'm.a', 'drs', 'dr', 'h.', 'hj', 'prof', 
          'ustadz', 'ustad', 'ustadzah', 'shi', 's.h.i', 'spdi', 's.p.d.i', 'mpdi', 'm.p.d.i',
          'ssos', 's.sos', 's.e', 'se', 'skom', 's.kom', 's.t', 'st'
        ];
        
        const words = lowerName.split(/[\s,]+/);
        const hasMatchingWord = words.some(word => {
          const cleanWord = word.replace(/[.,]/g, '');
          return commonTitles.includes(word) || commonTitles.includes(cleanWord);
        });

        const hasCommaAndTitleSuffix = /,\s*[a-zA-Z]{2,}/.test(lowerName);
        const hasDotsAbbreviation = /\b[a-zA-Z]{1,2}\.[a-zA-Z]{1,2}\.?/.test(lowerName);

        return hasMatchingWord || hasCommaAndTitleSuffix || hasDotsAbbreviation;
      };

      if (!hasGelar(trimmedName)) {
        setIsLoading(false);
        setStatusType('error');
        setStatusMessage('Untuk akses Guru, silakan tambahkan gelar akademis atau keagamaan pada nama Anda (misal: S.Ag., S.Pd., M.Pd., Lc., Ustadz, dll.)');
        return;
      }
    }

    setIsLoading(true);
    setStatusMessage(null);
    setStatusType(null);

    // Default name if empty (only for siswa)
    const resolvedName = trimmedName || (gender === 'laki-laki' ? 'Ahmad Mulya' : 'Siti Aisyah');

    // Simulate login verification with redirection to dashboard
    setTimeout(() => {
      setIsLoading(false);
      setStatusType('success');
      const roleCapitalized = peran.charAt(0).toUpperCase() + peran.slice(1);
      setStatusMessage(
        `Berhasil! Anda masuk sebagai ${roleCapitalized} (${gender === 'laki-laki' ? 'Laki-laki' : 'Perempuan'})${
          peran === 'siswa' ? ` Kelas ${kelas}` : ''
        }. Mengalihkan ke Dashboard...`
      );
      
      // Delay transition to dashboard for better feedback feel
      setTimeout(() => {
        setSession({
          peran,
          gender,
          kelas,
          name: resolvedName
        });
      }, 800);

    }, 1200);
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-gradient-to-br from-[#0a2c5c] via-[#0d3b78] to-[#1f6fe5]">
      <AnimatePresence mode="wait">
        {!session ? (
          <motion.div
            key="login-stage"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(12px)' }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full h-full"
          >
            <div className="stage relative w-full h-full min-h-screen overflow-hidden bg-gradient-to-br from-[#0a2c5c] via-[#0d3b78] to-[#1f6fe5]">
              {/* Huruf Hijaiyah Mengapung di Seluruh Langit Biru */}
              <div className="letters pointer-events-none">
                {floatingLetters.map((l) => (
                  <span
                    key={`letter-${l.id}`}
                    className="flet font-arabic select-none"
                    style={{
                      left: l.left,
                      fontSize: l.fontSize,
                      animationDuration: l.animationDuration,
                      animationDelay: l.animationDelay,
                      color: 'rgba(255, 255, 255, 0.22)',
                    }}
                  >
                    {l.char}
                  </span>
                ))}
              </div>

              {/* Awan Berarak Lembut di Langit Biru */}
              <div className="cloud" style={{ top: '8%', left: '8%', width: '150px', height: '38px', opacity: 0.35, animationDuration: '34s' }} />
              <div className="cloud" style={{ top: '18%', left: '48%', width: '180px', height: '44px', opacity: 0.28, animationDuration: '46s', animationDelay: '-14s' }} />
              <div className="cloud" style={{ top: '10%', left: '76%', width: '140px', height: '36px', opacity: 0.24, animationDuration: '40s', animationDelay: '-22s' }} />

              {/* Adegan 3D Perspektif: Siswa & Siswi Madrasah Berjalan Melintasi Garis Horison */}
              <div className="scene pointer-events-none">
                <div className="ground-line" />
                <div className="student s1" title="Siswa Madrasah Berjalan"><Student1Svg /></div>
                <div className="student s2" title="Siswi Madrasah Berjalan"><Student2Svg /></div>
                <div className="student s3" title="Siswa Membawa Kitab"><Student3Svg /></div>
                <div className="student s4" title="Siswi Membawa Ransel"><Student4Svg /></div>
              </div>

              {/* Kata Mutiara / Mahfuzhat di Bagian Bawah Layar */}
              <div className="quote pointer-events-none hidden md:block select-none">
                <span className="arabic font-arabic text-amber-300 drop-shadow-md text-base">مَنْ سَارَ عَلَى الدَّرْبِ وَصَلَ</span>
                <span className="text-white/95 font-medium text-xs tracking-wide drop-shadow">Barangsiapa bersungguh-sungguh berjalan di jalurnya, ia akan sampai ke tujuan</span>
              </div>

              {/* LOGIN CARD CONTAINER */}
              <div className="card-wrap">
        <motion.div layout className="card">
          <AnimatePresence mode="wait">
            {activeView === 'login' ? (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: -16, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 16, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {/* Rounded gradient top emblem - replaced with an elegant BookOpen icon */}
                <div className="mark">
                  <BookOpen className="w-5 h-5 text-[#ffb020]" />
                </div>

                {/* Floating Arabic title banner */}
                <div className="title-wrap" style={{ textAlign: 'center' }}>
                  <h1 
                    className="title3d transition-all duration-75"
                    style={{
                      fontFamily: arabicFontFamily,
                      fontSize: `${20 * arabicScale}px`,
                      fontWeight: isArabicBold ? 'bold' : 'normal',
                      lineHeight: 1.5
                    }}
                  >
                    مُدْخَلُ القَوَاعِدِ الْعَرَبِيَّةِ لِلْمُبْتَدِئِينَ
                  </h1>
                </div>
                <p className="sub">Masuk untuk melanjutkan pembelajaran tata bahasa Arab</p>

                {/* Stateful Notification Banner */}
                {statusMessage && (
                  <div className={`mb-4 p-3 rounded-lg flex items-start gap-2.5 border text-xs leading-relaxed animate-fade-in ${
                    statusType === 'success' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : statusType === 'error'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    {statusType === 'success' ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : statusType === 'error' ? (
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">{statusMessage}</div>
                    <button 
                      type="button" 
                      onClick={() => setStatusMessage(null)} 
                      className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Form */}
                <form id="loginForm" onSubmit={handleSubmit}>
                  {/* Field: Nama Lengkap */}
                  <div className="field">
                    <label className="group-label" htmlFor="nama">
                      {peran === 'siswa' ? 'Nama Lengkap (Opsional)' : 'Nama Lengkap'}
                    </label>
                    <input 
                      type="text" 
                      id="nama" 
                      name="nama" 
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder={
                        peran === 'siswa' 
                          ? 'Masukkan Nama Anda (opsional)' 
                          : peran === 'admin'
                          ? 'Miftah Rizki Abdulloh, S.Ag.'
                          : 'Masukkan nama lengkap beserta gelar (contoh: Ahmad, S.Pd.)'
                      }
                      className="w-full p-2.5 bg-[#f7fafc] border border-[#e2e8f0] focus:border-[#1f6fe5] focus:bg-white focus:ring-2 focus:ring-[#1f6fe5]/10 rounded-lg text-xs font-semibold text-slate-800 outline-none transition"
                    />
                  </div>

                  {/* Field: Password (Hanya untuk Admin & Guru) */}
                  <AnimatePresence>
                    {(peran === 'admin' || peran === 'guru') && (
                      <motion.div 
                        key="field-password"
                        initial={{ opacity: 0, height: 0, scale: 0.96 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="field overflow-hidden"
                      >
                        <label className="group-label" htmlFor="password">
                          Kata Sandi Khusus {peran === 'admin' ? 'Administrator' : 'Guru'}
                        </label>
                        <input 
                          type="password" 
                          id="password" 
                          name="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={
                            peran === 'admin' 
                              ? 'Masukkan Kata Sandi Admin' 
                              : 'Masukkan Kata Sandi Guru'
                          }
                          className="w-full p-2.5 bg-[#f7fafc] border border-[#e2e8f0] focus:border-[#1f6fe5] focus:bg-white focus:ring-2 focus:ring-[#1f6fe5]/10 rounded-lg text-xs font-semibold text-slate-800 outline-none transition"
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Field: Peran (Role selection pills with smooth morph) */}
                  <div className="field">
                    <label className="group-label">Masuk sebagai</label>
                    <div className="grid grid-cols-3 gap-1.5 bg-[#f0f6ff] p-1.5 rounded-xl border border-[#d6e7ff]" role="radiogroup" aria-label="Peran">
                      {[
                        {
                          id: 'siswa',
                          label: 'Siswa',
                          icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <path d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3Z"/>
                              <path d="M5 10.5V16c0 1.5 3 3 7 3s7-1.5 7-3v-5.5" strokeLinecap="round"/>
                            </svg>
                          )
                        },
                        {
                          id: 'guru',
                          label: 'Guru',
                          icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <rect x="4" y="4" width="16" height="16" rx="2"/>
                              <path d="M8 9h8M8 13h5" strokeLinecap="round"/>
                            </svg>
                          )
                        },
                        {
                          id: 'admin',
                          label: 'Admin',
                          icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <circle cx="12" cy="12" r="3"/>
                              <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.96 19.3a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.7 8.96a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9.1A1.7 1.7 0 0 0 10.14 3H10.09a2 2 0 1 1 4 0v.09c.02.68.42 1.28 1.05 1.56"/>
                            </svg>
                          )
                        }
                      ].map((item) => {
                        const isSelected = peran === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setPeran(item.id as any);
                              if (item.id === 'admin') setGender('laki-laki');
                            }}
                            className={`relative py-2 px-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer select-none ${
                              isSelected ? 'text-white' : 'text-[#3a4f68] hover:text-[#0d3b78]'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="active-peran-pill"
                                className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#1f6fe5] to-[#0d3b78] shadow-md z-0"
                                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                              />
                            )}
                            <span className="relative z-10 flex flex-col items-center gap-1">
                              {item.icon}
                              <span>{item.label}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Field: Jenis Kelamin (Gender pills with smooth morph) */}
                  <div className="field">
                    <label className="group-label">Jenis Kelamin</label>
                    <div className="grid grid-cols-2 gap-1.5 bg-[#f0f6ff] p-1.5 rounded-xl border border-[#d6e7ff]" role="radiogroup" aria-label="Jenis Kelamin">
                      {[
                        { id: 'laki-laki', label: 'Laki-laki' },
                        ...(peran !== 'admin' ? [{ id: 'perempuan', label: 'Perempuan' }] : [])
                      ].map((item) => {
                        const isSelected = gender === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setGender(item.id as any)}
                            className={`relative py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer select-none ${
                              isSelected ? 'text-white' : 'text-[#3a4f68] hover:text-[#0d3b78]'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="active-gender-pill"
                                className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#1f6fe5] to-[#0d3b78] shadow-md z-0"
                                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                              />
                            )}
                            <span className="relative z-10">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Field: Kelas - Only visible if 'Siswa' is selected */}
                  <AnimatePresence>
                    {peran === 'siswa' && (
                      <motion.div 
                        key="field-kelas"
                        initial={{ opacity: 0, height: 0, scale: 0.96 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="field overflow-hidden"
                      >
                        <label className="group-label" htmlFor="kelas">Kelas</label>
                        <select 
                          id="kelas" 
                          name="kelas" 
                          value={kelas}
                          onChange={(e) => setKelas(e.target.value)}
                        >
                          <option value="7">Kelas 7</option>
                          <option value="8">Kelas 8</option>
                          <option value="9">Kelas 9</option>
                        </select>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Field: Mode Offline */}
                  <div className="field mt-4">
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3.5 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <Globe className={`w-4.5 h-4.5 transition-colors duration-300 ${offline ? 'text-amber-500 animate-pulse' : 'text-blue-500'}`} />
                        <div className="text-left">
                          <p className="text-[11px] font-extrabold text-slate-800">Mode Belajar Luring (Offline)</p>
                          <p className="text-[9px] text-slate-500 font-bold leading-none">Simpan data di browser tanpa internet</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newValue = !offline;
                          setOfflineState(newValue);
                          setOfflineMode(newValue);
                        }}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          offline ? 'bg-amber-500' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            offline ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn-submit mt-4" disabled={isLoading}>
                    {isLoading ? 'Memeriksa…' : 'Masuk'}
                  </button>
                </form>

                {/* Under Development Badge */}
                <div className="signup-badge">
                  <span className="flex items-center justify-center gap-1.5 text-[#0d3b78] select-none">
                    <Construction className="w-4 h-4 text-[#ffb020] shrink-0" />
                    Website ini sedang dikembangkan
                  </span>
                </div>

                {/* Beautiful Action switch button */}
                <button
                  type="button"
                  onClick={() => setActiveView('proverb')}
                  className="w-full mt-3 py-2.5 px-3 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-800 text-xs font-bold flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer shadow-sm hover:shadow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  Buka Kata Mutiara & Mahfuzhat Hari Ini
                  <ArrowRight className="w-3.5 h-3.5 text-amber-500 ml-0.5" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="proverb-view"
                initial={{ opacity: 0, x: 16, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -16, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex flex-col"
              >
                {/* Badge/Emblem with Quote Icon */}
                <div className="mark bg-gradient-to-tr from-amber-400 to-amber-600 border border-amber-200/50">
                  <Quote className="w-5 h-5 text-white" />
                </div>

                {/* Title */}
                <div className="text-center mb-1">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    KATA MUTIARA • PEPATAH ARAB
                  </span>
                </div>
                <p className="sub text-xs text-[#4a5f78] text-center mb-5">Motivasi & Mahfuzhat Harian Pemula</p>

                {/* Extremely Clear Arabic Proverb Box (Noto Naskh Arabic font loaded) */}
                <div className="text-center bg-gradient-to-b from-amber-50/70 to-amber-50/30 rounded-xl p-6 border border-amber-100/80 mb-4 relative shadow-sm min-h-[170px] flex flex-col justify-center">
                  {/* Decorative quote mark */}
                  <span className="absolute -top-3 left-4 text-4xl text-amber-300/40 font-serif leading-none select-none">“</span>
                  
                  {/* Arabic text rendered super crisp, prominent & clean */}
                  <h2 
                    className="arabic text-[#0d3b78] leading-normal mb-3 tracking-wide drop-shadow-sm select-all text-center"
                    style={{
                      fontFamily: arabicFontFamily,
                      fontSize: `${28 * arabicScale}px`,
                      fontWeight: isArabicBold ? 'bold' : 'normal',
                    }}
                  >
                    {ARABIC_QUOTES[currentQuoteIndex].arabic}
                  </h2>
                  
                  {/* Pronunciation Transliteration */}
                  <p className="font-semibold text-amber-800 text-sm italic tracking-wide font-serif">
                    &ldquo;{ARABIC_QUOTES[currentQuoteIndex].pronunciation}&rdquo;
                  </p>

                  {/* Indonesian translation with clear high-contrast display */}
                  <p className="mt-3.5 text-[#0f2743] font-bold text-base leading-relaxed">
                    {ARABIC_QUOTES[currentQuoteIndex].translation}
                  </p>

                  <span className="absolute -bottom-8 right-4 text-4xl text-amber-300/40 font-serif leading-none select-none">”</span>
                </div>

                {/* Dots / Selectors Indicator */}
                <div className="flex justify-center items-center gap-1.5 mb-5">
                  <button
                    onClick={() => setCurrentQuoteIndex((prev) => (prev - 1 + ARABIC_QUOTES.length) % ARABIC_QUOTES.length)}
                    className="p-1 rounded-full hover:bg-amber-100 text-amber-800 transition cursor-pointer"
                    title="Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex gap-1.5 mx-2">
                    {ARABIC_QUOTES.map((_, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => setCurrentQuoteIndex(qIdx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          currentQuoteIndex === qIdx
                            ? 'bg-amber-500 w-6'
                            : 'bg-amber-200 hover:bg-amber-300'
                        }`}
                        title={`Kata Mutiara ${qIdx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentQuoteIndex((prev) => (prev + 1) % ARABIC_QUOTES.length)}
                    className="p-1 rounded-full hover:bg-amber-100 text-amber-800 transition cursor-pointer"
                    title="Berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Descriptive moral advice */}
                <p className="text-xs text-[#4a5f78] leading-relaxed text-center mb-6 px-1.5 font-semibold bg-slate-50/50 py-3 rounded-lg border border-slate-100">
                  {ARABIC_QUOTES[currentQuoteIndex].advice}
                </p>

                {/* Navigation Button back to Login */}
                <button
                  type="button"
                  onClick={() => setActiveView('login')}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Halaman Masuk
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  </motion.div>
        ) : (
          <motion.div
            key="dashboard-stage"
            initial={{ opacity: 0, scale: 1.02, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full h-full relative"
          >
            <DashboardView 
              session={session} 
              onLogout={() => {
                setSession(null);
                setStatusMessage(null);
                setStatusType(null);
              }} 
              arabicScale={arabicScale}
              setArabicScale={setArabicScale}
              arabicFontFamily={arabicFontFamily}
              setArabicFontFamily={setArabicFontFamily}
              isArabicBold={isArabicBold}
              setIsArabicBold={setIsArabicBold}
            />
            
            {/* PINNED SIDEBAR VERTICAL SLIDER ON THE RIGHT SIDE */}
            <div 
              className="fixed right-0 top-[18%] h-[52%] w-10 z-50 bg-white/95 backdrop-blur border-l border-y border-slate-200/90 rounded-l-2xl shadow-xl flex flex-col items-center justify-between py-5 select-none transition-all hover:w-11"
              style={{ touchAction: 'none' }}
            >
              {/* Slanted vertical text label on hover or default */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 origin-center flex items-center gap-1 pointer-events-none">
                <span className="text-[8px] font-extrabold tracking-widest text-slate-400 uppercase">GESER UKURAN</span>
                <span className="text-amber-500 font-extrabold text-[9px]">ع</span>
              </div>

              {/* Small top indicator button */}
              <button 
                onClick={() => setArabicScale(prev => Math.min(2.5, Number((prev + 0.1).toFixed(2))))}
                className="text-slate-400 hover:text-[#0d3b78] hover:bg-slate-100 transition p-1 rounded-full cursor-pointer"
                title="Perbesar Ukuran Arab"
              >
                <ChevronUp className="w-4 h-4" />
              </button>

              {/* Vertical sliding track */}
              <div className="relative w-1.5 h-3/5 bg-slate-100 border border-slate-200/60 rounded-full flex items-center justify-center">
                {/* Active progress fill */}
                <div 
                  className="absolute bottom-0 w-full bg-amber-400 rounded-full"
                  style={{ height: `${((arabicScale - 0.8) / 1.7) * 100}%` }}
                />

                {/* Draggable Circle Handle with Pointer Capture */}
                <motion.div
                  onPointerDown={(e) => {
                    setIsDragging(true);
                    dragStartY.current = e.clientY;
                    dragStartScale.current = arabicScale;
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (!isDragging) return;
                    const deltaY = dragStartY.current - e.clientY; // Drag UP increases scale
                    const newScale = Math.min(2.5, Math.max(0.8, dragStartScale.current + (deltaY / 100)));
                    setArabicScale(Number(newScale.toFixed(2)));
                  }}
                  onPointerUp={(e) => {
                    setIsDragging(false);
                    e.currentTarget.releasePointerCapture(e.pointerId);
                  }}
                  className={`absolute w-7 h-7 rounded-full bg-[#0d3b78] text-white shadow-md flex items-center justify-center cursor-ns-resize border-2 border-white select-none transition-colors ${
                    isDragging ? 'bg-amber-400 ring-4 ring-amber-500/30 scale-110' : 'hover:bg-[#1f6fe5]'
                  }`}
                  style={{
                    bottom: `calc(${((arabicScale - 0.8) / 1.7) * 100}% - 14px)`,
                    touchAction: 'none'
                  }}
                  title="Tarik Naik-Turun untuk Mengubah Ukuran Arab"
                >
                  <span className="text-[7.5px] font-black">{Math.round(arabicScale * 100)}%</span>
                </motion.div>
              </div>

              {/* Small bottom indicator button */}
              <button 
                onClick={() => setArabicScale(prev => Math.max(0.8, Number((prev - 0.1).toFixed(2))))}
                className="text-slate-400 hover:text-[#0d3b78] hover:bg-slate-100 transition p-1 rounded-full cursor-pointer"
                title="Perkecil Ukuran Arab"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
