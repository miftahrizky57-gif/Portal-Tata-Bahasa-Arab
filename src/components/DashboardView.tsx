import React, { useState, useMemo, useRef, useEffect, PointerEvent } from 'react';
import { listenToStudentProgress, saveStudentProgress, saveStudentScore, updateStudentScore, deleteStudentScore, listenToAllScores, isOfflineMode, setOfflineMode } from '../lib/firebase';
import { exportScoresToExcel, getNarrativeScore } from '../lib/excelExport';
import { 
  UserSession, 
  PeranUser, 
  ContohItem, 
  LatihanItem, 
  EvaluasiQuestion, 
  StudentScore 
} from '../types';
import { 
  RESEARCH_INFO, 
  PROFILE_INFO, 
  KBC_SUMMARY, 
  CP_FASE_D, 
  DAFTAR_MATERI, 
  DAFTAR_MATERI_BAB2,
  EVALUASI_QUESTIONS, 
  MOCK_STUDENT_SCORES, 
  REFERENSI_LIST,
  ARABIC_QUOTES
} from '../data/materiData';
import { 
  BookOpen, 
  User, 
  Award, 
  Compass, 
  FileText, 
  GraduationCap, 
  BookMarked, 
  HelpCircle, 
  ChevronRight, 
  Check, 
  X, 
  LogOut, 
  Calendar, 
  Shield, 
  MapPin, 
  Phone, 
  Globe, 
  Briefcase, 
  Mail, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Search, 
  BookOpenCheck,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  ArrowLeft,
  ChevronLeft,
  Sliders,
  Settings,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  Copy,
  ExternalLink,
  Heart,
  Flag,
  Users,
  Sparkles,
  Leaf,
  Lock,
  Clock,
  XCircle,
  GripVertical,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Edit3,
  Plus,
  Download,
  Send,
  Save,
  Eye,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IceBreakingGame } from './IceBreakingGame';
import { WalkingStudents } from './WalkingStudents';

interface EssayQuestion {
  id: string;
  questionAr: string;
  questionId: string;
  refAr: string;
  refId: string;
  explanation: string;
}

const ESSAY_QUESTIONS: EssayQuestion[] = [
  {
    id: '1',
    questionAr: '١. مَنْ يَتَكَلَّمُ مَعَ حَسَنٍ؟',
    questionId: 'Siapa yang berbicara dengan Hasan?',
    refAr: 'الْجَوَابُ : عَلِيٌّ.',
    refId: 'Jawaban: Ali.',
    explanation: 'Dalam percakapan ini, yang berbicara bertukar sapaan dan tanya jawab dengan Hasan adalah Ali.'
  },
  {
    id: '2',
    questionAr: '٢. هَلْ عَلِيٌّ طَالِبٌ جَدِيدٌ؟',
    questionId: 'Apakah Ali seorang siswa baru?',
    refAr: 'الْجَوَابُ : نَعَمْ، عَلِيٌّ طَالِبٌ جَدِيْدٌ.',
    refId: 'Jawaban: Ya, Ali adalah siswa baru.',
    explanation: 'Ali mengonfirmasi dalam dialog bahwa dirinya adalah siswa baru: "نَعَمْ، أَنَا تِلْمِيْذٌ جَدِيْدٌ".'
  },
  {
    id: '3',
    questionAr: '٣. مِنْ أَيْنَ حَسَنُ؟',
    questionId: 'Dari mana Hasan berasal?',
    refAr: 'الْجَوَابُ : حَسَنُ/هُوَ مِنْ شِرْبون.',
    refId: 'Jawaban: Hasan/dia berasal dari Cirebon.',
    explanation: 'Hasan secara jelas menyebutkan kota asalnya: "أَنَا مِنْ شِرْبُوْنَ" (Saya dari Cirebon).'
  },
  {
    id: '4',
    questionAr: '٤.  مَا هِوَايَةُ الحَسَنِ؟',
    questionId: 'Apa hobi Hasan?',
    refAr: 'الْجَوَابُ : هِوَايَتُهُ الْقِرَاءَةُ',
    refId: 'Jawaban: Hobinya adalah membaca.',
    explanation: 'Hasan menyatakan "هِوَايَتِيْ الْقِرَاءَةُ أَيْضًا" yang menegaskan hobinya juga membaca seperti Ali.'
  },
  {
    id: '5',
    questionAr: '٥. إِلَى أَيْنَ حَسَنٌ وَعَلِيٌّ يَذْهَبَانِ فِيْ وَقْتِ الاِسْتِرَاحَةِ ؟',
    questionId: 'Kemana Hasan dan Ali pergi pada waktu istirahat?',
    refAr: 'الْجَوَابُ : يَذْهَبَانِ إِلَى الْمَكْتَبَةِ فِي وَقْتِ الاِسْتِرَاحَةِ',
    refId: 'Jawaban: Keduanya pergi ke perpustakaan pada waktu istirahat.',
    explanation: 'Hasan mengajak Ali: "هَيَّا بِنَا نَذْهَبْ إِلَى الْمَكْتَبَةِ فِيْ وَقْتِ الاِسْتِرَاحَةِ!" (Mari kita pergi ke perpustakaan pada waktu istirahat!) dan disetujui.'
  }
];

interface MubtadaEssayQuestion {
  id: string;
  sentenceAr: string;
  sentenceId: string;
  refMubtada: string;
  refKhabar: string;
  explanation: string;
}

const MUBTADA_ESSAY_QUESTIONS: MubtadaEssayQuestion[] = [
  {
    id: '1',
    sentenceAr: 'عَلِيٌّ مُعَلِّمٌ جَدِيْدٌ.',
    sentenceId: 'Ali adalah guru baru.',
    refMubtada: 'عَلِيٌّ مُعَلِّمٌ',
    refKhabar: 'مُعَلِّمٌ',
    explanation: 'Mubtada’ berupa bagian awal/subjek kalimat (عَلِيٌّ مُعَلِّمٌ), sedangkan Khabar adalah kata penjelas/predikatnya (مُعَلِّمٌ).'
  },
  {
    id: '2',
    sentenceAr: 'أَنَا مُهَنْدِسٌ فِي سُورَابَايَا.',
    sentenceId: 'Saya adalah seorang insinyur di Surabaya.',
    refMubtada: 'أَنَا',
    refKhabar: 'مُهَنْدِسٌ',
    explanation: 'Mubtada’ berupa isim dhamir tunggal (أَنَا) di awal kalimat, dan Khabar adalah kata benda profesi penjelas (مُهَنْدِسٌ).'
  },
  {
    id: '3',
    sentenceAr: 'أَبِي يَزْرَعُ الْأَرُزَّ فِي الْحَقْلِ.',
    sentenceId: 'Ayahku menanam padi di sawah.',
    refMubtada: 'أَبِي يَزْرَعُ',
    refKhabar: 'يَزْرَعُ',
    explanation: 'Mubtada’ di awal kalimat berupa (أَبِي يَزْرَعُ), sedangkan Khabar berupa kata kerja penjelas (يَزْرَعُ).'
  },
  {
    id: '4',
    sentenceAr: 'أُمِّي تَطْبَخُ الطَّعَامَ فِيْ الْمَطْبَخِ.',
    sentenceId: 'Ibuku memasak makanan di dapur.',
    refMubtada: 'أُمِّي',
    refKhabar: 'تَطْبَخُ',
    explanation: 'Mubtada’ adalah (أُمِّي) sedangkan Khabarnya berupa kata kerja penjelas (تَطْبَخُ).'
  },
  {
    id: '5',
    sentenceAr: 'الْمُعَلِّمُ يُعَلِّمُ فِيْ الْمَدْرَسَةِ.',
    sentenceId: 'Guru itu mengajar di sekolah.',
    refMubtada: 'الْمُعَلِّمُ',
    refKhabar: 'يُعَلِّمُ',
    explanation: 'Mubtada’ berupa isim ma‘rifat bersandang Al (الْمُعَلِّمُ), sedangkan Khabar berupa fi‘il mudhari’ penjelas (يُعَلِّمُ).'
  },
  {
    id: '6',
    sentenceAr: 'سَلْمَىْ مُمَرِّضَةٌ فِيْ الْمُسْتَشْفَىْ',
    sentenceId: 'Salma adalah seorang perawat di rumah sakit.',
    refMubtada: 'سَلْمَىْ',
    refKhabar: 'مُمَرِّضَةٌ',
    explanation: 'Mubtada’ berupa nama orang/isim alam (سَلْمَىْ) di awal kalimat, sedangkan Khabar berupa profesi/kata benda penjelas (مُمَرِّضَةٌ).'
  },
  {
    id: '7',
    sentenceAr: 'أَخِيْ صَحَفِيٌّ فِيْ غُرْفَةِ التَّحْرِيْرِ.',
    sentenceId: 'Saudara laki-lakiku adalah seorang jurnalis di ruang redaksi.',
    refMubtada: 'أَخِيْ',
    refKhabar: 'صَحَفِيٌّ',
    explanation: 'Mubtada’ berupa isim mudhaf (أَخِيْ) di awal kalimat, sedangkan Khabar adalah kata benda profesi penjelas (صَحَفِيٌّ).'
  },
  {
    id: '8',
    sentenceAr: 'هٰذِهِ الْمَكْتَبَةُ كَبِيْرَةٌ وَوَاسِعَةٌ',
    sentenceId: 'Perpustakaan ini besar dan luas.',
    refMubtada: 'هَذِهِ الْمَكْتَبَةُ',
    refKhabar: 'كَبِيْرَةٌ',
    explanation: 'Mubtada’ berupa isim isyarah diikuti isim bersandang Al (هٰذِهِ الْمَكْتَبَةُ), sedangkan Khabarnya berupa kata sifat penjelas pertama (كَبِيْرَةٌ).'
  },
  {
    id: '9',
    sentenceAr: 'أَبِي يَقْرَأُ الْجَرِيدَةَ كُلَّ صَبَاحٍ',
    sentenceId: 'Ayahku membaca koran setiap pagi.',
    refMubtada: 'أَبِي',
    refKhabar: 'يَقْرَأُ',
    explanation: 'Mubtada’ berupa isim mudhaf (أَبِي) di awal kalimat, sedangkan Khabarnya berupa kata kerja penjelas (يَقْرَأُ).'
  },
  {
    id: '10',
    sentenceAr: 'أَخِيْ الصَّغِيْرُ يَدْرُسُ فِي غُرْفَةِ الدِّرَاسَةِ',
    sentenceId: 'Adik laki-lakiku belajar di ruang belajar.',
    refMubtada: 'أَخِيْ الصَّغِيْرُ',
    refKhabar: 'يَدْرُسُ',
    explanation: 'Mubtada’ berupa frase penyifatan (أَخِيْ الصَّغِيْرُ), sedangkan Khabarnya berupa kata kerja penjelas (يَدْرُسُ).'
  }
];

interface DarsuTsaniEssayQuestion {
  id: string;
  sentenceAr: string;
  sentenceId: string;
  correctKey: string;
  correctText: string;
}

const DARSU_TSANI_ESSAY_QUESTIONS: DarsuTsaniEssayQuestion[] = [
  {
    id: '1',
    sentenceAr: 'هٰذَا مُدَرِّسٌ جَدِيدٌ فِيْ ....',
    sentenceId: 'Ini adalah guru baru di ....',
    correctKey: 'أ',
    correctText: 'أ. الْإِدَارَةِ'
  },
  {
    id: '2',
    sentenceAr: 'أَنَا .... الْكِتَابَ فِيْ الْمَكْتَبَةِ وَقْتَ الِاسْتِرَاحَةِ.',
    sentenceId: 'Saya .... buku di perpustakaan saat waktu istirahat.',
    correctKey: 'ب',
    correctText: 'ب. أَقْرَأُ'
  },
  {
    id: '3',
    sentenceAr: 'هُوَ يُحِبُّ .... الْقِصَصِ.',
    sentenceId: 'Dia menyukai .... cerita/kisah.',
    correctKey: 'ج',
    correctText: 'ج. قِرَاءَةَ'
  },
  {
    id: '4',
    sentenceAr: 'أَشْتَرِيْ .... مِنَ السُّوْقِ.',
    sentenceId: 'Saya membeli .... dari pasar.',
    correctKey: 'د',
    correctText: 'د. الْفَوَاكِهَ'
  },
  {
    id: '5',
    sentenceAr: 'أَلْعَبُ .... فِي الْمَيْدَانِ.',
    sentenceId: 'Saya bermain .... di lapangan.',
    correctKey: 'هـ',
    correctText: 'هـ. كُرَةَ السَّلَّةِ'
  }
];

const DARSU_TSANI_ESSAY_OPTIONS = [
  { key: 'أ', text: 'أ. الْإِدَارَةِ', color: 'emerald', bg: 'bg-emerald-500 hover:bg-emerald-600', activeGlow: 'ring-4 ring-emerald-400 bg-emerald-600 text-white shadow-lg', badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { key: 'ب', text: 'ب. أَقْرَأُ', color: 'amber', bg: 'bg-amber-500 hover:bg-amber-600', activeGlow: 'ring-4 ring-amber-400 bg-amber-600 text-white shadow-lg', badgeBg: 'bg-amber-100 text-amber-900 border-amber-300' },
  { key: 'ج', text: 'ج. قِرَاءَةَ', color: 'sky', bg: 'bg-sky-500 hover:bg-sky-600', activeGlow: 'ring-4 ring-sky-400 bg-sky-600 text-white shadow-lg', badgeBg: 'bg-sky-100 text-sky-900 border-sky-300' },
  { key: 'د', text: 'د. الْفَوَاكِهَ', color: 'rose', bg: 'bg-rose-500 hover:bg-rose-600', activeGlow: 'ring-4 ring-rose-400 bg-rose-600 text-white shadow-lg', badgeBg: 'bg-rose-100 text-rose-900 border-rose-300' },
  { key: 'هـ', text: 'هـ. كُرَةَ السَّلَّةِ', color: 'indigo', bg: 'bg-indigo-500 hover:bg-indigo-600', activeGlow: 'ring-4 ring-indigo-400 bg-indigo-600 text-white shadow-lg', badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300' }
];

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const TOPIC_QUIZ_QUESTIONS: Record<number, QuizQuestion[]> = {
  // Bab 1 - Topik 1: Huruf Istifham
  0: [
    {
      id: 1,
      question: "Kata tanya yang tepat untuk menanyakan daerah asal seseorang ('Dari mana kamu?') adalah...",
      options: ["مَنْ أَنْتَ", "مِنْ أَيْنَ أَنْتَ", "مَا هَذَا", "كَيْفَ حَالُكَ"],
      correctAnswer: 1,
      explanation: "Lafal 'مِنْ أَيْنَ' berarti 'Dari mana', digunakan untuk menanyakan asal tempat/daerah."
    },
    {
      id: 2,
      question: "Pertanyaan yang diawali kata tanya 'هَلْ' (apakah) wajib dijawab dengan...",
      options: ["نَعَمْ (Ya) atau لَا (Tidak)", "أَنَا (Saya)", "هُوَ (Dia)", "فِي (Di dalam)"],
      correctAnswer: 0,
      explanation: "Pertanyaan dengan 'هَلْ' menghendaki konfirmasi 'نَعَمْ' atau 'لَا'."
    },
    {
      id: 3,
      question: "Kata tanya manakah yang digunakan khusus untuk menanyakan manusia (makhluk berakal)?",
      options: ["مَا (Maa)", "مَنْ (Man)", "أَيْنَ (Ayna)", "كَمْ (Kam)"],
      correctAnswer: 1,
      explanation: "Lafal 'مَنْ' (Siapa) digunakan khusus untuk menanyakan yang berakal (lil-'aqil)."
    },
    {
      id: 4,
      question: "Apabila ada pertanyaan 'كَيْفَ حَالُكَ؟' (Bagaimana kabarmu?), jawaban santun yang tepat adalah...",
      options: ["اسْمِي أَحْمَد", "بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ", "أَنَا مِنْ جَاكَرْتَا", "هَذَا كِتَابِي"],
      correctAnswer: 1,
      explanation: "Jawaban sapaan kabar yang tepat adalah 'بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ' (Baik, segala puji bagi Allah)."
    },
    {
      id: 5,
      question: "Manakah kata tanya yang tepat untuk menanyakan benda mati / tidak berakal?",
      options: ["مَا (Maa)", "مَنْ (Man)", "هَلْ (Hal)", "مَتَى (Mata)"],
      correctAnswer: 0,
      explanation: "Lafal 'مَا' (Apa) digunakan untuk menanyakan sesuatu yang tidak berakal (lighairil 'aqil)."
    }
  ],
  // Bab 1 - Topik 2: Unsur Kalimat (Isim, Fi'il, Harf)
  1: [
    {
      id: 1,
      question: "Kata dalam bahasa Arab terbagi menjadi tiga jenis utama, yaitu...",
      options: ["Isim, Fi'il, dan Harf", "Mubtada', Khabar, dan Fa'il", "Mudzakkar, Mu'annats, dan Jamak", "Dhamir, Isyarah, dan Sifat"],
      correctAnswer: 0,
      explanation: "Tiga pembagian pokok kata bahasa Arab adalah Isim (kata benda), Fi'il (kata kerja), dan Harf (huruf)."
    },
    {
      id: 2,
      question: "Manakah di antara ciri-ciri berikut yang merupakan tanda fisik dari sebuah ISIM (Kata Benda)?",
      options: ["Dapat kemasukan Alif Lam (ال) dan Tanwin", "Menunjukkan waktu lampau", "Selalu diawali huruf Qad", "Tidak memiliki harakat akhir"],
      correctAnswer: 0,
      explanation: "Tanda isim di antaranya: menerima tanwin, alif lam (ال), dan diawali huruf jar."
    },
    {
      id: 3,
      question: "Kata 'كَتَبَ' (kataba - telah menulis) tergolong sebagai jenis kata...",
      options: ["Isim", "Fi'il", "Harf", "Sifat"],
      correctAnswer: 1,
      explanation: "'كَتَبَ' adalah Fi'il Madhi (kata kerja lampau) yang bermakna telah menulis."
    },
    {
      id: 4,
      question: "Manakah di antara kata-kata berikut yang termasuk kelompok HARF (Huruf)?",
      options: ["فِيْ (fii) dan مِنْ (min)", "مَدْرَسَةٌ (madrasatun)", "قَرَأَ (qara'a)", "أَحْمَدُ (Ahmadu)"],
      correctAnswer: 0,
      explanation: "'فِيْ' (di) dan 'مِنْ' (dari) adalah harf jar (preposisi)."
    },
    {
      id: 5,
      question: "Kata 'الْمَسْجِدُ' (Al-Masjidu) adalah Isim karena memiliki tanda...",
      options: ["Awalan Alif Lam (ال)", "Huruf Mudhara'ah", "Akhiran Ta Marbuthah", "Menunjukkan perbuatan"],
      correctAnswer: 0,
      explanation: "Tanda 'ال' (Alif Lam) di awal kata memastikan kata tersebut adalah Isim."
    }
  ],
  // Bab 1 - Topik 3: At-Tahiyyah & Dhomir
  2: [
    {
      id: 1,
      question: "Jika teman menyapa Anda dengan 'صَبَاحَ الْخَيْرِ' (Selamat pagi), maka jawaban yang tepat adalah...",
      options: ["مَسَاءَ النُّوْرِ", "صَبَاحَ النُّوْرِ", "أَهْلًا وَسَهْلًا", "مَعَ السَّلَامَةِ"],
      correctAnswer: 1,
      explanation: "Jawaban untuk 'صَبَاحَ الْخَيْرِ' adalah 'صَبَاحَ النُّوْرِ' (Selamat pagi juga)."
    },
    {
      id: 2,
      question: "Kata ganti tunggal (Dhamir) untuk subjek 'Saya' dalam bahasa Arab adalah...",
      options: ["أَنَا (Ana)", "أَنْتَ (Anta)", "هُوَ (Huwa)", "نَحْنُ (Nahnu)"],
      correctAnswer: 0,
      explanation: "'أَنَا' (Ana) bermakna Saya/Aku, berlaku untuk mudzakkar maupun mu'annats."
    },
    {
      id: 3,
      question: "Kata ganti (Dhamir) yang tepat untuk menunjuk 'Dia (Perempuan)' adalah...",
      options: ["هُوَ (Huwa)", "هِيَ (Hiya)", "أَنْتِ (Anti)", "أَنْتَ (Anta)"],
      correctAnswer: 1,
      explanation: "'هِيَ' (Hiya) adalah dhamir ghaibah untuk orang ketiga tunggal perempuan (Dia perempuan)."
    },
    {
      id: 4,
      question: "Ungkapan perpisahan 'إِلَى اللِّقَاءِ' (Sampai jumpa) lazim dibalas dengan...",
      options: ["مَعَ السَّلَامَةِ", "أَهْلًا بِكَ", "عَفْوًا", "شُكْرًا"],
      correctAnswer: 0,
      explanation: "Jawaban untuk 'إِلَى اللِّقَاءِ' adalah 'مَعَ السَّلَامَةِ' (Semoga keselamatan menyertaimu)."
    },
    {
      id: 5,
      question: "Panggilan ramah 'أَهْلًا وَسَهْلًا' (Selamat datang) dijawab untuk laki-laki dengan...",
      options: ["أَهْلًا بِكَ (Ahlan bika)", "أَهْلًا بِكِ (Ahlan biki)", "شُكْرًا جَزِيْلًا", "إِلَى اللِّقَاءِ"],
      correctAnswer: 0,
      explanation: "Untuk laki-laki (mudzakkar), dijawab 'أَهْلًا بِكَ'."
    }
  ],
  // Bab 1 - Topik 4: Tarkib Mubtada' & Khabar
  3: [
    {
      id: 1,
      question: "Dalam susunan Jumlah Ismiyah, subjek yang berada di awal kalimat dinamakan...",
      options: ["Mubtada'", "Khabar", "Fa'il", "Maf'ul Bih"],
      correctAnswer: 0,
      explanation: "Mubtada' adalah isim marfu' yang menjadi subjek awal dalam kalimat Jumlah Ismiyah."
    },
    {
      id: 2,
      question: "Manakah susunan Mubtada' dan Khabar yang benar secara kesesuaian gender (Mudzakkar - Mu'annats)?",
      options: ["التِّلْمِيْذُ نَشِيْطٌ", "الْمَدْرَسَةُ جَمِيْلٌ", "الْفَصْلُ كَبِيْرَةٌ", "التِّلْمِيْذَةُ مُجْتَهِدٌ"],
      correctAnswer: 0,
      explanation: "'التِّلْمِيْذُ نَشِيْطٌ' benar karena keduanya sama-sama bergender mudzakkar (laki-laki)."
    },
    {
      id: 3,
      question: "Lengkapi kalimat rumpang berikut: 'السَّبُّوْرَةُ ...' (Papan tulis itu bersih)",
      options: ["نَظِيْفَةٌ", "نَظِيْفٌ", "نَظِيْفَانِ", "نَظِيْفِيْنَ"],
      correctAnswer: 0,
      explanation: "'السَّبُّوْرَةُ' memiliki ta' marbuthah (mu'annats), maka khabar-nya wajib mu'annats: 'نَظِيْفَةٌ'."
    },
    {
      id: 4,
      question: "Harakat akhir pokok bagi Mubtada' dan Khabar pada isim mufrad adalah...",
      options: ["Dhammah (Marfu')", "Fathah (Manshub)", "Kasrah (Majrur)", "Sukun (Majzum)"],
      correctAnswer: 0,
      explanation: "Mubtada' dan Khabar hukum asalnya adalah marfu' dengan tanda dhammah."
    },
    {
      id: 5,
      question: "Manakah kalimat yang berarti 'Ini Ahmad, dia seorang siswa yang rajin'?",
      options: ["هَذَا أَحْمَدُ، هُوَ تِلْمِيْذٌ نَشِيْطٌ", "هَذِهِ فَاطِمَةُ، هِيَ تِلْمِيْذَةٌ", "أَنَا تِلْمِيْذٌ فِي الْمَدْرَسَةِ", "ذَلِكَ أُسْتَاذٌ مَاهِرٌ"],
      correctAnswer: 0,
      explanation: "Kalimat 'هَذَا أَحْمَدُ، هُوَ تِلْمِيْذٌ نَشِيْطٌ' tepat secara makna dan tata bahasa."
    }
  ]
};

interface DashboardViewProps {
  session: UserSession;
  onLogout: () => void;
  arabicScale: number;
  setArabicScale: React.Dispatch<React.SetStateAction<number>>;
  arabicFontFamily: string;
  setArabicFontFamily: React.Dispatch<React.SetStateAction<string>>;
  isArabicBold: boolean;
  setIsArabicBold: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DashboardView({ 
  session, 
  onLogout,
  arabicScale,
  setArabicScale,
  arabicFontFamily,
  setArabicFontFamily,
  isArabicBold,
  setIsArabicBold
}: DashboardViewProps) {
  // Main tabs (Menu Utama atas)
  // 1. Dashboard, 2. Profil, 3. KBC & Pembelajaran Mendalam, 4. CP Fase D, 5. Materi, 6. Evaluasi, 7. Referensi
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profil' | 'kbc' | 'cp' | 'materi' | 'evaluasi' | 'referensi'>('dashboard');
  const [offline, setOfflineState] = useState<boolean>(() => isOfflineMode());

  // Listen to offline mode changes globally
  useEffect(() => {
    const handleOfflineChange = () => {
      setOfflineState(isOfflineMode());
    };
    window.addEventListener('offline-mode-change', handleOfflineChange);
    return () => {
      window.removeEventListener('offline-mode-change', handleOfflineChange);
    };
  }, []);
  
  // Selected materi index in the list of materials
  const [selectedMateriIndex, setSelectedMateriIndex] = useState<number>(0);
  const [selectedChapter, setSelectedChapter] = useState<1 | 2>(1);

  const CURRENT_DAFTAR_MATERI = useMemo(() => {
    return selectedChapter === 1 ? DAFTAR_MATERI : DAFTAR_MATERI_BAB2;
  }, [selectedChapter]);

  const BAHAS_MATERI = useMemo(() => {
    return CURRENT_DAFTAR_MATERI[selectedMateriIndex] || CURRENT_DAFTAR_MATERI[0];
  }, [CURRENT_DAFTAR_MATERI, selectedMateriIndex]);

  const getVirtualIndex = (chapter: number, index: number): number => {
    return chapter === 1 ? index : index + 10;
  };

  // Materi Sub-tabs (1. Materi Kaidah, 2. Contoh Kalimat, 3. Latihan Mandiri, 4. Quiz Pemahaman) + Ice Breaking
  const [materiStep, setMateriStep] = useState<'ice_breaking' | 'kaidah' | 'contoh' | 'latihan' | 'quiz'>('kaidah');

  // Track maximum step unlocked for each material index (Progression Lock)
  const [materiStepProgress, setMateriStepProgress] = useState<Record<number, 'ice_breaking' | 'kaidah' | 'contoh' | 'latihan' | 'quiz'>>(() => {
    try {
      const saved = localStorage.getItem(`materi_step_progress_${session.name}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Interactive Quiz state for Stage 4
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const isStepUnlocked = (step: 'ice_breaking' | 'kaidah' | 'contoh' | 'latihan' | 'quiz') => {
    // Admin and Guru roles bypass sequential step lock entirely - BEBAS!
    if (session.peran === 'admin' || session.peran === 'guru') {
      return true;
    }
    
    // Ice breaking is always accessible as an engaging warm-up
    if (step === 'ice_breaking') {
      return true;
    }
    
    // Step 1: Materi (Kaidah) is always unlocked as the starting foundation
    if (step === 'kaidah') {
      return true;
    }
    
    const virtualIdx = getVirtualIndex(selectedChapter, selectedMateriIndex);
    const maxStepForCurrent = materiStepProgress[virtualIdx] || 'kaidah';
    
    const order: Array<'kaidah' | 'contoh' | 'latihan' | 'quiz'> = ['kaidah', 'contoh', 'latihan', 'quiz'];
    const stepIdx = order.indexOf(step as any);
    const maxIdx = order.indexOf(maxStepForCurrent as any);
    
    return stepIdx <= maxIdx;
  };

  // Helper to unlock step and persist
  const unlockStepForCurrentMateri = (step: 'ice_breaking' | 'kaidah' | 'contoh' | 'latihan' | 'quiz') => {
    const virtualIdx = getVirtualIndex(selectedChapter, selectedMateriIndex);
    const order: Array<'kaidah' | 'contoh' | 'latihan' | 'quiz'> = ['kaidah', 'contoh', 'latihan', 'quiz'];
    const currentMax = materiStepProgress[virtualIdx] || 'kaidah';
    
    if (step === 'ice_breaking') return;
    
    const stepIdx = order.indexOf(step as any);
    const currentMaxIdx = order.indexOf(currentMax as any);
    
    if (stepIdx > currentMaxIdx) {
      const newProgress = {
        ...materiStepProgress,
        [virtualIdx]: step
      };
      setMateriStepProgress(newProgress);
      try {
        localStorage.setItem(`materi_step_progress_${session.name}`, JSON.stringify(newProgress));
      } catch (e) {
        console.error(e);
      }
      if (session.name && session.peran === 'siswa') {
        saveStudentProgress(session.name, {
          peran: session.peran,
          kelas: session.kelas,
          gender: session.gender,
          materiStepProgress: newProgress
        });
      }
    }
  };

  // Resizable & Collapsible Sidebar states
  const [sidebarWidth, setSidebarWidth] = useState<number>(256);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [isSidebarDragging, setIsSidebarDragging] = useState<boolean>(false);

  // Collapsible Chapter & Topic Selector panel state
  const [isSelectorCollapsed, setIsSelectorCollapsed] = useState<boolean>(false);
  
  // Interactive Latihan state
  const [latihanAnswers, setLatihanAnswers] = useState<Record<number, number>>({});
  const [showLatihanResult, setShowLatihanResult] = useState<boolean>(false);
  const [latihanSecondsLeft, setLatihanSecondsLeft] = useState<number>(3600); // 1 hour (3600 seconds)
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Essay Latihan state (Only for Chapter 1, Topic 1)
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': ''
  });
  const [showEssayResult, setShowEssayResult] = useState<boolean>(false);

  // Simple check helper to see if student answer matches reference keywords
  const checkEssayCorrectness = (id: string, ans: string): 'correct' | 'partial' | 'neutral' => {
    const cleanAns = ans.toLowerCase().trim();
    if (!cleanAns) return 'neutral';
    
    // Clean vowels from arabic text for robust matching
    const removeDiacritics = (str: string) => {
      return str.replace(/[\u064B-\u0652]/g, "");
    };
    const plainAns = removeDiacritics(cleanAns);
    
    if (id === '1') {
      const isAli = plainAns.includes('ali') || plainAns.includes('علي');
      if (isAli) return 'correct';
    } else if (id === '2') {
      const hasYa = plainAns.includes('ya') || plainAns.includes('betul') || plainAns.includes('benar') || plainAns.includes('naam') || plainAns.includes('na\'am') || plainAns.includes('نعم');
      if (hasYa) return 'correct';
    } else if (id === '3') {
      const hasCirebon = plainAns.includes('cirebon') || plainAns.includes('cherbon') || plainAns.includes('cirbon') || plainAns.includes('sirbun') || plainAns.includes('شربو') || plainAns.includes('شيرب');
      const isHasan = plainAns.includes('hasan') || plainAns.includes('حسن') || plainAns.includes('هو');
      if (hasCirebon || isHasan) return 'correct';
    } else if (id === '4') {
      const hasBaca = plainAns.includes('baca') || plainAns.includes('membaca') || plainAns.includes('qira') || plainAns.includes('qiro') || plainAns.includes('قراء') || plainAns.includes('قراءه');
      if (hasBaca) return 'correct';
    } else if (id === '5') {
      const hasPerpus = plainAns.includes('perpus') || plainAns.includes('maktabah') || plainAns.includes('مكتب') || plainAns.includes('library');
      if (hasPerpus) return 'correct';
    }
    return 'partial';
  };

  // Essay Latihan state for Chapter 1, Topic 2 (Mubtada' wal Khabar)
  const [mubtadaEssayAnswers, setMubtadaEssayAnswers] = useState<Record<string, { mubtada: string; khabar: string }>>({
    '1': { mubtada: '', khabar: '' },
    '2': { mubtada: '', khabar: '' },
    '3': { mubtada: '', khabar: '' },
    '4': { mubtada: '', khabar: '' },
    '5': { mubtada: '', khabar: '' },
    '6': { mubtada: '', khabar: '' },
    '7': { mubtada: '', khabar: '' },
    '8': { mubtada: '', khabar: '' },
    '9': { mubtada: '', khabar: '' },
    '10': { mubtada: '', khabar: '' }
  });
  const [showMubtadaEssayResult, setShowMubtadaEssayResult] = useState<boolean>(false);

  // Tahiyyah Essay State (Chapter 1, Topic 3/Material with id 3)
  const [tahiyyahEssayAnswers, setTahiyyahEssayAnswers] = useState<Record<string, string>>({
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': ''
  });
  const [showTahiyyahEssayResult, setShowTahiyyahEssayResult] = useState<boolean>(false);
  const [tahiyyahEssayAnimatedScore, setTahiyyahEssayAnimatedScore] = useState<number>(0);

  const checkTahiyyahEssayCorrectness = (id: string, ans: string): boolean => {
    const correctAnswers: Record<string, string> = {
      '1': 't',
      '2': 'th',
      '3': 'a',
      '4': 'b',
      '5': 'j'
    };
    return correctAnswers[id] === ans;
  };

  // Score count-up animation when Tahiyyah Essay results are revealed
  useEffect(() => {
    if (showTahiyyahEssayResult) {
      const correctCount = Object.keys(tahiyyahEssayAnswers).filter(key => checkTahiyyahEssayCorrectness(key, tahiyyahEssayAnswers[key])).length;
      const targetScore = Math.round((correctCount / 5) * 100);
      setTahiyyahEssayAnimatedScore(0);
      let start = 0;
      const duration = 1500; // 1.5 seconds animation
      const startTime = performance.now();
      
      let animationFrameId: number;
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuad curve
        const easeProgress = progress * (2 - progress);
        const currentVal = Math.round(easeProgress * targetScore);
        
        setTahiyyahEssayAnimatedScore(currentVal);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setTahiyyahEssayAnimatedScore(targetScore);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    } else {
      setTahiyyahEssayAnimatedScore(0);
    }
  }, [showTahiyyahEssayResult, tahiyyahEssayAnswers]);

  // Tata Bahasa Tiga (Kata Ganti Personal Tunggal) Essay State (BAHAS_MATERI.id === 4)
  const [personalDhamirEssayAnswers, setPersonalDhamirEssayAnswers] = useState<Record<string, string>>({
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': ''
  });
  const [showPersonalDhamirEssayResult, setShowPersonalDhamirEssayResult] = useState<boolean>(false);
  const [personalDhamirEssayAnimatedScore, setPersonalDhamirEssayAnimatedScore] = useState<number>(0);

  const checkPersonalDhamirEssayCorrectness = (id: string, ans: string): boolean => {
    const cleanAns = ans ? ans.trim() : "";
    if (!cleanAns) return false;

    const normalize = (str: string) => {
      // Remove all Arabic diacritics, harakat, combining marks, wasla, dagger alif, tatweel/kashida
      let cleaned = str.replace(/[\u064B-\u0652\u0653\u0654\u0655\u0670\u0671\u0640]/g, "");
      // Normalize different Alif hamza forms (أ, إ, آ, ٱ, ا) to standard plain Alif (ا)
      cleaned = cleaned.replace(/[أإآٱا]/g, "ا");
      // Normalize Alif Maqsura (ى), Ya (ي), and Farsi/Urdu Yeh (ی) to standard Arabic Ya (ي)
      cleaned = cleaned.replace(/[ىيی]/g, "ي");
      // Normalize Ta Marbuta (ة) to Ha (ه)
      cleaned = cleaned.replace(/[ةۀ]/g, "ه");
      // Replace punctuation, commas, periods, quotes, etc. with space
      cleaned = cleaned.replace(/[،.؟?,\-:;؛"'«»!()[\]]/g, " ");
      // Replace multiple spaces with a single space
      cleaned = cleaned.replace(/\s+/g, " ");
      return cleaned.trim();
    };

    const normUser = normalize(cleanAns);

    const refAnswers: Record<string, string[]> = {
      '1': [
        'انا طبيب جديد في هذا المستشفى',
        'انا طبيب جديد في هذا المستشفي',
        'انا طبيب جديد في هذا مستشفى',
        'انا طبيب جديد في هذا مستشفي',
        'في هذا المستشفى انا طبيب جديد',
        'في هذا المستشفي انا طبيب جديد'
      ],
      '2': [
        'هذا علي هو جندي',
        'هذا علي وهو جندي',
        'هذا علي هو الجندي',
        'هذا علي وهو الجندي',
        'هذا علي، هو جندي',
        'هذا علي. هو جندي',
        'هذا علي، وهو جندي',
        'هذا علي. وهو جندي',
        'هذا علي جندي',
        'هو جندي هذا علي'
      ],
      '3': [
        'هذه فاطمه هي مدرسه',
        'هذه فاطمه وهي مدرسه',
        'هذه فاطمه هي المدرسه',
        'هذه فاطمه وهي المدرسه',
        'هذه فاطمه، هي مدرسه',
        'هذه فاطمه. هي مدرسه',
        'هذه فاطمه، وهي مدرسه',
        'هذه فاطمه. وهي مدرسه',
        'هذه فاطمه مدرسه',
        'هي مدرسه هذه فاطمه'
      ],
      '4': [
        'انت تدرس اللغه العربيه في غرفه الدرس',
        'انت تدرس لغه عربيه في غرفه الدرس',
        'انت تدرس في غرفه الدرس اللغه العربيه',
        'انت تدرس في غرفه الدرس لغه عربيه',
        'تدرس اللغه العربيه في غرفه الدرس',
        'تدرس لغه عربيه في غرفه الدرس',
        'تدرس في غرفه الدرس اللغه العربيه',
        'انت تدرس اللغه العربيه في غرفه الفصل'
      ],
      '5': [
        'هو يسكن في القرية',
        'هو يسكن في القريه',
        'هو يسكن في قرية',
        'هو يسكن في قريه',
        'يسكن هو في القرية',
        'يسكن هو في القريه',
        'يسكن في القرية',
        'يسكن في القريه'
      ]
    };

    const refs = refAnswers[id];
    if (!refs) return false;

    // Check direct normalized match
    if (refs.some(ref => normalize(ref) === normUser)) {
      return true;
    }

    // Smart fallback keyword matching if minor structural variation occurs
    if (id === '1') {
      return normUser.includes('طبيب') && normUser.includes('جديد') && normUser.includes('المستش') && normUser.includes('هذا');
    } else if (id === '2') {
      return normUser.includes('هذا') && normUser.includes('علي') && normUser.includes('جندي');
    } else if (id === '3') {
      return normUser.includes('هذه') && normUser.includes('فاطم') && normUser.includes('مدرس');
    } else if (id === '4') {
      return normUser.includes('تدرس') && normUser.includes('العرب') && normUser.includes('غرف') && normUser.includes('الدرس');
    } else if (id === '5') {
      return normUser.includes('يسكن') && normUser.includes('القر') && normUser.includes('في');
    }

    return false;
  };

  // Score count-up animation when Personal Dhamir Essay results are revealed
  useEffect(() => {
    if (showPersonalDhamirEssayResult) {
      const correctCount = Object.keys(personalDhamirEssayAnswers).filter(key => checkPersonalDhamirEssayCorrectness(key, personalDhamirEssayAnswers[key])).length;
      const targetScore = Math.round((correctCount / 5) * 100);
      setPersonalDhamirEssayAnimatedScore(0);
      const duration = 1500; // 1.5 seconds animation
      const startTime = performance.now();
      
      let animationFrameId: number;
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress * (2 - progress);
        const currentVal = Math.round(easeProgress * targetScore);
        
        setPersonalDhamirEssayAnimatedScore(currentVal);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setPersonalDhamirEssayAnimatedScore(targetScore);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    } else {
      setPersonalDhamirEssayAnimatedScore(0);
    }
  }, [showPersonalDhamirEssayResult, personalDhamirEssayAnswers]);

  // Darsu Tsani (Bab 2 Materi 1) Essay State (BAHAS_MATERI.id === 101)
  const [darsuTsaniEssayAnswers, setDarsuTsaniEssayAnswers] = useState<Record<string, string>>({
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': ''
  });
  const [showDarsuTsaniEssayResult, setShowDarsuTsaniEssayResult] = useState<boolean>(false);

  // Check correctness of Mubtada and Khabar answers
  const checkMubtadaKhabarCorrectness = (id: string, userMubtada: string, userKhabar: string): { mubtada: 'correct' | 'incorrect'; khabar: 'correct' | 'incorrect' } => {
    // Clean vowels and normalize common variations from arabic text for robust matching
    const normalizeArabic = (str: string) => {
      let cleaned = str.replace(/[\u064B-\u0652]/g, ""); // remove diacritics
      cleaned = cleaned.replace(/[أإآا]/g, "ا"); // normalize alif hamza
      cleaned = cleaned.replace(/[ىي]/g, "ي"); // normalize alif maqsura and ya
      cleaned = cleaned.replace(/ة/g, "ه"); // normalize ta marbuta
      return cleaned.trim().toLowerCase();
    };

    const cleanMub = normalizeArabic(userMubtada);
    const cleanKhab = normalizeArabic(userKhabar);

    let mubCorrect = false;
    let khabCorrect = false;

    if (id === '1') {
      // 1) عَلِيٌّ مُعَلِّمٌ جَدِيْدٌ.
      // Mubtada: علي معلم or علي or ali
      mubCorrect = cleanMub === 'علي' || cleanMub === 'علي معلم' || cleanMub.includes('ali');
      // Khabar: معلم or mualim or muallim
      khabCorrect = cleanKhab === 'معلم' || cleanKhab.includes('mualim') || cleanKhab.includes('muallim');
    } else if (id === '2') {
      // 2) أَنَا مُهَنْدِسٌ فِي سُورَابَايَا.
      // Mubtada: انا or ana or saya
      mubCorrect = cleanMub === 'انا' || cleanMub.includes('ana') || cleanMub.includes('saya');
      // Khabar: مهندس or muhandis or insinyur
      khabCorrect = cleanKhab === 'مهندس' || cleanKhab.includes('muhandis') || cleanKhab.includes('insinyur');
    } else if (id === '3') {
      // 3) أَبِي يَزْرَعُ الْأَرُزَّ فِي الْحَقْلِ.
      // Mubtada: ابي يزرع or abi yazaru or abi or ayah
      mubCorrect = cleanMub === 'ابي' || cleanMub === 'ابي يزرع' || cleanMub.includes('abi') || cleanMub.includes('ayah');
      // Khabar: يزرع or yazra or menanam
      khabCorrect = cleanKhab.includes('يزرع') || cleanKhab.includes('yazra') || cleanKhab.includes('menanam');
    } else if (id === '4') {
      // 4) أُمِّي تَطْبَخُ الطَّعَامَ فِيْ الْمَطْبَخِ.
      // Mubtada: امي or umi or ummi or ibu
      mubCorrect = cleanMub === 'امي' || cleanMub.includes('umi') || cleanMub.includes('ummi') || cleanMub.includes('ibu');
      // Khabar: تطبخ or tatbakhu or memasak
      khabCorrect = cleanKhab.includes('تطبخ') || cleanKhab.includes('tatbakhu') || cleanKhab.includes('memasak');
    } else if (id === '5') {
      // 5) الْمُعَلِّمُ يُعَلِّمُ فِيْ الْمَدْرَسَةِ.
      // Mubtada: المعلم or al-muallim or guru
      mubCorrect = cleanMub === 'المعلم' || cleanMub.includes('al-muallim') || cleanMub.includes('al muallim') || cleanMub.includes('guru');
      // Khabar: يعلم or yualimu or mengajar
      khabCorrect = cleanKhab.includes('يعلم') || cleanKhab.includes('yualimu') || cleanKhab.includes('mengajar');
    } else if (id === '6') {
      // 6) سَلْمَىْ مُمَرِّضَةٌ فِيْ الْمُسْتَشْفَىْ
      // Mubtada: سلمى or سلمي or salma
      mubCorrect = cleanMub === 'سلمي' || cleanMub === 'سلمى' || cleanMub.includes('salma');
      // Khabar: ممرضة or perawat or mumarridah
      khabCorrect = cleanKhab === 'ممرضه' || cleanKhab.includes('mumarridah') || cleanKhab.includes('perawat');
    } else if (id === '7') {
      // 7) أَخِيْ صَحَفِيٌّ فِيْ غُرْفَةِ التَّحْرِيْرِ.
      // Mubtada: اخي or akhi or saudara
      mubCorrect = cleanMub === 'اخi' || cleanMub === 'اخي' || cleanMub.includes('akhi') || cleanMub.includes('saudara');
      // Khabar: صحفي or wartawan or jurnalis or sahafiy
      khabCorrect = cleanKhab === 'صحفي' || cleanKhab.includes('sahafiy') || cleanKhab.includes('sahafi') || cleanKhab.includes('wartawan') || cleanKhab.includes('jurnalis');
    } else if (id === '8') {
      // 8) هٰذِهِ الْمَكْتَبَةُ كَبِيْرَةٌ وَوَاسِعَةٌ
      // Mubtada: هذه المكتبة or هذه or hadzihi or perpustakaan
      mubCorrect = cleanMub === 'هذه المكتبه' || cleanMub === 'هذه' || cleanMub.includes('hadzihi') || cleanMub.includes('hadhihi') || cleanMub.includes('perpustakaan');
      // Khabar: كبيرة or besar or kabirah
      khabCorrect = cleanKhab === 'كبيره' || cleanKhab.includes('kabirah') || cleanKhab.includes('besar');
    } else if (id === '9') {
      // 9) أَبِي يَقْرَأُ الْجَرِيدَةَ كُلَّ صَبَاحٍ
      // Mubtada: ابي or abi or ayah
      mubCorrect = cleanMub === 'ابي' || cleanMub.includes('abi') || cleanMub.includes('ayah');
      // Khabar: يقرأ or membaca or yaqra
      khabCorrect = cleanKhab.includes('يقرا') || cleanKhab.includes('yaqra') || cleanKhab.includes('membaca');
    } else if (id === '10') {
      // 10) أَخِيْ الصَّغِيْرُ يَدْرُسُ فِي غُرْفَةِ الدِّرَاسَةِ
      // Mubtada: اخي الصغير or adik or akhi
      mubCorrect = cleanMub === 'اخي الصغير' || cleanMub === 'اخي' || cleanMub.includes('akhi') || cleanMub.includes('adik');
      // Khabar: يدرس or belajar or yadrusu
      khabCorrect = cleanKhab.includes('يدرس') || cleanKhab.includes('yadrusu') || cleanKhab.includes('belajar');
    }

    return {
      mubtada: mubCorrect ? 'correct' : 'incorrect',
      khabar: khabCorrect ? 'correct' : 'incorrect'
    };
  };

  // Set of material indices that the student has completed (submitted the exercise for)
  const [completedMateriIndices, setCompletedMateriIndices] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`completed_materi_${session.name}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const isMateriUnlocked = (index: number): boolean => {
    // Admin and Guru roles bypass sequential lock entirely
    if (session.peran === 'admin' || session.peran === 'guru') {
      return true;
    }
    // First topic is always unlocked
    if (index === 0) {
      return true;
    }
    // Any other topic requires ALL preceding topics to be completed
    for (let i = 0; i < index; i++) {
      if (!completedMateriIndices.includes(getVirtualIndex(selectedChapter, i))) {
        return false;
      }
    }
    return true;
  };

  const handleMateriChange = (index: number) => {
    if (!isMateriUnlocked(index)) {
      showToast(`Materi "${CURRENT_DAFTAR_MATERI[index]?.topik.split(':')[0] || 'ini'}" dikunci! Selesaikan latihan materi sebelumnya terlebih dahulu.`, "error");
      return;
    }
    setSelectedMateriIndex(index);
    setMateriStep('kaidah'); // Default to Kaidah (Materi) step: Materi -> Contoh -> Latihan -> Quiz!
    setLatihanAnswers({});
    setShowLatihanResult(false);
    setQuizAnswers({});
    setShowQuizResult(false);
  };

  // Reset exercise states for Admin only when switching material, chapter, or step
  useEffect(() => {
    if (session.peran === 'admin') {
      setLatihanAnswers({});
      setShowLatihanResult(false);
      setEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
      setShowEssayResult(false);
      setTahiyyahEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
      setShowTahiyyahEssayResult(false);
      setPersonalDhamirEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
      setShowPersonalDhamirEssayResult(false);
      setMubtadaEssayAnswers({
        '1': { mubtada: '', khabar: '' },
        '2': { mubtada: '', khabar: '' },
        '3': { mubtada: '', khabar: '' },
        '4': { mubtada: '', khabar: '' },
        '5': { mubtada: '', khabar: '' },
        '6': { mubtada: '', khabar: '' },
        '7': { mubtada: '', khabar: '' },
        '8': { mubtada: '', khabar: '' },
        '9': { mubtada: '', khabar: '' },
        '10': { mubtada: '', khabar: '' }
      });
      setShowMubtadaEssayResult(false);
    }
  }, [selectedMateriIndex, selectedChapter, materiStep, session.peran]);

  // Interactive Evaluasi state
  const [evaluasiAnswers, setEvaluasiAnswers] = useState<Record<number, number>>({});
  const [evaluasiSubmitted, setEvaluasiSubmitted] = useState<boolean>(false);
  const [evaluasiScore, setEvaluasiScore] = useState<number>(0);
  const [localScores, setLocalScores] = useState<StudentScore[]>(MOCK_STUDENT_SCORES);

  // Evaluasi Grade Management Input Form State
  const evalFormRef = useRef<HTMLDivElement>(null);
  const [evalInputName, setEvalInputName] = useState<string>('');
  const [evalInputClass, setEvalInputClass] = useState<string>('Kelas 7A');
  const [evalInputGender, setEvalInputGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [evalInputScore, setEvalInputScore] = useState<string>('85');
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<StudentScore | null>(null);
  const [showSyukronModal, setShowSyukronModal] = useState<boolean>(false);
  const [lastSavedRecord, setLastSavedRecord] = useState<StudentScore | null>(null);
  const [scoreSearchFilter, setScoreSearchFilter] = useState<string>('');
  const [scoreClassFilter, setScoreClassFilter] = useState<string>('Semua');

  // Pre-fill form from user session if available
  useEffect(() => {
    if (session.name && !editingScoreId) {
      setEvalInputName(session.name);
    }
    if (session.kelas && !editingScoreId) {
      setEvalInputClass(session.kelas);
    }
    if (session.gender && !editingScoreId) {
      setEvalInputGender(session.gender === 'perempuan' ? 'Perempuan' : 'Laki-laki');
    }
  }, [session, editingScoreId]);

  const handleSaveEvaluationScore = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (session.peran !== 'admin') {
      showToast("Akses Ditolak: Hanya Administrator yang berwenang menginput atau mengganti nilai murid.", "error");
      return;
    }
    if (!evalInputName.trim()) {
      showToast("Harap masukan Nama Siswa terlebih dahulu!", "error");
      return;
    }
    const numScore = Math.min(100, Math.max(0, Number(evalInputScore) || 0));
    const statusVal: 'Lulus' | 'Remedial' = numScore >= 75 ? 'Lulus' : 'Remedial';
    
    // Check if an existing record matches by editingScoreId or student name
    const existingIndex = localScores.findIndex(
      s => (editingScoreId && (s.id === editingScoreId || (s.id && s.id.toLowerCase() === editingScoreId.toLowerCase()))) ||
           (!editingScoreId && s.name.trim().toLowerCase() === evalInputName.trim().toLowerCase() && 
            (s.class || 'Kelas 7A').trim().toLowerCase() === (evalInputClass.trim() || 'Kelas 7A').toLowerCase())
    );

    const targetDocId = editingScoreId || (existingIndex >= 0 ? localScores[existingIndex].id : null) || `score_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const record: StudentScore = {
      id: targetDocId,
      name: evalInputName.trim(),
      gender: evalInputGender,
      role: 'Siswa',
      class: evalInputClass.trim() || 'Kelas 7A',
      score: numScore,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: statusVal,
      narrativeScore: getNarrativeScore({
        name: evalInputName.trim(),
        class: evalInputClass.trim() || 'Kelas 7A',
        gender: evalInputGender,
        role: 'Siswa',
        score: numScore,
        date: '',
        status: statusVal
      })
    };

    if (editingScoreId || existingIndex >= 0) {
      setLocalScores(prev => prev.map((s, idx) => {
        const sId = s.id || '';
        const matchId = (sId && sId === targetDocId);
        const matchName = s.name.trim().toLowerCase() === evalInputName.trim().toLowerCase();
        if (matchId || matchName || idx === existingIndex) {
          return record;
        }
        return s;
      }));
      await saveStudentScore(record);
      showToast(`Data nilai siswa "${record.name}" berhasil diperbarui oleh Administrator!`, "success");
      setEditingScoreId(null);
    } else {
      setLocalScores(prev => [record, ...prev.filter(s => s.name.trim().toLowerCase() !== record.name.trim().toLowerCase())]);
      await saveStudentScore(record);
      showToast(`Data nilai baru "${record.name}" berhasil disimpan secara sistem!`, "success");
    }

    setLastSavedRecord(record);
    setShowSyukronModal(true);

    setEvalInputName('');
    setEvalInputScore('85');
  };

  const handleEditScore = (score: StudentScore) => {
    if (session.peran !== 'admin') {
      showToast("Akses Ditolak: Hanya Administrator yang berwenang mengganti atau mengedit nilai murid.", "error");
      return;
    }
    const idToEdit = score.id || `mock_${score.name.toLowerCase().replace(/\s+/g, '_')}`;
    setEditingScoreId(idToEdit);
    setEvalInputName(score.name);
    setEvalInputClass(score.class || 'Kelas 7A');
    setEvalInputGender(score.gender || 'Laki-laki');
    setEvalInputScore(String(score.score));
    
    if (evalFormRef.current) {
      evalFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast(`Mengedit data nilai siswa: ${score.name}`, "info");
  };

  const handleDeleteScore = (score: StudentScore) => {
    if (session.peran !== 'admin') {
      showToast("Akses Ditolak: Hanya Administrator yang berwenang menghapus data nilai murid.", "error");
      return;
    }
    setDeletingRecord(score);
  };

  const confirmDeleteRecord = async () => {
    if (!deletingRecord) return;
    if (session.peran !== 'admin') {
      showToast("Akses Ditolak: Hanya Administrator yang berwenang menghapus data nilai murid.", "error");
      setDeletingRecord(null);
      return;
    }
    const targetId = deletingRecord.id || `mock_${deletingRecord.name.toLowerCase().replace(/\s+/g, '_')}`;
    const targetName = deletingRecord.name.trim().toLowerCase();
    
    await deleteStudentScore(targetId, deletingRecord.name, 'admin');
    
    setLocalScores(prev => prev.filter(s => {
      const sName = (s.name || '').trim().toLowerCase();
      const sId = s.id || '';
      if (deletingRecord.id && sId === deletingRecord.id) return false;
      if (targetId && sId === targetId) return false;
      if (!deletingRecord.id && !targetId && sName === targetName) return false;
      return true;
    }));
    
    showToast(`Data nilai "${deletingRecord.name}" berhasil dihapus oleh Administrator.`, "info");
    setDeletingRecord(null);
  };

  const handleResetForm = () => {
    setEditingScoreId(null);
    if (session.peran === 'siswa') {
      setEvalInputName(session.name || '');
      setEvalInputClass(session.kelas || 'Kelas 7A');
      setEvalInputGender(session.gender === 'perempuan' ? 'Perempuan' : 'Laki-laki');
    } else {
      setEvalInputName('');
      setEvalInputClass(session.kelas || 'Kelas 7A');
      setEvalInputGender('Laki-laki');
    }
    setEvalInputScore('85');
    showToast("Pengeditan data nilai dibatalkan.", "info");
  };

  const filteredScores = useMemo(() => {
    return localScores.filter(s => {
      const matchSearch = !scoreSearchFilter || 
        s.name.toLowerCase().includes(scoreSearchFilter.toLowerCase()) ||
        s.class.toLowerCase().includes(scoreSearchFilter.toLowerCase());
      const matchClass = scoreClassFilter === 'Semua' || s.class === scoreClassFilter;
      return matchSearch && matchClass;
    });
  }, [localScores, scoreSearchFilter, scoreClassFilter]);

  const uniqueClasses = useMemo(() => {
    const setCls = new Set<string>();
    localScores.forEach(s => { if (s.class) setCls.add(s.class); });
    return ['Semua', ...Array.from(setCls)];
  }, [localScores]);

  // Synchronize student progress with Firestore in real-time
  useEffect(() => {
    if (!session.name || session.peran !== 'siswa') return;
    
    const unsubscribe = listenToStudentProgress(session.name, (progress) => {
      if (progress) {
        if (progress.completedMateriIndices) {
          setCompletedMateriIndices(progress.completedMateriIndices);
          try {
            localStorage.setItem(`completed_materi_${session.name}`, JSON.stringify(progress.completedMateriIndices));
          } catch (e) {
            console.error(e);
          }
        }
        if (progress.materiStepProgress) {
          setMateriStepProgress(progress.materiStepProgress as any);
          try {
            localStorage.setItem(`materi_step_progress_${session.name}`, JSON.stringify(progress.materiStepProgress));
          } catch (e) {
            console.error(e);
          }
        }
        if (progress.latihanAnswers) {
          setLatihanAnswers(progress.latihanAnswers);
        }
        if (progress.darsuTsaniEssayAnswers && Object.keys(progress.darsuTsaniEssayAnswers).length > 0) {
          setDarsuTsaniEssayAnswers(progress.darsuTsaniEssayAnswers);
        }
        if (progress.showDarsuTsaniEssayResult !== undefined) {
          setShowDarsuTsaniEssayResult(progress.showDarsuTsaniEssayResult);
        }
        if (progress.tahiyyahEssayAnswers && Object.keys(progress.tahiyyahEssayAnswers).length > 0) {
          setTahiyyahEssayAnswers(progress.tahiyyahEssayAnswers);
        }
        if (progress.showTahiyyahEssayResult !== undefined) {
          setShowTahiyyahEssayResult(progress.showTahiyyahEssayResult);
        }
        if (progress.personalDhamirEssayAnswers && Object.keys(progress.personalDhamirEssayAnswers).length > 0) {
          setPersonalDhamirEssayAnswers(progress.personalDhamirEssayAnswers);
        }
        if (progress.showPersonalDhamirEssayResult !== undefined) {
          setShowPersonalDhamirEssayResult(progress.showPersonalDhamirEssayResult);
        }
        if (progress.mubtadaEssayAnswers && Object.keys(progress.mubtadaEssayAnswers).length > 0) {
          setMubtadaEssayAnswers(progress.mubtadaEssayAnswers);
        }
        if (progress.showMubtadaEssayResult !== undefined) {
          setShowMubtadaEssayResult(progress.showMubtadaEssayResult);
        }
      }
    });

    return () => unsubscribe();
  }, [session.name, session.peran, offline]);

  // Synchronize scores table with Firestore in real-time
  useEffect(() => {
    const unsubscribe = listenToAllScores((fireScores) => {
      if (fireScores) {
        setLocalScores(fireScores);
      }
    });

    return () => unsubscribe();
  }, [offline]);
  
  // Custom toast notifications
  const [toast, setToast] = useState<{ text: string; type: 'error' | 'success' | 'info' } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (text: string, type: 'error' | 'success' | 'info' = 'info') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ text, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };
  
  // Search state for Referensi
  const [referensiSearch, setReferensiSearch] = useState<string>('');
  
  // Mobile menu / sidebar toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Quotes index in Dashboard Sidebar
  const [activeQuoteIdx, setActiveQuoteIdx] = useState<number>(0);

  // States for profile ID card flipping & copying info
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Arabic Accessibility Options
  const [showFontSettings, setShowFontSettings] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartY = useRef<number>(0);
  const dragStartScale = useRef<number>(1.25);

  // Helper to render text containing Arabic substrings nicely with scaled fonts
  const renderTextWithArabic = (text: string, customFontFamily?: string, sizeMultiplier: number = 1.0) => {
    if (!text) return '';
    const arabicRegex = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+(?:[\s\u064B-\u0652\u0670]*[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)*)/g;
    const parts = text.split(arabicRegex);
    return (
      <>
        {parts.map((part, index) => {
          if (arabicRegex.test(part)) {
            return (
              <span 
                key={index} 
                className="arabic inline-block bg-slate-50 border border-slate-100 rounded px-2 mx-0.5 text-center transition-all duration-75 align-middle font-bold" 
                style={{ 
                  fontFamily: customFontFamily || arabicFontFamily, 
                  fontSize: `${18 * arabicScale * sizeMultiplier}px`, 
                  fontWeight: isArabicBold ? 'bold' : 'normal',
                  lineHeight: 1.6,
                  direction: 'rtl'
                }}
              >
                {part}
              </span>
            );
          }
          return <span key={index} style={{ fontFamily: "'Times New Roman', Times, serif" }}>{part}</span>;
        })}
      </>
    );
  };

  // Helper to convert English numerals to Eastern Arabic numerals (١, ٢, ٣...)
  const toArabicNumber = (num: number | string): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => {
      const d = parseInt(digit);
      return isNaN(d) ? digit : arabicDigits[d];
    }).join('');
  };

  const formatLatihanTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const formatLatihanTimeArabic = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const pad = (n: number) => n.toString().padStart(2, '0');
    const englishTime = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    
    return englishTime.split('').map(char => {
      if (char === ':') return ':';
      return toArabicNumber(char);
    }).join('');
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScale.current = arabicScale;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaY = dragStartY.current - e.clientY; // Drag UP (clientY decreases) -> deltaY is positive
    const newScale = Math.min(2.5, Math.max(0.8, dragStartScale.current + (deltaY / 150)));
    setArabicScale(Number(newScale.toFixed(2)));
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Handle Latihan Submission
  const handleLatihanSelect = (questionId: number, optionIndex: number) => {
    if (showLatihanResult) return; // Locked after submitting
    const newAnswers = { ...latihanAnswers, [questionId]: optionIndex };
    setLatihanAnswers(newAnswers);
    if (session.name && session.peran === 'siswa') {
      saveStudentProgress(session.name, {
        latihanAnswers: newAnswers
      });
    }
  };

  const calculateLatihanScore = () => {
    let correctCount = 0;
    BAHAS_MATERI.latihanList.forEach(q => {
      if (latihanAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    return Math.round((correctCount / BAHAS_MATERI.latihanList.length) * 100);
  };

  const getLatihanCorrectCount = () => {
    let correctCount = 0;
    BAHAS_MATERI.latihanList.forEach(q => {
      if (latihanAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const handleKirimSemuaJawaban = (isAutoSubmit: boolean = false) => {
    if (!isAutoSubmit && Object.keys(latihanAnswers).length < BAHAS_MATERI.latihanList.length) {
      showToast("Jawab semua pertanyaan latihan sebelum mengirim!", "error");
      return;
    }
    setShowLatihanResult(true);
    if (isAutoSubmit) {
      showToast("Waktu habis! Jawaban Anda telah dikirim secara otomatis.", "info");
    } else {
      showToast("Hasil latihan berhasil dikirim!", "success");
    }

    if (BAHAS_MATERI.id === 3 || BAHAS_MATERI.id === 101) {
      setTimeout(() => {
        const essaySec = document.getElementById(
          BAHAS_MATERI.id === 101 ? 'darsu-tsani-essay-practice-section' : 'tahiyyah-essay-practice-section'
        );
        if (essaySec) {
          essaySec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 800);
    }

    let newCompleted = completedMateriIndices;
    const virtualIdx = getVirtualIndex(selectedChapter, selectedMateriIndex);
    if (!completedMateriIndices.includes(virtualIdx)) {
      newCompleted = [...completedMateriIndices, virtualIdx];
      setCompletedMateriIndices(newCompleted);
      try {
        localStorage.setItem(`completed_materi_${session.name}`, JSON.stringify(newCompleted));
      } catch (e) {
        console.error(e);
      }
    }
    saveStudentProgress(session.name, {
      peran: session.peran,
      kelas: session.kelas,
      gender: session.gender,
      completedMateriIndices: newCompleted,
      latihanAnswers: latihanAnswers
    });
  };

  const resetLatihan = () => {
    setLatihanAnswers({});
    setShowLatihanResult(false);
    setLatihanSecondsLeft(3600);
    setTahiyyahEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
    setShowTahiyyahEssayResult(false);
    setPersonalDhamirEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
    setShowPersonalDhamirEssayResult(false);
    setDarsuTsaniEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
    setShowDarsuTsaniEssayResult(false);
  };

  const handleLanjutKeTataBahasaDua = () => {
    // Mark current topic (Virtual index of Bab 1 index 0) as completed
    const virtualIdx = getVirtualIndex(selectedChapter, selectedMateriIndex);
    let newCompleted = completedMateriIndices;
    if (!completedMateriIndices.includes(virtualIdx)) {
      newCompleted = [...completedMateriIndices, virtualIdx];
      setCompletedMateriIndices(newCompleted);
      try {
        localStorage.setItem(`completed_materi_${session.name}`, JSON.stringify(newCompleted));
      } catch (e) {
        console.error(e);
      }
    }
    saveStudentProgress(session.name, {
      peran: session.peran,
      kelas: session.kelas,
      gender: session.gender,
      completedMateriIndices: newCompleted,
      latihanAnswers: latihanAnswers
    });

    // Navigate to next topic (Tata Bahasa Dua, index 1)
    setSelectedMateriIndex(1);
    setMateriStep('contoh'); // Start at Contoh of next material as requested
    setLatihanAnswers({});
    setShowLatihanResult(false);
    setEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
    setShowEssayResult(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast("Hebat! Sekarang mari pelajari Tata Bahasa Dua 🎉", "success");
  };

  const handleLanjutKeTopikBerikutnya = () => {
    // Mark current topic as completed
    const virtualIdx = getVirtualIndex(selectedChapter, selectedMateriIndex);
    let newCompleted = completedMateriIndices;
    if (!completedMateriIndices.includes(virtualIdx)) {
      newCompleted = [...completedMateriIndices, virtualIdx];
      setCompletedMateriIndices(newCompleted);
      try {
        localStorage.setItem(`completed_materi_${session.name}`, JSON.stringify(newCompleted));
      } catch (e) {
        console.error(e);
      }
    }
    saveStudentProgress(session.name, {
      peran: session.peran,
      kelas: session.kelas,
      gender: session.gender,
      completedMateriIndices: newCompleted,
      latihanAnswers: latihanAnswers
    });

    const nextIdx = selectedMateriIndex + 1;
    if (nextIdx < CURRENT_DAFTAR_MATERI.length) {
      setSelectedMateriIndex(nextIdx);
      setMateriStep('contoh');
      setLatihanAnswers({});
      setShowLatihanResult(false);
      setMubtadaEssayAnswers({
        '1': { mubtada: '', khabar: '' },
        '2': { mubtada: '', khabar: '' },
        '3': { mubtada: '', khabar: '' },
        '4': { mubtada: '', khabar: '' },
        '5': { mubtada: '', khabar: '' },
        '6': { mubtada: '', khabar: '' },
        '7': { mubtada: '', khabar: '' },
        '8': { mubtada: '', khabar: '' },
        '9': { mubtada: '', khabar: '' },
        '10': { mubtada: '', khabar: '' }
      });
      setShowMubtadaEssayResult(false);
      setDarsuTsaniEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
      setShowDarsuTsaniEssayResult(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Hebat! Mari lanjut ke materi '${CURRENT_DAFTAR_MATERI[nextIdx]?.topik?.split(':')[0] || 'berikutnya'}' 🎉`, "success");
    } else if (selectedChapter === 1) {
      setSelectedChapter(2);
      setSelectedMateriIndex(0);
      setMateriStep('contoh');
      setLatihanAnswers({});
      setShowLatihanResult(false);
      setDarsuTsaniEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
      setShowDarsuTsaniEssayResult(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast("Selamat! Bab 1 telah selesai. Mari kita lanjut ke Bab 2: Isim Isyarah 🎓", "success");
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast("Luar biasa! Anda telah menyelesaikan seluruh materi pembelajaran 🎉", "success");
    }
  };

  // Timer countdown effect for Latihan (1 Hour = 3600 seconds)
  useEffect(() => {
    if (materiStep !== 'latihan' || showLatihanResult) return;

    const interval = setInterval(() => {
      setLatihanSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleKirimSemuaJawaban(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [materiStep, showLatihanResult, selectedMateriIndex, selectedChapter, latihanAnswers]);

  // Reset Latihan state and timer when switching topic/materi
  useEffect(() => {
    setLatihanAnswers({});
    setShowLatihanResult(false);
    setLatihanSecondsLeft(3600);
    setAnimatedScore(0);
    setEssayAnswers({
      '1': '',
      '2': '',
      '3': '',
      '4': '',
      '5': ''
    });
    setShowEssayResult(false);
    setPersonalDhamirEssayAnswers({
      '1': '',
      '2': '',
      '3': '',
      '4': '',
      '5': ''
    });
    setShowPersonalDhamirEssayResult(false);
    setDarsuTsaniEssayAnswers({
      '1': '',
      '2': '',
      '3': '',
      '4': '',
      '5': ''
    });
    setShowDarsuTsaniEssayResult(false);
  }, [selectedChapter, selectedMateriIndex]);

  // Score count-up animation when results are revealed
  useEffect(() => {
    if (showLatihanResult) {
      const targetScore = calculateLatihanScore();
      setAnimatedScore(0);
      let start = 0;
      const duration = 1500; // 1.5 seconds animation
      const startTime = performance.now();
      
      let animationFrameId: number;
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuad curve
        const easeProgress = progress * (2 - progress);
        const currentVal = Math.round(easeProgress * targetScore);
        
        setAnimatedScore(currentVal);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setAnimatedScore(targetScore);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    } else {
      setAnimatedScore(0);
    }
  }, [showLatihanResult, latihanAnswers]);

  // Handle Evaluasi Submission
  const handleEvaluasiSelect = (questionId: number, optionIndex: number) => {
    if (evaluasiSubmitted) return;
    setEvaluasiAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitEvaluasi = () => {
    if (Object.keys(evaluasiAnswers).length < EVALUASI_QUESTIONS.length) {
      showToast("Harap jawab semua pertanyaan evaluasi terlebih dahulu sebelum menyelesaikan ujian!", "error");
      return;
    }

    let correctCount = 0;
    EVALUASI_QUESTIONS.forEach(q => {
      if (evaluasiAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const scoreVal = Math.round((correctCount / EVALUASI_QUESTIONS.length) * 100);
    setEvaluasiScore(scoreVal);
    setEvaluasiSubmitted(true);

    // Save score to local list and Firestore
    const newRecord: StudentScore = {
      name: session.name || (session.gender === 'laki-laki' ? 'Ahmad Mulya' : 'Siti Aisyah'),
      role: session.peran === 'siswa' ? 'Siswa' : session.peran === 'guru' ? 'Guru' : 'Admin',
      class: session.peran === 'siswa' ? `Kelas ${session.kelas}` : 'Staf Pendidik',
      score: scoreVal,
      date: new Date().toISOString().split('T')[0],
      status: scoreVal >= 75 ? 'Lulus' : 'Remedial'
    };

    setLocalScores(prev => [newRecord, ...prev]);
    saveStudentScore(newRecord);
  };

  const resetEvaluasi = () => {
    setEvaluasiAnswers({});
    setEvaluasiSubmitted(false);
    setEvaluasiScore(0);
  };

  // Handler for dragging/sliding to resize sidebar
  const startResizing = (mouseDownEvent: React.MouseEvent | React.TouchEvent) => {
    setIsSidebarDragging(true);
    const startX = 'touches' in mouseDownEvent ? mouseDownEvent.touches[0].clientX : mouseDownEvent.clientX;
    const startWidth = sidebarWidth === 0 ? 256 : sidebarWidth;
    
    const doDrag = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const deltaX = currentX - startX;
      const newWidth = startWidth + deltaX;
      
      if (newWidth > 450) {
        setSidebarWidth(450);
      } else if (newWidth < 80) {
        setSidebarWidth(0);
        setIsSidebarCollapsed(true);
      } else {
        setSidebarWidth(newWidth);
        setIsSidebarCollapsed(false);
      }
    };
    
    const stopDrag = () => {
      setIsSidebarDragging(false);
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', doDrag);
      document.removeEventListener('touchend', stopDrag);
    };
    
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', doDrag);
    document.addEventListener('touchend', stopDrag);
  };

  // Filtered Referensi
  const filteredReferensi = useMemo(() => {
    if (!referensiSearch.trim()) return REFERENSI_LIST;
    const query = referensiSearch.toLowerCase();
    return REFERENSI_LIST.filter(ref => 
      ref.title.toLowerCase().includes(query) || 
      ref.author.toLowerCase().includes(query) || 
      ref.publisher.toLowerCase().includes(query)
    );
  }, [referensiSearch]);

  return (
    <div className="h-screen max-h-screen bg-white flex flex-col text-slate-800 overflow-hidden">
      
      {/* 1. TOP BAR (MENU UTAMA) - Responsive header optimized for Handphone, Tablet, Laptop, and Desktop */}
      <header className="bg-gradient-to-r from-[#08244a] via-[#0d3b78] to-[#0a2f61] text-white shadow-xl relative z-20 shrink-0 border-b border-sky-800/50">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between min-h-[4rem] sm:min-h-[4.25rem] py-2 gap-2 sm:gap-3">
            
            {/* Branding / Logo Section */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="bg-amber-400 p-1.5 sm:p-2.5 rounded-xl text-[#0d3b78] shadow-md flex items-center justify-center shrink-0">
                <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#0d3b78]" />
              </div>
              <div className="min-w-0">
                <h1 className="font-sans font-black text-xs sm:text-base lg:text-base tracking-wide text-white flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-amber-300 font-black tracking-wide">TATA BAHASA ARAB</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] bg-sky-800/90 text-amber-300 font-extrabold border border-sky-700/50">FASE D</span>
                </h1>
                <p className="text-[10px] sm:text-[11px] text-sky-200 font-medium tracking-wide hidden md:block whitespace-nowrap">Portal Pembelajaran Interaktif Pemula</p>
              </div>
            </div>

            {/* Desktop Navigation Tabs - Displayed on XL screens (>=1280px) to prevent squeezing controls */}
            <nav className="hidden xl:flex items-center gap-1.5 px-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Compass },
                { id: 'profil', label: 'Profil', icon: User },
                { id: 'kbc', label: 'KBC', icon: Award },
                { id: 'cp', label: 'CP Fase D', icon: FileText },
                { id: 'materi', label: 'Materi', icon: GraduationCap },
                { id: 'evaluasi', label: 'Evaluasi', icon: HelpCircle },
                { id: 'referensi', label: 'Referensi', icon: BookMarked },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer outline-none select-none whitespace-nowrap ${
                      isActive 
                        ? 'text-[#0d3b78]' 
                        : 'text-sky-100 hover:bg-sky-800/60 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute inset-0 bg-amber-400 rounded-xl shadow-md z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* User Session Profile & Controls Cluster */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Online/Offline Mode Toggle Button */}
              <button
                onClick={() => {
                  const newValue = !offline;
                  setOfflineMode(newValue);
                  setOfflineState(newValue);
                  showToast(newValue ? "Mode Luring Aktif. Data disimpan lokal!" : "Mode Daring Aktif. Sinkronisasi Firestore berjalan!", newValue ? "info" : "success");
                }}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition border cursor-pointer shadow-sm shrink-0 ${
                  offline 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                    : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-400/30'
                }`}
                title={offline ? "Klik untuk mengaktifkan sinkronisasi database online" : "Klik untuk menonaktifkan internet & masuk mode luring"}
              >
                <span className={`w-2 h-2 rounded-full inline-block animate-pulse shrink-0 ${offline ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className="hidden sm:inline">{offline ? 'Luring' : 'Daring'}</span>
              </button>

              {/* User Identity Details */}
              <div className="text-right hidden md:block shrink-0">
                <p className="text-xs font-black text-white capitalize leading-tight">{session.name || 'Pengguna'}</p>
                <p className="text-[10px] text-amber-300 font-bold capitalize flex items-center justify-end gap-1">
                  {session.peran} {session.peran === 'siswa' ? `(Kls ${session.kelas})` : ''}
                </p>
              </div>

              {/* Profile Initials Badge */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 text-[#0d3b78] font-black text-xs flex items-center justify-center shadow border-2 border-amber-300 shrink-0">
                {session.gender === 'laki-laki' ? 'IK' : 'UK'}
              </div>

              {/* PROMINENT EXIT BUTTON - ALWAYS VISIBLE WITH FULL LABEL & NEVER CUT OFF */}
              <button 
                onClick={onLogout}
                className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs shadow-md border border-rose-400/50 transition duration-150 cursor-pointer shrink-0 whitespace-nowrap ml-0.5"
                title="Keluar dari Portal (Exit)"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0 text-white" />
                <span>Exit</span>
              </button>

              {/* Mobile / Tablet Menu Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-1.5 sm:p-2 rounded-xl text-sky-100 hover:text-white hover:bg-sky-800/80 focus:outline-none cursor-pointer border border-sky-700/50 shrink-0 ml-0.5"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown for Handphone & Tablet (xl:hidden) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="xl:hidden bg-[#0a2850] border-t border-sky-700/60 overflow-hidden shadow-2xl"
            >
              <div className="px-4 pt-3 pb-5 space-y-2">
                {/* Mobile User Session Banner */}
                <div className="p-3 bg-sky-900/60 rounded-xl border border-sky-700/40 flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs font-black text-amber-300">{session.name || 'Pengguna'}</p>
                    <p className="text-[10px] text-sky-200 font-semibold">{session.peran} {session.peran === 'siswa' ? `(Kls ${session.kelas})` : ''}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${offline ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/30 text-emerald-300'}`}>
                    {offline ? 'Mode Luring' : 'Mode Daring'}
                  </span>
                </div>

                {/* Nav Items */}
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Compass },
                  { id: 'profil', label: 'Profil & Sekolah', icon: User },
                  { id: 'kbc', label: 'Ringkasan KBC', icon: Award },
                  { id: 'cp', label: 'CP Fase D', icon: FileText },
                  { id: 'materi', label: 'Alur Pembelajaran Materi', icon: GraduationCap },
                  { id: 'evaluasi', label: 'Evaluasi & Nilai', icon: HelpCircle },
                  { id: 'referensi', label: 'Referensi Buku/Jurnal', icon: BookMarked },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-extrabold transition ${
                        isActive 
                          ? 'bg-amber-400 text-[#0d3b78] shadow-md' 
                          : 'text-sky-100 hover:bg-sky-800/50'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                {/* Mobile Exit Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 mt-2 rounded-xl text-sm font-black bg-rose-600/80 hover:bg-rose-700 text-white transition shadow"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Keluar dari Portal (Exit)</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. MAIN LAYOUT CONTAINER (Sidebar + Content Stage) */}
      <div className={`flex-1 flex flex-col md:flex-row relative overflow-hidden ${isSidebarDragging ? 'select-none' : ''}`}>
        
        {/* SIDEBAR - Soft gray background with sliding/dragging resize capability */}
        <aside 
          style={{ 
            width: typeof window !== 'undefined' && window.innerWidth >= 768 
              ? (isSidebarCollapsed ? 0 : `${sidebarWidth}px`) 
              : undefined 
          }}
          className={`bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200/80 p-5 shrink-0 flex flex-col justify-between relative ${
            isSidebarDragging ? '' : 'transition-all duration-300'
          } ${
            isSidebarCollapsed ? 'w-0 md:w-0 overflow-hidden !p-0 border-r-0' : 'w-full md:w-64'
          }`}
        >
          
          <div className="space-y-6">
            
            {/* Context-aware Sidebar Title with Toggle Button */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-xs md:text-sm font-black tracking-widest text-slate-500 uppercase font-times">Navigasi Detil</span>
                <h2 className="text-base md:text-lg font-black text-[#0d3b78] capitalize mt-1.5 flex items-center gap-1.5 font-times">
                  <Layers className="w-5 h-5 text-[#0d3b78]" />
                  {activeTab === 'materi' ? 'Tahapan Materi' : `${activeTab} Menu`}
                </h2>
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition cursor-pointer hidden md:block"
                title="Sembunyikan Navigasi"
              >
                <ChevronsLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Contextual Sidebar Items */}
            <div className="space-y-1">
              {activeTab === 'materi' ? (
                // MATERI SUB-MENU SEQUENTIAL FLOW (1. Materi -> 2. Contoh -> 3. Latihan -> 4. Quiz)
                <div className="space-y-2">
                  {(session.peran === 'admin' || session.peran === 'guru') ? (
                    <div className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-extrabold border border-emerald-200 mb-2.5 flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Akses Bebas Guru/Admin (Tanpa Kunci)</span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-[10px] font-extrabold border border-blue-200 mb-2 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>Alur Wajib: Materi ➔ Contoh ➔ Latihan ➔ Kuis</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-2.5">
                    Ikuti tahapan pembelajaran terstruktur di bawah ini:
                  </p>
                  
                  {/* Step 1: Materi (Kaidah) */}
                  <button
                    onClick={() => setMateriStep('kaidah')}
                    className={`relative w-full flex items-center justify-between p-3 rounded-lg text-left transition duration-150 cursor-pointer overflow-hidden ${
                      materiStep === 'kaidah' 
                        ? 'text-amber-900 shadow-sm font-bold' 
                        : 'hover:bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {materiStep === 'kaidah' && (
                      <motion.div
                        layoutId="active-step-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="flex flex-col relative z-10">
                      <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Tahap 1 (Dasar)</span>
                      <span className="text-xs font-bold">1. Pembelajaran Materi (Kaidah)</span>
                    </div>
                    {materiStep !== 'kaidah' && <ChevronRight className="relative z-10 w-4 h-4 text-slate-400" />}
                  </button>

                  {/* Step 2: Contoh */}
                  <button
                    onClick={() => {
                      if (isStepUnlocked('contoh')) {
                        setMateriStep('contoh');
                      } else {
                        showToast(`Pelajari Pembelajaran Materi (Kaidah) terlebih dahulu!`, "error");
                      }
                    }}
                    disabled={!isStepUnlocked('contoh')}
                    className={`relative w-full flex items-center justify-between p-3 rounded-lg text-left transition duration-150 overflow-hidden ${
                      materiStep === 'contoh' 
                        ? 'text-blue-900 shadow-sm font-bold' 
                        : isStepUnlocked('contoh')
                          ? 'hover:bg-slate-200/70 text-slate-600 cursor-pointer'
                          : 'text-slate-300 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {materiStep === 'contoh' && (
                      <motion.div
                        layoutId="active-step-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="flex flex-col relative z-10">
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Tahap 2 (Penerapan)</span>
                      <span className="text-xs font-bold">2. Contoh Kalimat</span>
                    </div>
                    {materiStep !== 'contoh' && (
                      isStepUnlocked('contoh') 
                        ? <ChevronRight className="relative z-10 w-4 h-4 text-slate-400" />
                        : <Lock className="relative z-10 w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                  </button>

                  {/* Step 3: Latihan */}
                  <button
                    onClick={() => {
                      if (isStepUnlocked('latihan')) {
                        setMateriStep('latihan');
                      } else {
                        showToast(`Cermati Contoh Kalimat terlebih dahulu!`, "error");
                      }
                    }}
                    disabled={!isStepUnlocked('latihan')}
                    className={`relative w-full flex items-center justify-between p-3 rounded-lg text-left transition duration-150 overflow-hidden ${
                      materiStep === 'latihan' 
                        ? 'text-emerald-900 shadow-sm font-bold' 
                        : isStepUnlocked('latihan')
                          ? 'hover:bg-slate-200/70 text-slate-600 cursor-pointer'
                          : 'text-slate-300 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {materiStep === 'latihan' && (
                      <motion.div
                        layoutId="active-step-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="flex flex-col relative z-10">
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Tahap 3 (Latihan)</span>
                      <span className="text-xs font-bold">3. Latihan Mandiri</span>
                    </div>
                    {materiStep !== 'latihan' && (
                      isStepUnlocked('latihan')
                        ? <ChevronRight className="relative z-10 w-4 h-4 text-slate-400" />
                        : <Lock className="relative z-10 w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                  </button>

                  {/* Step 4: Quiz (Kuis Pemahaman) */}
                  <button
                    onClick={() => {
                      if (isStepUnlocked('quiz')) {
                        setMateriStep('quiz');
                      } else {
                        showToast(`Selesaikan Latihan Mandiri terlebih dahulu sebelum Kuis!`, "error");
                      }
                    }}
                    disabled={!isStepUnlocked('quiz')}
                    className={`relative w-full flex items-center justify-between p-3 rounded-lg text-left transition duration-150 overflow-hidden ${
                      materiStep === 'quiz' 
                        ? 'text-purple-900 shadow-sm font-bold' 
                        : isStepUnlocked('quiz')
                          ? 'hover:bg-slate-200/70 text-slate-600 cursor-pointer'
                          : 'text-slate-300 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {materiStep === 'quiz' && (
                      <motion.div
                        layoutId="active-step-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-600 z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="flex flex-col relative z-10">
                      <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wider">Tahap 4 (Evaluasi)</span>
                      <span className="text-xs font-bold">4. Kuis Pemahaman (Quiz)</span>
                    </div>
                    {materiStep !== 'quiz' && (
                      isStepUnlocked('quiz')
                        ? <ChevronRight className="relative z-10 w-4 h-4 text-slate-400" />
                        : <Lock className="relative z-10 w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                  </button>

                  {/* Step Ekstra: Ice Breaking */}
                  <div className="pt-2 border-t border-slate-200">
                    <button
                      onClick={() => setMateriStep('ice_breaking')}
                      className={`relative w-full flex items-center justify-between p-2.5 rounded-lg text-left transition duration-150 cursor-pointer overflow-hidden ${
                        materiStep === 'ice_breaking' 
                          ? 'bg-amber-100 text-amber-900 font-bold' 
                          : 'hover:bg-slate-200/70 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🎮</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-amber-700 uppercase">Pemanasan Santai</span>
                          <span className="text-xs font-bold">Ice Breaking Game</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              ) : (
                // DEFAULT SIDEBAR QUICK-LINKS based on active tab
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200/60 shadow-sm text-xs space-y-2">
                    <p className="font-bold text-[#0d3b78] flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-amber-500" />
                      Status Sistem
                    </p>
                    <div className="space-y-1.5 text-slate-500">
                      <div className="flex justify-between">
                        <span>Database:</span>
                        <span className="text-emerald-600 font-bold">Lokal Terenkripsi</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status Proyek:</span>
                        <span className="text-amber-600 font-bold">Pengembangan</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Metode Utama:</span>
                        <span className="text-blue-600 font-bold">Induktif KBC</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-gradient-to-br from-indigo-900 to-sky-950 text-white rounded-lg shadow-md space-y-3">
                    <div className="pb-2 border-b border-white/10">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-amber-400">Judul Utama</p>
                      <p className="arabic text-right text-amber-300 leading-normal" style={{ fontFamily: arabicFontFamily, fontSize: `${15 * arabicScale}px`, fontWeight: isArabicBold ? 'bold' : 'normal' }}>
                        مُدْخَلُ القَوَاعِدِ الْعَرَبِيَّةِ لِلْمُبْتَدِئِينَ
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-sky-300">Quotes Mutiara</p>
                        <div className="flex items-center gap-1.5 bg-white/10 rounded-md px-1.5 py-0.5">
                          <button 
                            type="button"
                            onClick={() => setActiveQuoteIdx((prev) => (prev - 1 + ARABIC_QUOTES.length) % ARABIC_QUOTES.length)}
                            className="hover:text-amber-400 transition cursor-pointer"
                            title="Sebelumnya"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[8px] font-mono select-none px-0.5">
                            {activeQuoteIdx + 1}/{ARABIC_QUOTES.length}
                          </span>
                          <button 
                            type="button"
                            onClick={() => setActiveQuoteIdx((prev) => (prev + 1) % ARABIC_QUOTES.length)}
                            className="hover:text-amber-400 transition cursor-pointer"
                            title="Selanjutnya"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="min-h-[72px] flex flex-col justify-center">
                        <p className="arabic text-right text-[#ffb020] leading-normal" style={{ fontFamily: arabicFontFamily, fontSize: `${17 * arabicScale}px`, fontWeight: isArabicBold ? 'bold' : 'normal' }}>
                          {ARABIC_QUOTES[activeQuoteIdx].arabic}
                        </p>
                        <p className="text-[9px] text-sky-300 italic text-right mt-0.5">
                          {ARABIC_QUOTES[activeQuoteIdx].pronunciation}
                        </p>
                        <p className="text-[10px] text-sky-100 mt-1.5 leading-relaxed font-serif italic border-l-2 border-amber-400/50 pl-2">
                          &ldquo;{ARABIC_QUOTES[activeQuoteIdx].translation}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Footer with School info */}
          <div className="mt-8 pt-4 border-t border-slate-200 hidden md:block">
            <p className="text-[10px] font-bold text-[#0d3b78]">{PROFILE_INFO.school.name}</p>
            <p className="text-[9px] text-slate-400 mt-1">Sistem Evaluasi Tata Bahasa Arab v1.2</p>
          </div>

        </aside>

        {/* Draggable Divider Splitter between Sidebar and Content (Desktop only) */}
        {!isSidebarCollapsed && (
          <div
            onMouseDown={startResizing}
            onTouchStart={startResizing}
            className={`hidden md:flex w-1.5 bg-slate-200 hover:bg-[#1f6fe5] cursor-col-resize items-center justify-center transition-all duration-150 relative z-30 shrink-0 ${
              isSidebarDragging ? 'bg-[#0d3b78] w-2' : ''
            }`}
            title="Geser untuk mengatur lebar navigasi (Double klik untuk sembunyikan)"
            onDoubleClick={() => setIsSidebarCollapsed(true)}
          >
            {/* Splitter grab handle badge */}
            <div className="absolute top-1/2 -translate-y-1/2 p-0.5 rounded-md bg-white shadow-md border border-slate-200 text-slate-400 hover:text-[#1f6fe5] transition cursor-col-resize z-40">
              <GripVertical className="w-3.5 h-4.5" />
            </div>
          </div>
        )}

        {/* Drag-to-reveal sticky pull-tab when sidebar is collapsed (Desktop only) */}
        {isSidebarCollapsed && (
          <motion.button
            layout
            onClick={() => {
              setIsSidebarCollapsed(false);
              setSidebarWidth(256);
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-0 top-36 z-50 bg-[#0d3b78] hover:bg-[#1f6fe5] text-white p-2.5 rounded-r-xl shadow-lg border border-l-0 border-blue-400/30 flex items-center gap-1.5 transition duration-200 group cursor-pointer"
            title="Klik atau tarik untuk membuka navigasi menu"
          >
            <ChevronsRight className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="hidden lg:inline text-[9px] font-black uppercase tracking-widest writing-mode-vertical py-1 select-none text-slate-100">
              Tarik Navigasi
            </span>
          </motion.button>
        )}

        {/* CONTENT STAGE (Base background is pristine white) */}
        <motion.main 
          layout
          transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.8 }}
          className="flex-1 bg-white p-6 md:p-8 overflow-y-auto relative z-10"
        >
          <AnimatePresence mode="wait">
            
            {/* ================= 1. TAB: DASHBOARD ================= */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="tab-dashboard"
                layout="position"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.8 }}
                className="space-y-8"
              >
                {/* Jumbotron Header Card with High Contrast Colorful Elegant styling */}
                <div className="relative bg-gradient-to-r from-blue-900 via-[#0d3b78] to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-xl overflow-hidden border border-sky-800">
                  <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 font-serif text-[180px] pointer-events-none select-none">
                    ع
                  </div>
                  
                  <div className="relative z-10 max-w-3xl space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-amber-400 text-slate-900">
                      Penelitian & Media Pembelajaran Terpadu
                    </span>
                    <h2 className="text-xl md:text-3xl font-extrabold tracking-tight leading-normal font-sans text-white drop-shadow-md">
                      PENGEMBANGAN MEDIA PEMBELAJARAN INTERAKTIF TATA BAHASA ARAB
                    </h2>
                    <div className="py-2 px-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 inline-block">
                      <p className="arabic text-amber-300 select-none leading-normal" style={{ fontFamily: arabicFontFamily, fontSize: `${20 * arabicScale}px`, fontWeight: isArabicBold ? 'bold' : 'normal' }}>
                        مُدْخَلُ القَوَاعِدِ الْعَرَبِيَّةِ لِلْمُبْتَدِئِينَ
                      </p>
                    </div>
                    <p className="text-sm md:text-[15px] text-sky-100 leading-relaxed font-semibold">
                      {RESEARCH_INFO.subTitle}
                    </p>
                    
                    <div className="pt-2 flex flex-wrap gap-4 text-sm text-amber-300 font-bold">
                      <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-lg border border-white/10">
                        <User className="w-4 h-4" />
                        Oleh: {PROFILE_INFO.author.name}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-lg border border-white/10">
                        <GraduationCap className="w-4 h-4" />
                        Instansi: {PROFILE_INFO.school.name}
                      </span>
                    </div>

                    {/* Animasi Interaktif Siswa Madrasah Berjalan Melintasi Garis Horison */}
                    <div className="pt-3 border-t border-sky-800/80 mt-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-sky-200 uppercase tracking-widest mb-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          Siswa & Siswi Madrasah Aktif Bergerak
                        </span>
                        <span className="text-amber-300 font-extrabold hidden sm:inline">مَنْ سَارَ عَلَى الدَّرْبِ وَصَلَ</span>
                      </div>
                      <div className="h-16 relative overflow-hidden rounded-xl bg-blue-950/40 border border-sky-700/50">
                        <WalkingStudents variant="banner" className="h-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main description section */}
                <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-xl font-extrabold text-[#0d3b78]">Deskripsi Media Pembelajaran</h3>
                  <p className="text-[15px] text-slate-800 leading-relaxed text-justify font-medium">
                    {RESEARCH_INFO.description}
                  </p>
                </div>

                {/* Colorful grid cards with futuristic high contrast style as requested */}
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Keunggulan Utama Media</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {RESEARCH_INFO.features.map((feat, i) => (
                      <div 
                        key={i}
                        className={`bg-gradient-to-br ${feat.color} rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 relative group overflow-hidden border border-white/10`}
                      >
                        {/* Glow effect */}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform" />
                        
                        <div className="relative z-10 space-y-2.5">
                          <span className="text-[10px] font-bold bg-black/20 px-2 py-0.5 rounded text-yellow-300 uppercase font-mono">Fitur {i+1}</span>
                          <h4 className="text-[15px] font-black tracking-tight">{feat.title}</h4>
                          <p className="text-sm text-white/95 leading-relaxed font-semibold">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shortcut to start studying */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50/50 rounded-xl p-6 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center sm:text-left max-w-2xl">
                    <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider font-mono">Sumber Rujukan Materi</h4>
                    <p className="text-base text-amber-950 font-extrabold leading-relaxed">
                      Materi disusun dengan mengacu pada buku Bahasa Arab Kelas VII (KMA 1503) yang digunakan di sekolah penelitian, serta didukung oleh beberapa referensi lain yang relevan.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('materi')}
                    className="px-6 py-3 rounded-lg bg-[#0d3b78] hover:bg-[#0a2c5c] text-white text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer shrink-0"
                  >
                    Buka Alur Materi
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            )}

            {/* ================= 2. TAB: PROFIL ================= */}
            {activeTab === 'profil' && (
              <motion.div
                key="tab-profil"
                layout="position"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.8 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-[#0d3b78] tracking-tight">Kartu Identitas Website</h2>
                    <p className="text-sm text-slate-500 font-medium">Validasi resmi pengembang dan instansi pengampu media pembelajaran digital.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Putar Kartu (3D)
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-6 w-full max-w-3xl mx-auto space-y-8">
                  
                  {/* 3D Card Container */}
                  <div 
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="w-full max-w-2xl h-[420px] sm:h-[380px] [perspective:1200px] group relative cursor-pointer"
                  >
                    <motion.div
                      className="relative w-full h-full [transform-style:preserve-3d] transition-all duration-500"
                      animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      {/* ================= FRONT SIDE ================= */}
                      <div className="absolute w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden shadow-2xl border border-amber-400/40 bg-gradient-to-br from-slate-900 via-[#0d3b78] to-indigo-950 text-white p-6 flex flex-col justify-between">
                        
                        {/* Card Header */}
                        <div className="flex items-start justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-400 text-slate-900 rounded-xl shadow-md shrink-0">
                              <GraduationCap className="w-5.5 h-5.5" />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black tracking-widest text-amber-300 uppercase">KARTU IDENTITAS WEBSITE</h4>
                              <p className="text-[9px] sm:text-[10px] font-bold text-sky-200 tracking-wider">MEDIA PEMBELAJARAN TATA BAHASA ARAB</p>
                            </div>
                          </div>
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 font-extrabold px-3 py-1 rounded-md border border-emerald-500/30 font-mono tracking-wider">
                            VALID
                          </span>
                        </div>

                        {/* Card Body */}
                        <div className="flex flex-col sm:flex-row gap-6 items-center my-auto">
                          {/* Avatar area with microchip */}
                          <div className="relative shrink-0">
                            <div className="w-24 h-28 sm:w-28 sm:h-36 bg-slate-800 rounded-xl border border-white/25 overflow-hidden shadow-inner relative flex items-center justify-center">
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                              <img
                                src={PROFILE_INFO.author.avatar}
                                alt={PROFILE_INFO.author.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Virtual Metallic Chip icon */}
                            <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 w-7 h-5.5 rounded-md border border-amber-300 flex flex-col justify-between p-0.5 shadow-sm">
                              <div className="h-[1px] bg-slate-800/20 w-full" />
                              <div className="h-[1px] bg-slate-800/20 w-full" />
                              <div className="h-[1px] bg-slate-800/20 w-full" />
                            </div>
                          </div>

                          {/* Bio Details */}
                          <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                            <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs sm:text-sm">
                              <div className="col-span-4 sm:col-span-3 text-sky-300 font-bold uppercase tracking-wider text-[10px] sm:text-xs self-center">Nama</div>
                              <div className="col-span-8 sm:col-span-9 font-black text-white text-sm sm:text-lg tracking-tight">{PROFILE_INFO.author.name}</div>

                              <div className="col-span-4 sm:col-span-3 text-sky-300 font-bold uppercase tracking-wider text-[10px] sm:text-xs self-center">No. Telp</div>
                              <div className="col-span-8 sm:col-span-9 font-mono font-bold text-amber-300 text-sm sm:text-base">{PROFILE_INFO.author.phone}</div>

                              <div className="col-span-4 sm:col-span-3 text-sky-300 font-bold uppercase tracking-wider text-[10px] sm:text-xs self-center">Gmail</div>
                              <div className="col-span-8 sm:col-span-9 font-mono font-semibold text-sky-100 text-sm sm:text-base truncate">{PROFILE_INFO.author.email}</div>

                              <div className="col-span-4 sm:col-span-3 text-sky-300 font-bold uppercase tracking-wider text-[10px] sm:text-xs self-center">Lembaga</div>
                              <div className="col-span-8 sm:col-span-9 font-extrabold text-slate-200 leading-normal text-xs sm:text-sm">{PROFILE_INFO.school.name}</div>

                              <div className="col-span-4 sm:col-span-3 text-sky-300 font-bold uppercase tracking-wider text-[10px] sm:text-xs self-center">Peran</div>
                              <div className="col-span-8 sm:col-span-9">
                                <span className="inline-block bg-amber-400 text-slate-900 text-[10px] sm:text-xs font-black px-3 py-1 rounded-md uppercase tracking-widest shadow-sm">
                                  {PROFILE_INFO.author.role}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-400">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <span className="font-mono text-[8px] text-sky-300/60 uppercase">SERIAL ID</span>
                              <span className="font-mono font-bold text-slate-300 text-[9px]">ID-NURIS-NGALIYAN-2026</span>
                            </div>
                          </div>
                          
                          {/* Decorative Barcode */}
                          <div className="flex items-end gap-[1.5px] h-7 px-2.5 bg-white/5 rounded">
                            <div className="w-[1.5px] h-6 bg-white"></div>
                            <div className="w-[2.5px] h-6 bg-white"></div>
                            <div className="w-[1.5px] h-6 bg-white"></div>
                            <div className="w-[3.5px] h-6 bg-white"></div>
                            <div className="w-[1.5px] h-6 bg-white"></div>
                            <div className="w-[1.5px] h-6 bg-white"></div>
                            <div className="w-[2.5px] h-6 bg-white"></div>
                            <div className="w-[1.5px] h-6 bg-white"></div>
                            <div className="w-[4.5px] h-6 bg-white"></div>
                            <div className="w-[1.5px] h-6 bg-white"></div>
                            <div className="w-[2.5px] h-6 bg-white"></div>
                          </div>
                        </div>
                      </div>

                      {/* ================= BACK SIDE ================= */}
                      <div className="absolute w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden shadow-2xl border border-amber-400/40 bg-gradient-to-br from-[#0c1f40] via-slate-900 to-indigo-950 text-white p-6 flex flex-col justify-between [transform:rotateY(180deg)]">
                        
                        {/* Back Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-amber-400" />
                            <span className="text-xs font-black tracking-wider text-slate-300 uppercase">KETENTUAN & VALIDASI SISTEM</span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">v1.2 (PROD-STABLE)</span>
                        </div>

                        {/* Back Body */}
                        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 px-1 text-justify my-auto font-medium">
                          <p>
                            Media pembelajaran digital ini dikembangkan sebagai bagian dari penelitian pada mata pelajaran Bahasa Arab kelas VII di Madrasah Tsanawiyah Nurul Islam Ngaliyan Semarang.
                          </p>
                          <p>
                            Materi, contoh, latihan, dan evaluasi disusun untuk membantu peserta didik pemula (mubtadi'īn) memahami kaidah dasar bahasa Arab melalui pembelajaran yang interaktif.
                          </p>
                          <p>
                            Website ini diharapkan dapat menjadi media pendukung pembelajaran bahasa Arab yang mudah diakses oleh peserta didik maupun pendidik.
                          </p>
                        </div>

                        {/* Back Footer */}
                        <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                          <div className="text-xs text-slate-400">
                            <p className="font-bold text-slate-300 text-[10px] sm:text-xs">Tanda Tangan Pengembang</p>
                            <p className="italic mt-1.5 font-mono text-amber-400 text-xs sm:text-sm">Miftah Rizki A.</p>
                          </div>
                          {/* Stamp look */}
                          <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-400/40 flex items-center justify-center rotate-12 shrink-0">
                            <span className="text-[7px] sm:text-[8px] text-amber-300 font-black text-center leading-none">MTS NURUL<br />ISLAM</span>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  </div>

                  {/* Hint Text */}
                  <p className="text-xs text-slate-400 font-bold animate-pulse text-center flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 shadow-sm">
                    <RefreshCw className="w-3.5 h-3.5 text-[#0d3b78]" />
                    *Ketuk kartu di atas untuk melihat bagian belakang kartu.
                  </p>

                </div>
              </motion.div>
            )}

            {/* ================= 3. TAB: KBC & PEMBELAJARAN MENDALAM ================= */}
            {activeTab === 'kbc' && (
              <motion.div
                key="tab-kbc"
                layout="position"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.8 }}
                className="space-y-8"
              >
                {/* Tab Header */}
                <div className="space-y-2 border-b border-slate-100 pb-5">
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-widest font-mono">Pilar Pendidikan Holistik</span>
                  <h2 className="text-2xl font-black text-[#0d3b78] tracking-tight">Kurikulum Berbasis Cinta (KBC)</h2>
                  <p className="text-sm text-slate-500 font-medium">Paradigma pendidikan humanis yang mengintegrasikan rasa cinta dan empati ke dalam proses akademis.</p>
                </div>

                {/* Main Intro Card */}
                <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl border border-rose-200/50 p-6 md:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 text-rose-200/20 pointer-events-none">
                    <Heart className="w-64 h-64 fill-current" />
                  </div>
                  
                  <div className="relative space-y-4 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                      <Heart className="w-3.5 h-3.5 fill-current text-rose-600 animate-pulse" />
                      Konsep Dasar KBC
                    </div>
                    
                    <p className="text-lg md:text-xl lg:text-2xl text-slate-800 leading-relaxed font-black text-justify">
                      Kurikulum Berbasis Cinta merupakan kurikulum yang menitikberatkan pada pengembangan karakter, pengalaman belajar, dan nilai sosial-emosional untuk membentuk peserta didik yang humanis, toleran, dan bertanggung jawab.
                    </p>
                  </div>
                </div>

                {/* Section Title: Panca Cinta */}
                <div className="space-y-1.5 pt-2">
                  <h3 className="text-xl font-black text-[#0d3b78] tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5.5 h-5.5 text-amber-500 animate-pulse" />
                    Tema Kurikulum Berbasis Cinta (Panca Cinta)
                  </h3>
                  <p className="text-sm text-slate-500 font-semibold">Lima pilar utama cinta yang menaungi seluruh aktivitas belajar, pembentukan kepribadian, dan hubungan intersosial siswa.</p>
                </div>

                {/* Panca Cinta Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Cinta 1 */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-rose-300 transition duration-300 flex flex-col justify-center group min-h-[140px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 group-hover:scale-110 transition duration-300 shrink-0">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-rose-500 font-mono tracking-widest uppercase">Pilar 01</span>
                        <h4 className="font-black text-[#0d3b78] text-lg sm:text-xl md:text-2xl leading-snug group-hover:text-rose-600 transition">cinta kepada Allah dan Rasul-Nya</h4>
                      </div>
                    </div>
                  </div>

                  {/* Cinta 2 */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-sky-300 transition duration-300 flex flex-col justify-center group min-h-[140px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:scale-110 transition duration-300 shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-sky-500 font-mono tracking-widest uppercase">Pilar 02</span>
                        <h4 className="font-black text-[#0d3b78] text-lg sm:text-xl md:text-2xl leading-snug group-hover:text-sky-600 transition">Cinta Ilmu</h4>
                      </div>
                    </div>
                  </div>

                  {/* Cinta 3 */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition duration-300 flex flex-col justify-center group min-h-[140px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition duration-300 shrink-0">
                        <Leaf className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-500 font-mono tracking-widest uppercase">Pilar 03</span>
                        <h4 className="font-black text-[#0d3b78] text-lg sm:text-xl md:text-2xl leading-snug group-hover:text-emerald-600 transition">Cinta Lingkungan</h4>
                      </div>
                    </div>
                  </div>

                  {/* Cinta 4 */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-purple-300 transition duration-300 flex flex-col justify-center group min-h-[140px] md:col-span-1 lg:col-span-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 transition duration-300 shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-purple-500 font-mono tracking-widest uppercase">Pilar 04</span>
                        <h4 className="font-black text-[#0d3b78] text-lg sm:text-xl md:text-2xl leading-snug group-hover:text-purple-600 transition">Cinta Diri dan Sesama Manusia</h4>
                      </div>
                    </div>
                  </div>

                  {/* Cinta 5 */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition duration-300 flex flex-col justify-center group min-h-[140px] md:col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-110 transition duration-300 shrink-0">
                        <Flag className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-500 font-mono tracking-widest uppercase">Pilar 05</span>
                        <h4 className="font-black text-[#0d3b78] text-lg sm:text-xl md:text-2xl leading-snug group-hover:text-amber-600 transition">Cinta Tanah Air</h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Educational Banner */}
                <div className="bg-gradient-to-br from-[#0d3b78] to-blue-900 text-white rounded-2xl p-6 md:p-8 space-y-4 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 -translate-y-4 translate-x-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                  <div className="space-y-2 max-w-4xl">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest font-mono">Prinsip Utama KBC</h4>
                    <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed font-black text-justify italic">
                      "Pendidikan yang berlandaskan nilai-nilai cinta membentuk peserta didik yang berkarakter, berakhlak mulia, dan bertanggung jawab."
                    </p>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ================= 4. TAB: CP FASE D ================= */}
            {activeTab === 'cp' && (
              <motion.div
                key="tab-cp"
                layout="position"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.8 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="space-y-3 border-b border-slate-100 pb-5">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Standar Kompetensi Lulusan</span>
                  <h2 className="text-3xl font-black text-[#0d3b78] tracking-tight">Capaian Pembelajaran (CP) Fase D</h2>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#0d3b78] text-sm md:text-base font-extrabold rounded-full border border-blue-100 shadow-sm">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Fase D (umumnya untuk kelas VII, VIII, dan XI Madrasah Tsanawiyyah)
                  </div>
                </div>

                {/* Subtitle / Intro */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <p className="text-lg md:text-xl text-[#0d3b78] font-black leading-relaxed">
                    Pada akhir fase D, murid memiliki kemampuan sebagai berikut:
                  </p>
                </div>

                {/* Core Competencies Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Card 1: Komponen Bahasa */}
                  <div className="bg-white rounded-2xl border-2 border-slate-200/80 p-6 md:p-8 shadow-md hover:shadow-lg hover:border-blue-300 transition duration-300 flex flex-col justify-between group">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-115 transition duration-300 shadow-sm shrink-0">
                          <BookOpen className="w-7 h-7" />
                        </div>
                        <span className="text-4xl font-black text-blue-100 font-mono">01</span>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-black text-[#0d3b78] text-xl md:text-2xl tracking-tight group-hover:text-blue-600 transition">
                          Komponen Bahasa
                        </h3>
                        <p className="text-base sm:text-lg md:text-xl text-slate-700 font-bold leading-relaxed text-justify">
                          Siswa mampu menganalisis kosakata, pola kalimat, dan wacana.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-600">
                      <span>Aspek Linguistik</span>
                      <Check className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card 2: Keterampilan Bahasa */}
                  <div className="bg-white rounded-2xl border-2 border-slate-200/80 p-6 md:p-8 shadow-md hover:shadow-lg hover:border-amber-300 transition duration-300 flex flex-col justify-between group">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-115 transition duration-300 shadow-sm shrink-0">
                          <GraduationCap className="w-7 h-7" />
                        </div>
                        <span className="text-4xl font-black text-amber-100 font-mono">02</span>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-black text-[#0d3b78] text-xl md:text-2xl tracking-tight group-hover:text-amber-600 transition">
                          Keterampilan Bahasa
                        </h3>
                        <p className="text-base sm:text-lg md:text-xl text-slate-700 font-bold leading-relaxed text-justify">
                          Peserta didik mampu menerapkan komponen bahasa melalui keterampilan menyimak, berbicara, membaca, menulis, dan mempresentasikan sesuai tujuan pembelajaran.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-600">
                      <span>Aspek Praktis</span>
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Legal Framework Summary Box */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm md:text-base text-slate-600 font-bold leading-relaxed text-center">
                  Rujukan CP di atas disesuaikan dengan kurikulum operasional madrasah tingkat nasional berdasarkan standar KMA 183 Kemenag RI.
                </div>

              </motion.div>
            )}

            {/* ================= 5. TAB: MATERI (3 Stages Flow) ================= */}
            {activeTab === 'materi' && (
              <motion.div
                key="tab-materi"
                layout="position"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.8 }}
                className="space-y-8"
              >
                {/* Beautiful active learning header bar with collapse toggle button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gradient-to-r from-[#0d3b78] to-[#1f6fe5] text-white p-4 sm:p-5 rounded-2xl shadow-md border border-blue-500/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 text-amber-300 shadow-inner shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-400 text-[#0d3b78] px-2.5 py-0.5 rounded-full shadow-xs">
                          Bab {selectedChapter}
                        </span>
                        <span className="text-xs text-blue-100 font-bold">Topik {selectedMateriIndex + 1} dari {CURRENT_DAFTAR_MATERI.length}</span>
                      </div>
                      <h4 className="text-sm md:text-base font-black tracking-tight text-white mt-1">
                        {BAHAS_MATERI.topik.includes(':') ? BAHAS_MATERI.topik.split(':')[1].trim() : BAHAS_MATERI.topik}
                      </h4>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Fullscreen / Normal sliding layout trigger */}
                    <button
                      onClick={() => {
                        setIsSidebarCollapsed(!isSidebarCollapsed);
                        if (isSidebarCollapsed) {
                          setSidebarWidth(256);
                        } else {
                          setSidebarWidth(0);
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-white/10 hover:bg-white/20 text-white shadow-sm border border-white/25 transition duration-150 cursor-pointer text-center shrink-0"
                      title={isSidebarCollapsed ? "Kembali ke tampilan normal" : "Buat materi layar penuh"}
                    >
                      {isSidebarCollapsed ? (
                        <>
                          <Minimize2 className="w-4 h-4 text-amber-300" />
                          <span>Normal View</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-4 h-4 text-amber-300 animate-pulse" />
                          <span>Full Materi</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setIsSelectorCollapsed(!isSelectorCollapsed)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-amber-400 text-[#0d3b78] hover:bg-amber-300 active:bg-amber-500 shadow-sm hover:shadow-md transition duration-150 cursor-pointer text-center shrink-0"
                    >
                      {isSelectorCollapsed ? (
                        <>
                          <ChevronDown className="w-4 h-4 shrink-0 animate-bounce" />
                          Pilih Bab & Topik Lain
                        </>
                      ) : (
                        <>
                          <ChevronUp className="w-4 h-4 shrink-0" />
                          Sembunyikan Pilihan
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!isSelectorCollapsed && (
                    <motion.div
                      key="selectors-panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 overflow-hidden"
                    >
                      {/* Bab/Menu Selector */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <BookOpenCheck className="w-5 h-5 text-[#1f6fe5]" />
                          <span className="text-xs font-black text-[#0d3b78] uppercase tracking-wider">Pilih Bab Pembelajaran:</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Menu 1 */}
                          <button
                            onClick={() => {
                              setSelectedChapter(1);
                              setSelectedMateriIndex(0);
                              setMateriStep('contoh');
                              setLatihanAnswers({});
                              setShowLatihanResult(false);
                            }}
                            className={`relative p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden cursor-pointer shadow-sm flex items-center justify-between group ${
                              selectedChapter === 1
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 text-blue-900 shadow-md ring-2 ring-blue-400/10'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <div className="space-y-1.5 z-10">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                                  selectedChapter === 1 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  Bab 1
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Aktif</span>
                              </div>
                              <h3 className="text-base font-black tracking-tight text-[#0d3b78]">الدَّرْسُ الْأَوَّلُ: التَّعَارُفُ</h3>
                              <p className="text-xs text-slate-500 font-semibold">Al-Darsul Awwal: Al-Ta'aruf (Perkenalan)</p>
                            </div>
                            <div className={`p-3 rounded-xl transition-all duration-300 ${
                              selectedChapter === 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                            }`}>
                              <BookOpen className="w-6 h-6" />
                            </div>
                          </button>

                          {/* Menu 2 */}
                          <button
                            onClick={() => {
                              setSelectedChapter(2);
                              setSelectedMateriIndex(0);
                              setMateriStep('contoh');
                              setLatihanAnswers({});
                              setShowLatihanResult(false);
                            }}
                            className={`relative p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden cursor-pointer shadow-sm flex items-center justify-between group ${
                              selectedChapter === 2
                                ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 text-purple-900 shadow-md ring-2 ring-purple-400/10'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <div className="space-y-1.5 z-10">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                                  selectedChapter === 2 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  Bab 2
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Aktif</span>
                              </div>
                              <h3 className="text-base font-black tracking-tight text-purple-950">الدَّرْسُ الثَّانِي: اِسْمُ الإِشَارَةِ</h3>
                              <p className="text-xs text-slate-500 font-semibold">Al-Darsuts Tsani: Isim Isyarah (Kata Tunjuk)</p>
                            </div>
                            <div className={`p-3 rounded-xl transition-all duration-300 ${
                              selectedChapter === 2 ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                            }`}>
                              <Sparkles className="w-6 h-6" />
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Sub-Topics Selector Grid */}
                      {(selectedChapter === 1 || selectedChapter === 2) && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center gap-2">
                            <BookOpenCheck className="w-5 h-5 text-[#1f6fe5]" />
                            <span className="text-xs font-black text-[#0d3b78] uppercase tracking-wider">Pilih Sub-Topik Pembelajaran Bab {selectedChapter}:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            {CURRENT_DAFTAR_MATERI.map((m, idx) => {
                              const isActive = selectedMateriIndex === idx;
                              const unlocked = isMateriUnlocked(idx);
                              const completed = completedMateriIndices.includes(getVirtualIndex(selectedChapter, idx));
                              return (
                                <button
                                  key={m.id}
                                  onClick={() => handleMateriChange(idx)}
                                  className={`relative text-left p-4 rounded-xl border text-xs sm:text-sm font-bold transition duration-200 flex flex-col justify-between h-full min-h-[105px] gap-2 shadow-sm select-none overflow-hidden ${
                                    isActive
                                      ? 'text-white border-[#1f6fe5] shadow cursor-pointer'
                                      : !unlocked
                                      ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                                      : 'bg-white border-slate-200 text-[#0d3b78] hover:bg-slate-100 hover:border-slate-300 cursor-pointer'
                                  }`}
                                >
                                  {isActive && (
                                    <motion.div
                                      layoutId="active-topic-indicator"
                                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#1f6fe5] z-0"
                                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                  )}
                                  <div className="relative z-10 flex flex-col h-full justify-between gap-2 w-full">
                                    <div className="flex items-center justify-between gap-1 w-full">
                                      <span className={`text-[9px] font-extrabold uppercase tracking-widest ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                                        Topik {idx + 1}
                                      </span>
                                      <div className="flex items-center gap-1 shrink-0">
                                        {completed && session.peran === 'siswa' && (
                                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black flex items-center gap-0.5 ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                                            <Check className="w-2.5 h-2.5" /> Sudah Dipelajari
                                          </span>
                                        )}
                                        {!unlocked && (
                                          <Lock className="w-3 h-3 text-slate-400" />
                                        )}
                                      </div>
                                    </div>
                                    <span className="line-clamp-2 leading-snug">{m.topik}</span>
                                  </div>
                                </button>
                              );
                            })}

                            {/* Beautiful Placeholder for Coming Soon topics of Bab 2 */}
                            {selectedChapter === 2 && (
                              <div className="relative text-left p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400 text-xs sm:text-sm font-bold flex flex-col justify-between h-full min-h-[105px] gap-2 select-none opacity-65">
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Topik 2</span>
                                  <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                                </div>
                                <span className="italic leading-snug font-medium text-slate-400">Topik pembelajaran lainnya segera hadir...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {(selectedChapter === 1 || selectedChapter === 2) ? (
                  <>
                    {/* Header with Topic Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#1f6fe5] uppercase tracking-widest">Topik Pembelajaran Utama</span>
                    <h2 className="text-xl md:text-2xl font-black text-[#0d3b78] tracking-tight">{BAHAS_MATERI.topik}</h2>
                    <p className="text-xs text-slate-400 font-medium">{BAHAS_MATERI.subTopik}</p>
                  </div>
                  
                  {/* Step status indicators */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full">
                    {/* Optional Ice Breaking warm-up button */}
                    <button
                      onClick={() => setMateriStep('ice_breaking')}
                      className={`relative text-[10px] md:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition duration-150 whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                        materiStep === 'ice_breaking'
                          ? 'bg-amber-400 text-[#0d3b78] shadow-sm font-black'
                          : 'text-amber-800 hover:bg-amber-100/70'
                      }`}
                      title="Mainkan Game Pemanasan"
                    >
                      <span>🎮 Ice Breaking</span>
                    </button>

                    <div className="w-[1px] h-4 bg-slate-200 shrink-0" />

                    {[
                      { id: 'kaidah', label: '1. Materi Kaidah' },
                      { id: 'contoh', label: '2. Contoh Kalimat' },
                      { id: 'latihan', label: '3. Latihan Mandiri' },
                      { id: 'quiz', label: '4. Kuis (Quiz)' }
                    ].map((st) => {
                      const isActive = materiStep === st.id;
                      const unlocked = isStepUnlocked(st.id as any);

                      return (
                        <button
                          key={st.id}
                          onClick={() => {
                            if (unlocked) {
                              setMateriStep(st.id as any);
                            } else {
                              showToast(`Alur Pembelajaran Wajib: Silakan selesaikan tahap sebelumnya terlebih dahulu!`, "error");
                            }
                          }}
                          disabled={!unlocked}
                          className={`relative text-[10px] md:text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition duration-150 whitespace-nowrap shrink-0 flex items-center gap-1 ${
                            isActive 
                              ? 'text-[#0d3b78] font-black' 
                              : unlocked
                                ? 'text-slate-500 hover:text-slate-800 cursor-pointer'
                                : 'text-slate-300 cursor-not-allowed opacity-60'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="active-materi-step-tab-indicator"
                              className="absolute inset-0 bg-white rounded-lg shadow-sm z-0"
                              transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1">
                            {st.label}
                            {!unlocked && <Lock className="w-2.5 h-2.5 text-slate-300 shrink-0" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  
                  {/* ================= STAGE 0: ICE BREAKING (Sesi Pemanasan Menyimak) ================= */}
                  {materiStep === 'ice_breaking' && (
                    <motion.div
                      key="step-ice-breaking"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="pb-24"
                    >
                      <IceBreakingGame
                        key={`ice-breaking-${selectedChapter}-${BAHAS_MATERI.id}`}
                        materiId={BAHAS_MATERI.id}
                        chapterId={selectedChapter}
                        topicName={BAHAS_MATERI.topik.includes(':') ? BAHAS_MATERI.topik.split(':')[1].trim() : BAHAS_MATERI.topik}
                        session={session}
                        onComplete={() => {
                          unlockStepForCurrentMateri('contoh');
                          setMateriStep('contoh');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </motion.div>
                  )}
                  
                  {/* ================= STAGE 1: CONTOH (Siswa Mengamati Contoh Dahulu) ================= */}
                  {materiStep === 'contoh' && (
                    <motion.div
                      key="step-contoh"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8 pb-48"
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 space-y-3">
                        <span className="text-[11px] font-black text-blue-800 uppercase tracking-widest flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-blue-600 animate-spin-slow" />
                          Langkah 1: Perhatikan & Amati Contoh (Al-Amtsilah)
                        </span>
                        <h3 className="text-base md:text-lg font-black text-blue-950">Mengapa dimulai dari contoh kalimat?</h3>
                        <p className="text-[15px] md:text-[16px] text-blue-900 leading-relaxed text-justify font-bold">
                          Pembelajaran mendalam yang efektif mengutamakan metode <b>induktif</b>. Dengan mengamati contoh konkret terlebih dahulu, otak Anda terstimulasi mengenali pola dan letak kata-kata dasar secara natural sebelum mencerna rumusan kaidah teoretis yang abstrak.
                        </p>
                      </div>

                      {/* Special Instruction for Al-Istifham */}
                      {selectedMateriIndex === 0 && selectedChapter === 1 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-amber-50/80 border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-sm space-y-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-md bg-amber-100 text-amber-800">
                              <Compass className="w-4 h-4 text-amber-600 animate-pulse" />
                            </span>
                            <span className="text-sm font-black text-amber-800 uppercase tracking-wider">Instruksi Pengamatan Khusus:</span>
                          </div>
                          <p 
                            className="text-[18px] md:text-[20px] text-slate-850 font-extrabold leading-relaxed italic"
                            style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                          >
                            "Telaah contoh percakapan ini. Amati kata yang digarisbawahi sebagai kalimat istifhām, lalu fokuskan pada bentuk dan fungsinya."
                          </p>
                        </motion.div>
                      )}

                      {/* Special Instruction for Al-Mubtada' wal Khabar */}
                      {selectedMateriIndex === 1 && selectedChapter === 1 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-amber-50/80 border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-sm space-y-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-md bg-amber-100 text-amber-800">
                              <Compass className="w-4 h-4 text-amber-600 animate-pulse" />
                            </span>
                            <span className="text-sm font-black text-amber-800 uppercase tracking-wider">Instruksi Pengamatan Khusus:</span>
                          </div>
                          <p 
                            className="text-[18px] md:text-[20px] text-slate-850 font-extrabold leading-relaxed italic"
                            style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                          >
                            "Pahami terlebih dahulu teks di bawah ini. Perhatikan kata-kata yang bergaris bawah sebagai mubtadaʾ dan khabar, lalu fokuskan pada bentuk serta fungsinya."
                          </p>
                        </motion.div>
                      )}

                      {/* Special Instruction for Qoidah Tahiyyah */}
                      {selectedMateriIndex === 2 && selectedChapter === 1 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-amber-50/80 border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-sm space-y-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-md bg-amber-100 text-amber-800">
                              <Compass className="w-4 h-4 text-amber-600 animate-pulse" />
                            </span>
                            <span className="text-sm font-black text-amber-800 uppercase tracking-wider">Instruksi Pengamatan Khusus:</span>
                          </div>
                          <p 
                            className="text-[18px] md:text-[20px] text-slate-850 font-extrabold leading-relaxed italic"
                            style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                          >
                            "Pahami teks percakapan yang digarisbawahi dan diberi warna sebagai contoh lafaz tahiyyah, lalu telaah makna serta tujuan komunikatifnya dalam konteks interaksi sosial untuk membangun pemahaman konseptual sebelum masuk ke pembahasan utama."
                          </p>
                        </motion.div>
                      )}

                      {/* Special Instruction for Isim Dhamir Mufrad */}
                      {selectedMateriIndex === 3 && selectedChapter === 1 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-amber-50/80 border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-sm space-y-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-md bg-amber-100 text-amber-800">
                              <Compass className="w-4 h-4 text-amber-600 animate-pulse" />
                            </span>
                            <span className="text-sm font-black text-amber-800 uppercase tracking-wider">Instruksi Pengamatan Khusus:</span>
                          </div>
                          <p 
                            className="text-[18px] md:text-[20px] text-slate-850 font-extrabold leading-relaxed italic"
                            style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                          >
                            "Pelajari teks bacaan yang digarisbawahi dan diberi warna sebagai contoh isim ḍamīr mufrad, kemudian analisis bentuk serta fungsi kata tersebut dalam struktur kalimat untuk memperoleh pemahaman konseptual sebelum memasuki tahap penjelasan lanjutan."
                          </p>
                        </motion.div>
                      )}

                      {/* Special Instruction for Isim Isyarah (Bab 2 Topic 1) */}
                      {selectedChapter === 2 && selectedMateriIndex === 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-amber-50/80 border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-sm space-y-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-md bg-amber-100 text-amber-800">
                              <Compass className="w-4 h-4 text-amber-600 animate-pulse" />
                            </span>
                            <span className="text-sm font-black text-amber-800 uppercase tracking-wider">Instruksi Pengamatan Khusus:</span>
                          </div>
                          <p 
                            className="text-[18px] md:text-[20px] text-slate-850 font-extrabold leading-relaxed italic"
                            style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                          >
                            "Perhatikan teks yang digarisbawahi sebagai contoh isim isyārah, lalu analisis bilangan (tunggal, dua, atau jamak), fungsi penggunaannya (untuk berakal atau tidak berakal), serta jenisnya (mudzakar atau muannats) agar diperoleh pemahaman dasar sebelum masuk ke materi pokok."
                          </p>
                        </motion.div>
                      )}

                      {/* Contoh Items List with Futuristic Elegant high contrast look */}
                      <div className="grid grid-cols-1 gap-6">
                        {BAHAS_MATERI.contohList.map((ex, i) => (
                          <div 
                            key={ex.id}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow transition duration-200"
                          >
                            <div className="bg-[#0d3b78] text-white px-4 py-2 flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">Contoh Kalimat {i + 1}</span>
                              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded">Model Kalimat Sederhana</span>
                            </div>

                            <div className="p-6 md:p-8 flex flex-col lg:flex-row justify-between items-stretch gap-6">
                              {/* Large clear Arabic box */}
                              <div className="flex-1 bg-slate-50/50 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-100 min-h-[140px]">
                                <p 
                                  className="arabic text-[#0a2c5c] text-center" 
                                  style={{ fontFamily: arabicFontFamily, fontSize: `${Math.max(26, Math.min(52, 32 * arabicScale))}px`, fontWeight: isArabicBold ? 'bold' : 'normal', lineHeight: 1.8 }}
                                  dangerouslySetInnerHTML={{ __html: ex.arabic }}
                                />
                                <p 
                                  className="text-[18px] md:text-[20px] text-amber-800 italic mt-3 font-bold text-center"
                                  style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                  dangerouslySetInnerHTML={{ __html: ex.latin }}
                                />
                              </div>

                              {/* Analysis & Translation */}
                              <div className="flex-1 flex flex-col justify-between space-y-5">
                                <div className="space-y-2">
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Terjemahan Indonesia:</span>
                                  <p 
                                    className="text-[18px] md:text-[20px] font-bold text-[#0d3b78] leading-relaxed"
                                    style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                  >
                                    "{ex.translation}"
                                  </p>
                                </div>

                                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analisis Struktur Pola Kalimat:</span>
                                  <p 
                                    className="text-[16px] md:text-[18px] text-slate-800 leading-relaxed whitespace-pre-line text-justify bg-slate-50 p-4 rounded-lg border border-slate-100 font-bold"
                                    style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                  >
                                    {ex.explanation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Navigation to next step */}
                      <div className="flex justify-between items-center pt-4">
                        <button
                          onClick={() => setMateriStep('kaidah')}
                          className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs md:text-sm flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4 text-slate-500" />
                          Kembali ke Pembelajaran Kaidah
                        </button>

                        <button
                          onClick={() => {
                            unlockStepForCurrentMateri('latihan');
                            setMateriStep('latihan');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition cursor-pointer"
                        >
                          Saya Memahami Contoh, Lanjut ke Latihan Mandiri
                          <ArrowRight className="w-4 h-4 text-white" />
                        </button>
                      </div>

                    </motion.div>
                  )}

                  {/* ================= STAGE 2: KAIDAH MATERI (Mempelajari Aturan Bahasa) ================= */}
                  {materiStep === 'kaidah' && (
                    <motion.div
                      key="step-kaidah"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8 pb-48"
                    >
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 space-y-3">
                        <span className="text-[11px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-amber-600" />
                          Langkah 2: Kuasai Rumusan Kaidah Teori (Al-Qawaid)
                        </span>
                        <h3 className="text-base md:text-lg font-black text-amber-950">{BAHAS_MATERI.materiContent.title}</h3>
                        <p 
                          className="text-[17px] md:text-[19px] text-amber-950 leading-relaxed text-justify font-normal whitespace-pre-line"
                          style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                        >
                          {BAHAS_MATERI.materiContent.introduction}
                        </p>
                      </div>

                      {/* Responsive Kaidah Table if available */}
                      {BAHAS_MATERI.materiContent.table && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                          <div className="bg-[#0d3b78]/5 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-[#0d3b78]">Tabel Istifham Lengkap</span>
                          </div>
                          <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full text-left border-collapse min-w-[750px]">
                              <thead>
                                <tr className="bg-[#0d3b78] text-white text-[13px] font-black uppercase tracking-wider">
                                  <th className="px-4 py-3 text-center w-12">No</th>
                                  <th className="px-4 py-3 text-center">Kata Tanya</th>
                                  <th className="px-4 py-3">Arti</th>
                                  <th className="px-4 py-3 w-1/3">Peruntukan</th>
                                  <th className="px-4 py-3 text-center">Contoh Pertanyaan</th>
                                  <th className="px-4 py-3 text-center">Contoh Jawaban</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {BAHAS_MATERI.materiContent.table.map((row) => (
                                  <tr 
                                    key={row.no} 
                                    className="hover:bg-slate-50 transition duration-100 text-[17px] md:text-[19px] font-normal text-slate-700"
                                    style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                  >
                                    <td className="px-4 py-4 text-center text-xs font-extrabold text-slate-400">{row.no}</td>
                                    <td className="px-4 py-4 text-center">
                                      <span 
                                        className="inline-block px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-normal text-[32px] leading-none"
                                        style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                      >
                                        {row.kataTanya}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 font-bold text-amber-900">{row.arti}</td>
                                    <td className="px-4 py-4 text-slate-600 font-normal leading-relaxed">{row.peruntukan}</td>
                                    <td className="px-4 py-4 text-center text-slate-900 whitespace-pre-line leading-relaxed">
                                      <span style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: '28px' }} className="font-normal">
                                        {row.contohPertanyaan}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 text-center text-[#0d3b78] whitespace-pre-line leading-relaxed">
                                      <span style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: '28px' }} className="font-normal">
                                        {row.contohJawaban}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Responsive Tahiyyah Table if available */}
                      {BAHAS_MATERI.materiContent.tahiyyahTable && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                          <div className="bg-[#0d3b78]/5 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-[#0d3b78] flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                              Tabel Ungkapan Sapaan (التَّحِيَّاتُ)
                            </span>
                          </div>
                          <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                              <thead>
                                <tr className="bg-[#0d3b78] text-white text-[13px] font-black uppercase tracking-wider">
                                  <th className="px-4 py-3 text-center w-12">No</th>
                                  <th className="px-4 py-3 text-center">الْتَّحِيَّةُ (Sapaan)</th>
                                  <th className="px-4 py-3 text-center">الْجَوَابُ (Jawaban)</th>
                                  <th className="px-4 py-3">الْبَيَانُ (Penjelasan)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {BAHAS_MATERI.materiContent.tahiyyahTable.map((row, idx) => (
                                  <tr 
                                    key={idx} 
                                    className="hover:bg-slate-50 transition duration-100 text-[17px] md:text-[19px] font-normal text-slate-700"
                                    style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                  >
                                    <td className="px-4 py-4 text-center text-xs font-extrabold text-slate-400">{idx + 1}</td>
                                    <td className="px-4 py-4 text-center">
                                      <span 
                                        className="inline-block px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-normal text-[26px] leading-none"
                                        style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                      >
                                        {row.tahiyyah}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                      <span 
                                        className="inline-block px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-normal text-[26px] leading-none"
                                        style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                      >
                                        {row.jawab}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 font-bold text-amber-950 text-sm md:text-base">{row.bayan}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Materi Tambahan untuk Tahiyyah */}
                      {BAHAS_MATERI.materiContent.tahiyyahTambahanTable && (
                        <div className="space-y-4 mt-8">
                          <div className="bg-[#0d3b78]/5 rounded-2xl border border-dashed border-[#0d3b78]/30 p-6 shadow-inner space-y-3">
                            <h4 className="text-sm font-black text-[#0d3b78] uppercase tracking-widest flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                              Materi Tambahan: Ungkapan Sapaan Lainnya
                            </h4>
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold">
                              {BAHAS_MATERI.materiContent.tahiyyahTambahanIntro}
                            </p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-[#0d3b78]/5 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                              <span className="text-xs font-black uppercase tracking-wider text-[#0d3b78] flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                                Tabel Ungkapan Sapaan Tambahan
                              </span>
                            </div>
                            <div className="overflow-x-auto scrollbar-thin">
                              <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                  <tr className="bg-[#0d3b78] text-white text-[13px] font-black uppercase tracking-wider">
                                    <th className="px-4 py-3 text-center w-12">No</th>
                                    <th className="px-4 py-3 text-center">العِبَارَةُ (Ungkapan)</th>
                                    <th className="px-4 py-3 text-center">الجَوَابُ (Jawaban)</th>
                                    <th className="px-4 py-3">البَيَانُ (Penjelasan)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {BAHAS_MATERI.materiContent.tahiyyahTambahanTable.map((row, idx) => (
                                    <tr 
                                      key={idx} 
                                      className="hover:bg-slate-50 transition duration-100 text-[17px] md:text-[19px] font-normal text-slate-700"
                                      style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                    >
                                      <td className="px-4 py-4 text-center text-xs font-extrabold text-slate-400">{idx + 1}</td>
                                      <td className="px-4 py-4 text-center">
                                        <span 
                                          className="inline-block px-3 py-1.5 bg-red-50/50 text-red-600 rounded-lg font-normal text-[26px] leading-none"
                                          style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                        >
                                          {row.tahiyyah}
                                        </span>
                                      </td>
                                      <td className="px-4 py-4 text-center">
                                        <span 
                                          className="inline-block px-3 py-1.5 bg-green-50/50 text-green-700 rounded-lg font-normal text-[26px] leading-none"
                                          style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                        >
                                          {row.jawab}
                                        </span>
                                      </td>
                                      <td className="px-4 py-4 font-bold text-amber-950 text-sm md:text-base">{row.bayan}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Responsive Isyarah Table if available */}
                      {BAHAS_MATERI.materiContent.isyarahTable && (
                        selectedChapter === 2 && selectedMateriIndex === 0 ? (
                          <div className="space-y-6 mt-6">
                            {/* Table 1: Pembagian Utama */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                              <div className="bg-[#0d3b78] px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                                  Tabel Pembagian Utama Isim Isyarah (اِسْمُ الإِشَارَةِ)
                                </span>
                              </div>
                              <div className="overflow-x-auto scrollbar-thin">
                                <table className="w-full text-center border-collapse min-w-[700px]">
                                  <thead>
                                    <tr className="bg-[#0d3b78] text-white text-[13px] font-black uppercase tracking-wider">
                                      <th rowSpan={2} className="px-6 py-3 border border-slate-200 text-center">Tunggal (مُفْرَدٌ)</th>
                                      <th rowSpan={2} className="px-6 py-3 border border-slate-200 text-center">Dua (مُثَنَّى)</th>
                                      <th colSpan={2} className="px-6 py-2 border border-slate-200 text-center">جَمَعْ jamak</th>
                                      <th rowSpan={2} className="px-6 py-3 border border-slate-200 text-center">Keterangan / بَيَانٌ</th>
                                    </tr>
                                    <tr className="bg-[#1f6fe5] text-white text-[12px] font-black uppercase tracking-wider">
                                      <th className="px-6 py-2 border border-slate-200 text-center">Berakal / عَاقِلٌ</th>
                                      <th className="px-6 py-2 border border-slate-200 text-center">Tidak Berakal / غَيْرُ الْعَاقِلِ</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-150">
                                    <tr className="hover:bg-slate-50 transition duration-100">
                                      <td className="px-6 py-4 border border-slate-200 font-bold text-[32px] text-slate-800" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>هٰذَا</td>
                                      <td className="px-6 py-4 border border-slate-200 font-bold text-[32px] text-slate-800" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>هٰذَانِ</td>
                                      <td rowSpan={2} className="px-6 py-4 border border-slate-200 font-bold text-[32px] bg-blue-50/40 text-blue-900 text-center" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>هٰؤُلَاءِ</td>
                                      <td rowSpan={2} className="px-6 py-4 border border-slate-200 font-bold text-[32px] bg-red-50/40 text-red-900 text-center" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>هٰذِهِ</td>
                                      <td className="px-6 py-4 border border-slate-200 font-semibold text-slate-700 text-xs md:text-sm text-left leading-relaxed">(ini) untuk mudzakkar</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition duration-100">
                                      <td className="px-6 py-4 border border-slate-200 font-bold text-[32px] text-slate-800" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>هٰذِهِ</td>
                                      <td className="px-6 py-4 border border-slate-200 font-bold text-[32px] text-slate-800" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>هَاتَانِ</td>
                                      <td className="px-6 py-4 border border-slate-200 font-semibold text-slate-700 text-xs md:text-sm text-left leading-relaxed">(ini) untuk mu'annats</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition duration-100">
                                      <td className="px-6 py-4 border border-slate-200 font-bold text-[32px] text-slate-800" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>ذٰلِكَ</td>
                                      <td className="px-6 py-4 border border-slate-200 font-bold text-[32px] text-slate-800" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>ذَانِكَ</td>
                                      <td rowSpan={2} className="px-6 py-4 border border-slate-200 font-bold text-[32px] bg-blue-50/40 text-blue-900 text-center" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>أُولٰئِكَ</td>
                                      <td rowSpan={2} className="px-6 py-4 border border-slate-200 font-bold text-[32px] bg-red-50/40 text-red-900 text-center" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>تِلْكَ</td>
                                      <td className="px-6 py-4 border border-slate-200 font-semibold text-slate-700 text-xs md:text-sm text-left leading-relaxed">(itu) untuk mudzakkar</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition duration-100">
                                      <td className="px-6 py-4 border border-slate-200 font-bold text-[32px] text-slate-800" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>تِلْكَ</td>
                                      <td className="px-6 py-4 border border-slate-200 font-bold text-[32px] text-slate-800" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>تَانِكَ</td>
                                      <td className="px-6 py-4 border border-slate-200 font-semibold text-slate-700 text-xs md:text-sm text-left leading-relaxed">(itu) untuk mu'annats</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Keterangan */}
                            <div className="bg-amber-50/70 border-l-4 border-amber-500 p-5 rounded-r-2xl text-slate-750 text-xs md:text-sm leading-relaxed font-bold">
                              <span className="font-black text-amber-950 block text-[13px] uppercase tracking-wider mb-1">Keterangan:</span>
                              Dari tabel di atas diketahui bahwa untuk menunjuk sesuatu “yang berakal” dalam bentuk jamak digunakan lafal <span className="text-[#0d3b78] font-extrabold" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: '20px' }}>هٰؤُلَاءِ</span> (untuk jarak dekat/ini) dan lafal <span className="text-[#0d3b78] font-extrabold" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: '20px' }}>أُولٰئِكَ</span> (untuk jarak jauh/itu). Adapun untuk menunjuk sesuatu “yang tidak berakal” dalam bentuk jamak memakai lafal <span className="text-red-700 font-extrabold" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: '20px' }}>هٰذِهِ</span> (untuk jarak dekat/ini) dan lafal <span className="text-red-700 font-extrabold" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: '20px' }}>تِلْكَ</span> (untuk jarak jauh/itu).
                            </div>

                            {/* Table 2: Mudzakar */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                              <div className="bg-[#0d3b78] px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-white">
                                  اِسْمُ الإِشَارَةِ لِلْمُذَكَّرِ (Isim Isyarah untuk Mudzakkar)
                                </span>
                              </div>
                              <div className="overflow-x-auto scrollbar-thin">
                                <table className="w-full text-center border-collapse min-w-[700px]">
                                  <thead>
                                    <tr className="bg-[#0d3b78] text-white text-[13px] font-black uppercase tracking-wider">
                                      <th className="px-6 py-3 border border-slate-200">Tunggal (مُفْرَدٌ)</th>
                                      <th className="px-6 py-3 border border-slate-200">Dua (مُثَنَّى)</th>
                                      <th className="px-6 py-3 border border-slate-200">Jamak / جَمَعْ</th>
                                      <th className="px-6 py-3 border border-slate-200">Keterangan / بَيَانٌ</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    <tr className="hover:bg-slate-50 transition duration-100 text-[26px] md:text-[28px]" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>
                                      <td className="px-6 py-4 border border-slate-100 text-slate-800">هٰذَا / ذٰلِكَ كِتَابٌ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-slate-800">هٰذَانِ / ذَانِكَ كِتَابَانِ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-red-600 font-bold">هٰذِهِ كُتُبٌ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-xs md:text-sm font-bold text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>لِغَيْرِ الْعَاقِلِ</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition duration-100 text-[26px] md:text-[28px]" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>
                                      <td className="px-6 py-4 border border-slate-100 text-slate-800">هٰذَا / ذٰلِكَ تِلْمِيْذٌ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-slate-800">هٰذَانِ / ذَانِكَ تِلْمِيْذَانِ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-emerald-600 font-bold">هٰؤُلَاءِ / أُولٰئِكَ تَلَامِيْذُ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-xs md:text-sm font-bold text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>لِلْعَاقِلِ</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Table 3: Muannats */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                              <div className="bg-[#0d3b78] px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-white">
                                  اِسْمُ الإِشَارَةِ لِلْمُؤَنَّثِ (Isim Isyarah untuk Muannats)
                                </span>
                              </div>
                              <div className="overflow-x-auto scrollbar-thin">
                                <table className="w-full text-center border-collapse min-w-[700px]">
                                  <thead>
                                    <tr className="bg-[#0d3b78] text-white text-[13px] font-black uppercase tracking-wider">
                                      <th className="px-6 py-3 border border-slate-200">Tunggal (مُفْرَدٌ)</th>
                                      <th className="px-6 py-3 border border-slate-200">Dua (مُثَنَّى)</th>
                                      <th className="px-6 py-3 border border-slate-200">Jamak / جَمَعْ</th>
                                      <th className="px-6 py-3 border border-slate-200">Keterangan / بَيَانٌ</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    <tr className="hover:bg-slate-50 transition duration-100 text-[26px] md:text-[28px]" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>
                                      <td className="px-6 py-4 border border-slate-100 text-slate-800">هٰذِهِ / تِلْكَ كُرَّاسَةٌ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-slate-800">هَاتَانِ / تَانِكَ كُرَّاسَتَانِ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-red-600 font-bold">هٰذِهِ كُرَّاسَاتٌ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-xs md:text-sm font-bold text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>لِغَيْرِ الْعَاقِلِ</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition duration-100 text-[26px] md:text-[28px]" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>
                                      <td className="px-6 py-4 border border-slate-100 text-slate-800">هٰذِهِ / تِلْكَ مُدَرِّسَةٌ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-slate-800">هَاتَانِ / تَانِكَ مُدَرِّسَتَانِ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-emerald-600 font-bold">هٰؤُلَاءِ / أُولٰئِكَ مُدَرِّسَاتٌ</td>
                                      <td className="px-6 py-4 border border-slate-100 text-xs md:text-sm font-bold text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>لِلْعَاقِلِ</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Materi Tambahan */}
                            <div className="mt-8 space-y-4">
                              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-2xl shadow-sm">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-emerald-600" />
                                  <span className="text-xs font-black text-emerald-900 uppercase tracking-widest">Catatan Penting:</span>
                                </div>
                                <p className="text-slate-800 text-sm md:text-base font-bold leading-relaxed mt-2">
                                  Isim isyārah hukumnya <span className="text-emerald-800 font-black">مَبْنِيٌّ</span> &rarr; bentuknya tetap, tidak berubah meskipun posisinya berbeda dalam i‘rab.
                                </p>
                              </div>

                              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-emerald-800 px-5 py-3.5 border-b border-slate-200">
                                  <span className="text-xs font-black uppercase tracking-wider text-white">
                                    Tabel Kategori, Contoh Harakat & Keterangan Lengkap
                                  </span>
                                </div>
                                <div className="overflow-x-auto scrollbar-thin">
                                  <table className="w-full text-left border-collapse min-w-[650px]">
                                    <thead>
                                      <tr className="bg-slate-100 text-slate-700 text-[11px] font-black uppercase tracking-wider">
                                        <th className="px-6 py-3 border border-slate-200 w-1/3">Kategori</th>
                                        <th className="px-6 py-3 text-center border border-slate-200 w-1/3">Contoh dengan Harakat</th>
                                        <th className="px-6 py-3 border border-slate-200 w-1/3">Keterangan</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      <tr className="hover:bg-slate-50 transition duration-100 text-slate-700">
                                        <td className="px-6 py-4 border border-slate-100 font-bold text-xs md:text-sm text-slate-900">Mudzakar – dhamir huwa</td>
                                        <td className="px-6 py-4 border border-slate-100 text-center text-[28px] font-bold text-[#0d3b78]" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>هٰذَا، هٰذَانِ، هٰؤُلَاءِ</td>
                                        <td className="px-6 py-4 border border-slate-100 font-semibold text-xs md:text-sm text-slate-600">Menunjuk laki-laki / benda mudzakar dekat</td>
                                      </tr>
                                      <tr className="hover:bg-slate-50 transition duration-100 text-slate-700">
                                        <td className="px-6 py-4 border border-slate-100 font-bold text-xs md:text-sm text-slate-900">Muannats – dhamir hiya</td>
                                        <td className="px-6 py-4 border border-slate-100 text-center text-[28px] font-bold text-[#0d3b78]" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>هٰذِهِ، هٰتَانِ، هٰؤُلَاءِ</td>
                                        <td className="px-6 py-4 border border-slate-100 font-semibold text-xs md:text-sm text-slate-600">Menunjuk perempuan / benda muannats dekat</td>
                                      </tr>
                                      <tr className="hover:bg-slate-50 transition duration-100 text-slate-700">
                                        <td className="px-6 py-4 border border-slate-100 font-bold text-xs md:text-sm text-slate-900">Mudzakar – dhamir anta</td>
                                        <td className="px-6 py-4 border border-slate-100 text-center text-[28px] font-bold text-[#0d3b78]" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>ذٰلِكَ، ذَانِكَ، أُولٰئِكَ</td>
                                        <td className="px-6 py-4 border border-slate-100 font-semibold text-xs md:text-sm text-slate-600">Menunjuk jauh (mudzakar)</td>
                                      </tr>
                                      <tr className="hover:bg-slate-50 transition duration-100 text-slate-700">
                                        <td className="px-6 py-4 border border-slate-100 font-bold text-xs md:text-sm text-slate-900">Muannats – dhamir anti</td>
                                        <td className="px-6 py-4 border border-slate-100 text-center text-[28px] font-bold text-[#0d3b78]" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>تِلْكَ، تَانِكَ، أُوْلٰئِكَ</td>
                                        <td className="px-6 py-4 border border-slate-100 font-semibold text-xs md:text-sm text-slate-600">Menunjuk jauh (muannats)</td>
                                      </tr>
                                      <tr className="hover:bg-slate-50 transition duration-100 text-slate-700">
                                        <td className="px-6 py-4 border border-slate-100 font-bold text-xs md:text-sm text-slate-900">Tambahan khusus</td>
                                        <td className="px-6 py-4 border border-slate-100 text-center text-[28px] font-bold text-purple-700" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}>هُنَالِكَ، ثَمَّ، هَهُنَا</td>
                                        <td className="px-6 py-4 border border-slate-100 font-semibold text-xs md:text-sm text-slate-600">Menunjuk tempat dekat/jauh</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                            <div className="bg-[#0d3b78]/5 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                              <span className="text-xs font-black uppercase tracking-wider text-[#0d3b78] flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                                Tabel Pembagian Isim Isyaroh (Kata Tunjuk)
                              </span>
                            </div>
                            <div className="overflow-x-auto scrollbar-thin">
                              <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                  <tr className="bg-[#0d3b78] text-white text-[13px] font-black uppercase tracking-wider">
                                    <th className="px-6 py-3 text-center w-36">Kata Tunjuk</th>
                                    <th className="px-6 py-3 text-center w-36">Arti</th>
                                    <th className="px-6 py-3 text-center w-48">Penggunaan</th>
                                    <th className="px-6 py-3 text-center">Contoh Kalimat</th>
                                    <th className="px-6 py-3">Keterangan</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {BAHAS_MATERI.materiContent.isyarahTable.map((row, idx) => (
                                    <tr 
                                      key={idx} 
                                      className="hover:bg-slate-50 transition duration-100 text-[17px] md:text-[19px] font-normal text-slate-700"
                                      style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                    >
                                      <td className="px-6 py-4 text-center">
                                        <span 
                                          className="inline-block px-4 py-1.5 bg-blue-50 text-[#0d3b78] rounded-xl font-bold text-[32px] leading-none"
                                          style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                        >
                                          {row.kataTunjuk}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-center font-bold text-amber-950 text-base md:text-lg">
                                        {row.arti}
                                      </td>
                                      <td className="px-6 py-4 text-center text-sm">
                                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold">
                                          {row.penggunaan}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <span 
                                          className="text-[24px] text-emerald-800 font-bold block"
                                          style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                        >
                                          {row.contoh}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 font-semibold text-slate-600 text-xs md:text-sm leading-relaxed">
                                        {row.penjelasan}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )
                      )}

                      {/* Responsive Dhamir Table if available */}
                      {BAHAS_MATERI.materiContent.dhamirTable && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                          <div className="bg-[#0d3b78]/5 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-[#0d3b78] flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                              Tabel Isim Dhamir Mufrad (Kata Ganti Tunggal)
                            </span>
                          </div>
                          <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                              <thead>
                                <tr className="bg-[#0d3b78] text-white text-[13px] font-black uppercase tracking-wider">
                                  <th className="px-6 py-3 text-center w-32">Kata Ganti</th>
                                  <th className="px-6 py-3 text-center w-32">Arti</th>
                                  <th className="px-6 py-3">Keterangan</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {BAHAS_MATERI.materiContent.dhamirTable.map((row, idx) => (
                                  <tr 
                                    key={idx} 
                                    className="hover:bg-slate-50 transition duration-100 text-[17px] md:text-[19px] font-normal text-slate-700"
                                    style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                  >
                                    <td className="px-6 py-4 text-center">
                                      <span 
                                        className="inline-block px-4 py-1.5 bg-blue-50 text-[#0d3b78] rounded-xl font-bold text-[32px] leading-none"
                                        style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                      >
                                        {row.dhamir}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-amber-950 text-base md:text-lg">
                                      {row.arti}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-600 text-sm md:text-base leading-relaxed">{row.keterangan}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Responsive Fiil Change Table if available */}
                      {BAHAS_MATERI.materiContent.fiilChangeTable && (
                        <div className="space-y-4 mt-8">
                          <div className="bg-amber-50/80 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-sm">
                            <p className="text-[17px] md:text-[19px] text-slate-800 font-extrabold leading-relaxed italic" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                              "Sekarang, perhatikan perubahan kata kerja (fi’il) yang dipakai oleh masing – masing damir tersebut! Ingat, cermati dan hafalkan perubahannya!"
                            </p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-[#0d3b78]/5 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                              <span className="text-xs font-black uppercase tracking-wider text-[#0d3b78] flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                Tabel Perubahan Fi'il (Kata Kerja) Berdasarkan Dhamir
                              </span>
                            </div>
                            <div className="overflow-x-auto scrollbar-thin">
                              <table className="w-full text-left border-collapse min-w-[750px]">
                                <thead>
                                  <tr className="bg-[#0d3b78] text-white text-[13px] font-black uppercase tracking-wider">
                                    <th className="px-4 py-3 text-center w-12">الْنَّمْرَةُ (No)</th>
                                    <th className="px-4 py-3 text-center">الْمَعْنَى (Arti)</th>
                                    <th className="px-4 py-3 text-center">أَنَا (Saya)</th>
                                    <th className="px-4 py-3 text-center">أَنْتَ (Kamu LK)</th>
                                    <th className="px-4 py-3 text-center">أَنْتِ (Kamu PR)</th>
                                    <th className="px-4 py-3 text-center">هُوَ (Dia LK)</th>
                                    <th className="px-4 py-3 text-center">هِيَ (Dia PR)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {BAHAS_MATERI.materiContent.fiilChangeTable.map((row, idx) => (
                                    <tr 
                                      key={idx} 
                                      className="hover:bg-slate-50 transition duration-100 text-[17px] md:text-[19px] font-normal text-slate-700"
                                      style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                    >
                                      <td className="px-4 py-4 text-center text-xs font-extrabold text-slate-400">{row.nomor}</td>
                                      <td className="px-4 py-4 text-center font-bold text-amber-950 text-sm md:text-base">{row.makna}</td>
                                      <td className="px-4 py-4 text-center">
                                        <span 
                                          className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-normal text-[24px] leading-none"
                                          style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                        >
                                          {row.ana}
                                        </span>
                                      </td>
                                      <td className="px-4 py-4 text-center">
                                        <span 
                                          className="inline-block px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-normal text-[24px] leading-none"
                                          style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                        >
                                          {row.anta}
                                        </span>
                                      </td>
                                      <td className="px-4 py-4 text-center">
                                        <span 
                                          className="inline-block px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg font-normal text-[24px] leading-none"
                                          style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                        >
                                          {row.anti}
                                        </span>
                                      </td>
                                      <td className="px-4 py-4 text-center">
                                        <span 
                                          className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-normal text-[24px] leading-none"
                                          style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                        >
                                          {row.huwa}
                                        </span>
                                      </td>
                                      <td className="px-4 py-4 text-center">
                                        <span 
                                          className="inline-block px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg font-normal text-[24px] leading-none"
                                          style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                        >
                                          {row.hiya}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dhamir Tambahan if available */}
                      {BAHAS_MATERI.materiContent.dhamirTambahan && (
                        <div className="space-y-6 mt-8">
                          <div className="bg-[#0d3b78]/5 rounded-2xl border border-dashed border-[#0d3b78]/30 p-6 space-y-4">
                            <h4 className="text-base font-black text-[#0d3b78] uppercase tracking-widest flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                              Materi Tambahan: Hukum & Pola Isim Dhamir
                            </h4>
                            
                            <div className="space-y-2">
                              <h5 className="text-sm font-extrabold text-amber-950 uppercase tracking-wider">Hukum Isim Dhamir:</h5>
                              <p className="text-slate-700 text-sm md:text-base font-bold pl-4 border-l-2 border-amber-500/50">
                                {BAHAS_MATERI.materiContent.dhamirTambahan.hukumDhamir}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <h5 className="text-sm font-extrabold text-amber-950 uppercase tracking-wider">Jenis Dhamir:</h5>
                              <ul className="space-y-2 pl-4 border-l-2 border-amber-500/50">
                                {BAHAS_MATERI.materiContent.dhamirTambahan.jenisDhamirPoints.map((pt, pIdx) => (
                                  <li key={pIdx} className="text-slate-700 text-sm md:text-base font-semibold list-disc list-inside">
                                    {pt}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
                            <h4 className="text-base font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                              <span>3. Pola Penggunaan Dhamir Mufrad</span>
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {BAHAS_MATERI.materiContent.dhamirTambahan.polaPenggunaan.map((pola, idx) => (
                                <div key={idx} className="bg-slate-50/55 border border-slate-150 rounded-xl p-5 hover:border-blue-200 transition space-y-3.5">
                                  <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
                                    <span className="w-2 h-2 rounded-full bg-[#0d3b78]" />
                                    <span className="text-[20px] font-bold text-[#0d3b78] font-mono">{pola.dhamir}</span>
                                  </div>
                                  <div className="space-y-3">
                                    {pola.items.map((item, iIdx) => (
                                      <div key={iIdx} className="space-y-1">
                                        <span className="text-[12px] font-black uppercase text-slate-400 block tracking-wider">{item.category}</span>
                                        <p className="text-[16px] md:text-[18px] text-slate-800 font-extrabold leading-relaxed" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                                          {item.examples}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Responsive Mubtada/Khabar Table if available */}
                      {BAHAS_MATERI.materiContent.mubtadaTable && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6">
                          <div className="bg-[#0d3b78]/5 -mx-6 -mt-6 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-[#0d3b78] flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#0d3b78]" />
                              Tabel Pembelajaran Al-Mubtada’ wal Khabar (الْمُبْتَدَأُ وَالْخَبَرُ)
                            </span>
                          </div>
                          
                          <div className="overflow-x-auto scrollbar-thin border border-slate-150 rounded-xl">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                              <thead>
                                <tr className="bg-[#0d3b78] text-white text-[14px] font-black uppercase tracking-wider">
                                  <th className="px-6 py-3.5 text-center">الْضَمِيْرُ الْمُنْفَصِلُ (Dhamir)</th>
                                  <th className="px-6 py-3.5 text-center">الْمِثَالُ (Contoh / Mitsal)</th>
                                  <th className="px-6 py-3.5 text-center">الْمَعْنَى (Makna / Arti)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {BAHAS_MATERI.materiContent.mubtadaTable.map((row, rIdx) => (
                                  <tr 
                                    key={rIdx} 
                                    className="hover:bg-slate-50 transition duration-150 text-[18px] md:text-[20px] font-normal text-slate-700"
                                    style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                  >
                                    <td className="px-6 py-4 text-center">
                                      <span 
                                        className="inline-block px-4 py-1.5 bg-blue-50 text-[#0d3b78] rounded-xl font-bold text-[32px] leading-none"
                                        style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                      >
                                        {row.dhamir}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <span 
                                        className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl font-normal text-[32px] leading-none"
                                        style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                      >
                                        {row.contoh}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-900 font-extrabold text-[18px] md:text-[20px]">
                                      {row.makna}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {BAHAS_MATERI.materiContent.keteranganMubtada && (
                            <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-200/60 space-y-3.5">
                              <h5 className="text-sm font-black text-amber-900 uppercase tracking-wider flex items-center gap-2">
                                <span className="p-1 rounded bg-amber-100 text-amber-800">📌</span>
                                Keterangan Analisis Kaidah:
                              </h5>
                              <ul className="space-y-2.5">
                                {BAHAS_MATERI.materiContent.keteranganMubtada.map((ket, kIdx) => (
                                  <li 
                                    key={kIdx} 
                                    className="flex items-start gap-2.5 text-[16px] md:text-[18px] text-slate-800 leading-relaxed font-normal"
                                    style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                  >
                                    <span className="text-amber-500 font-black mt-0.5">•</span>
                                    <span>{ket}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Sifat Table */}
                          {BAHAS_MATERI.materiContent.sifatTable && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-1.5">
                                <span className="text-xs font-black text-blue-900 uppercase tracking-wider">Catatan:</span>
                                <p className="text-[17px] md:text-[19px] text-slate-800 font-extrabold" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                                  {BAHAS_MATERI.materiContent.sifatTableTitle}
                                </p>
                              </div>
                              <div className="overflow-x-auto scrollbar-thin border border-slate-150 rounded-xl">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                  <thead>
                                    <tr className="bg-[#0d3b78] text-white text-[14px] font-black uppercase tracking-wider">
                                      <th className="px-6 py-3.5 text-center">الْمِثَالُ (Contoh)</th>
                                      <th className="px-6 py-3.5 text-center">الْمُبْتَدَأُ (Mubtada’)</th>
                                      <th className="px-6 py-3.5 text-center">الْخَبَرُ (Khabar)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 bg-white">
                                    {BAHAS_MATERI.materiContent.sifatTable.map((sRow, sIdx) => (
                                      <tr 
                                        key={sIdx} 
                                        className="hover:bg-slate-50 transition duration-150 text-[26px] md:text-[30px] font-normal text-slate-700"
                                        style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                      >
                                        <td className="px-6 py-4 text-center text-blue-900 font-bold bg-blue-50/20">
                                          {sRow.contoh}
                                        </td>
                                        <td className="px-6 py-4 text-center text-[#0d3b78]">
                                          {sRow.mubtada}
                                        </td>
                                        <td className="px-6 py-4 text-center text-red-600">
                                          {sRow.khabar}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Materi Tambahan */}
                          {BAHAS_MATERI.materiContent.materiTambahan && (
                            <div className="bg-[#0d3b78]/5 rounded-2xl p-6 border border-[#0d3b78]/20 space-y-5 mt-6">
                              <h4 className="text-[18px] md:text-[20px] font-black text-[#0d3b78] border-b border-[#0d3b78]/15 pb-2.5 flex items-center gap-2">
                                <span>{BAHAS_MATERI.materiContent.materiTambahan.title}</span>
                              </h4>
                              <ul className="space-y-3">
                                {BAHAS_MATERI.materiContent.materiTambahan.points.map((pt, pIdx) => (
                                  <li 
                                    key={pIdx}
                                    className="flex items-start gap-2.5 text-[16px] md:text-[18px] text-slate-800 leading-relaxed font-normal"
                                    style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                  >
                                    <span className="text-[#0d3b78] font-black mt-0.5">•</span>
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>

                              <div className="space-y-3 pt-2">
                                <h5 className="text-[16px] md:text-[18px] font-extrabold text-[#0d3b78]">
                                  {BAHAS_MATERI.materiContent.materiTambahan.macamMaarifatingTitle}
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {BAHAS_MATERI.materiContent.materiTambahan.macamMaarifatingList.map((mItem) => (
                                    <div key={mItem.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
                                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider font-mono">
                                        {mItem.id}. {mItem.title}
                                      </span>
                                      <div 
                                        className="text-right text-[26px] md:text-[30px] text-[#0d3b78] font-normal leading-relaxed"
                                        style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                                        dir="rtl"
                                      >
                                        {mItem.contoh}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl p-4 text-[16px] md:text-[18px] leading-relaxed font-extrabold flex items-start gap-2.5" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                                <span className="shrink-0 mt-0.5">📌</span>
                                <span>{BAHAS_MATERI.materiContent.materiTambahan.closingPoint}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Interactive Kaidah Accordions / Details */}
                      {BAHAS_MATERI.materiContent.sections && BAHAS_MATERI.materiContent.sections.length > 0 && (
                        <div className="space-y-5">
                          {BAHAS_MATERI.materiContent.sections.map((sec, idx) => (
                            <div 
                              key={idx}
                              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                            >
                              <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                                <h4 className="text-base md:text-lg font-black text-[#0d3b78]">{sec.subtitle}</h4>
                                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">Kaidah {idx + 1}</span>
                              </div>

                              <div className="p-5 md:p-6 space-y-5">
                                {/* Arabic Definition with clean Noto Naskh font */}
                                {sec.arabicText && (
                                  <div className="p-5 bg-[#0d3b78]/5 rounded-lg border border-[#0d3b78]/10 text-center">
                                    <p className="arabic text-[#0d3b78] text-center" style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: `${Math.max(28, Math.min(42, 30 * arabicScale))}px`, fontWeight: isArabicBold ? 'bold' : 'normal', lineHeight: 1.8 }}>
                                      {sec.arabicText}
                                    </p>
                                  </div>
                                )}

                                <p 
                                  className="text-[17px] md:text-[19px] text-slate-900 leading-relaxed text-justify font-normal"
                                  style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                >
                                  {sec.explanation}
                                </p>

                                {/* Key characteristics list */}
                                {sec.points && (
                                  <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 space-y-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Ciri-ciri Fisik Gramatikal:</p>
                                    <ul className="space-y-2">
                                      {sec.points.map((pt, pIdx) => (
                                        <li 
                                          key={pIdx} 
                                          className="flex items-start gap-2 text-[16px] md:text-[18px] text-slate-800 font-normal"
                                          style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                        >
                                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                          <span>{pt}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Catatan Tambahan (Khusus Al-Istifham) */}
                      {selectedMateriIndex === 0 && selectedChapter === 1 && (
                        <div className="space-y-6 mt-8 pt-8 border-t border-slate-200">
                          <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                            <h3 className="text-xl font-black text-[#0d3b78] tracking-tight" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                              Catatan Tambahan
                            </h3>
                          </div>

                          {/* Card 1: Istifhām sebagai Khobar Muqaddam */}
                          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                            <h4 className="text-[18px] md:text-[20px] font-bold text-[#0d3b78]" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                              • Istifhām sebagai Khobar Muqaddam
                            </h4>
                            
                            <p className="text-[17px] md:text-[19px] text-slate-700 leading-relaxed text-justify font-normal" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                              Apabila sebuah kalimat dimulai dengan istifhām (kata tanya), maka kedudukannya dalam struktur nahwu adalah khobar muqaddam (keterangan yang didahulukan). Sedangkan kata setelahnya yang menjadi subjek berfungsi sebagai mubtada’ mu’akhkhar (subjek yang diakhirkan).
                            </p>

                            <div className="bg-amber-50/60 rounded-xl p-5 border border-amber-100 space-y-3">
                              <p className="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                                <span>📌 Penjelasan Singkat</span>
                              </p>
                              <ul className="space-y-2 text-[16px] md:text-[18px] text-slate-700 font-normal" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                                <li className="flex items-start gap-2">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <span>Istifhām di awal kalimat → berperan sebagai khobar muqaddam.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <span>Isim setelahnya → berperan sebagai mubtada’ mu’akhkhar.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <span>Pola ini menunjukkan bahwa dalam bahasa Arab, posisi kata tanya dapat memengaruhi susunan kalimat.</span>
                                </li>
                              </ul>
                            </div>

                            {/* Table 1: Khobar Muqaddam & Mubtada' Mu'akhkhar */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
                              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Tabel Analisis Kalimat Istifhām</span>
                              </div>
                              <div className="overflow-x-auto scrollbar-thin">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                  <thead>
                                    <tr className="bg-[#0d3b78] text-white text-[13px] font-black uppercase tracking-wider">
                                      <th className="px-4 py-3">Kalimat Istifhām</th>
                                      <th className="px-4 py-3">Khobar Muqaddam</th>
                                      <th className="px-4 py-3">Mubtada’ Mu’akhkhar</th>
                                      <th className="px-4 py-3">Arti (Indonesia)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {[
                                      {
                                        kalimat: "مَنْ أَنْتَ؟",
                                        khobar: "مَنْ (siapa)",
                                        mubtada: "أَنْتَ (kamu)",
                                        arti: "Siapa kamu?"
                                      },
                                      {
                                        kalimat: "مَا هَذَا؟",
                                        khobar: "مَا (apa)",
                                        mubtada: "هَذَا (ini)",
                                        arti: "Apa ini?"
                                      },
                                      {
                                        kalimat: "مِنْ أَيْنَ أَنْتَ؟",
                                        khobar: "أَيْنَ (di mana)",
                                        mubtada: "أَنْتَ (kamu)",
                                        arti: "Kamu berasal dari mana? / Dari mana asalmu?"
                                      },
                                      {
                                        kalimat: "كَيْفَ حَالُكَ؟",
                                        khobar: "كَيْفَ (bagaimana)",
                                        mubtada: "حَالُكَ (keadaanmu)",
                                        arti: "Bagaimana keadaanmu?"
                                      }
                                    ].map((row, rIdx) => (
                                      <tr 
                                        key={rIdx} 
                                        className="hover:bg-slate-50 transition duration-100 text-[17px] md:text-[19px] font-normal text-slate-700"
                                        style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                      >
                                        <td className="px-4 py-4.5">
                                          <span style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: '30px' }} className="text-slate-900 bg-slate-50 border border-slate-100 rounded px-2.5 py-1">
                                            {row.kalimat}
                                          </span>
                                        </td>
                                        <td className="px-4 py-4.5">
                                          <span style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: '28px' }} className="text-[#ef4444] font-normal">
                                            {row.khobar.split(' ')[0]}
                                          </span>
                                          <span className="text-[14px] text-slate-500 font-normal ml-1">{row.khobar.substring(row.khobar.indexOf(' '))}</span>
                                        </td>
                                        <td className="px-4 py-4.5">
                                          <span style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: '28px' }} className="text-[#0d3b78] font-normal">
                                            {row.mubtada.split(' ')[0]}
                                          </span>
                                          <span className="text-[14px] text-slate-500 font-normal ml-1">{row.mubtada.substring(row.mubtada.indexOf(' '))}</span>
                                        </td>
                                        <td className="px-4 py-4.5 text-slate-600 font-normal">{row.arti}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          {/* Card 2: Adawāt al-istifhām Tambahan */}
                          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                            <p className="text-[17px] md:text-[19px] text-slate-700 leading-relaxed text-justify font-normal" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                              • Adawāt al-istifhām adalah kata tanya dalam bahasa Arab yang digunakan untuk memperoleh informasi. Buku ajar biasanya hanya menampilkan bentuk dasar seperti مَنْ، مِنْ أَيْنَ، هَلْ، مَا، كَيْفَ. Namun, dalam komunikasi sehari-hari terdapat pula bentuk tambahan yang memperkaya variasi pertanyaan.
                            </p>

                            <h4 className="text-[18px] md:text-[20px] font-bold text-[#0d3b78]" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                              Adawāt al-Istifhām Tambahan:
                            </h4>

                            <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
                              <div className="overflow-x-auto scrollbar-thin">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                  <thead>
                                    <tr className="bg-[#0d3b78] text-white text-[13px] font-black uppercase tracking-wider">
                                      <th className="px-4 py-3 text-center w-36">Adawat</th>
                                      <th className="px-4 py-3">Makna</th>
                                      <th className="px-4 py-3">Fungsi Pertanyaan</th>
                                      <th className="px-4 py-3">Contoh Kalimat</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {[
                                      {
                                        adawat: "أَيْنَ",
                                        makna: "Di mana/mana",
                                        fungsi: "Menanyakan tempat ataupun sesuatu",
                                        contoh: "أَيْنَ الْمُدَرِّسُ؟\n(Di mana guru?)"
                                      },
                                      {
                                        adawat: "مَاذَا",
                                        makna: "Apa",
                                        fungsi: "Menanyakan suatu benda atau peristiwa",
                                        contoh: "مَاذَا فِي الْمَكْتَبَةِ ؟\n(Di dalam perpustakaan ada apa?)"
                                      },
                                      {
                                        adawat: "لِمَنْ",
                                        makna: "Milik siapa",
                                        fungsi: "Menanyakan kepemilikan",
                                        contoh: "لِمَنْ هَذَا الْكِتَابُ؟\n(Buku ini milik siapa?)"
                                      },
                                      {
                                        adawat: "إِلَى أَيْنَ",
                                        makna: "Ke mana",
                                        fungsi: "Menanyakan arah tujuan atau arah keberangkatan",
                                        contoh: "إِلَى أَيْنَ أَنْتَ؟\n(Kamu mau ke mana?)"
                                      }
                                    ].map((row, rIdx) => (
                                      <tr 
                                        key={rIdx} 
                                        className="hover:bg-slate-50 transition duration-100 text-[17px] md:text-[19px] font-normal text-slate-700"
                                        style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                                      >
                                        <td className="px-4 py-5 text-center">
                                          <span style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: '32px' }} className="text-red-600 bg-red-50/50 border border-red-100/50 rounded-lg px-3 py-1.5 font-normal">
                                            {row.adawat}
                                          </span>
                                        </td>
                                        <td className="px-4 py-5 font-bold text-amber-900">{row.makna}</td>
                                        <td className="px-4 py-5 text-slate-600 font-normal leading-relaxed">{row.fungsi}</td>
                                        <td className="px-4 py-5 font-normal leading-relaxed">
                                          <div className="flex flex-col gap-1">
                                            <span style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif", fontSize: '28px' }} className="font-normal text-slate-900">
                                              {row.contoh.split('\n')[0]}
                                            </span>
                                            <span className="text-[15px] text-slate-500 font-normal">
                                              {row.contoh.split('\n')[1]}
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation back and forth */}
                      <div className="flex items-center justify-between pt-4">
                        <button
                          onClick={() => setMateriStep('ice_breaking')}
                          className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs md:text-sm flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4 text-slate-500" />
                          Mainkan Ice Breaking Game
                        </button>
                        
                        <button
                          onClick={() => {
                            unlockStepForCurrentMateri('contoh');
                            setMateriStep('contoh');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs md:text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg transition cursor-pointer"
                        >
                          Saya Telah Mempelajari Kaidah, Lanjut ke Contoh Kalimat
                          <ArrowRight className="w-4 h-4 text-white" />
                        </button>
                      </div>

                    </motion.div>
                  )}

                  {/* ================= STAGE 3: LATIHAN SOAL (Menguji pemahaman terbimbing) ================= */}
                  {materiStep === 'latihan' && (
                    <motion.div
                      key="step-latihan"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8 pb-48"
                    >
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 space-y-3">
                        <span className="text-[11px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Langkah 3: Latihan Mandiri Terbimbing
                        </span>
                        <h3 className="text-base md:text-lg font-black text-emerald-950">Asah Kemampuan Linguistik Anda</h3>
                        <p 
                          className="text-[16px] md:text-[18px] text-emerald-900 leading-relaxed text-justify font-bold"
                          style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                        >
                          Jawablah pertanyaan-pertanyaan berikut berdasarkan analisis kaidah yang sudah Anda amati. Evaluasi terbimbing ini memberikan penjelasan jawaban secara instan demi tercapainya pembelajaran mendalam (deep learning).
                        </p>
                      </div>

                      {/* Dialogue text reading context for Chapter 1 */}
                      {BAHAS_MATERI.id === 1 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                          <span className="text-[11px] font-black text-[#0d3b78] uppercase tracking-widest flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-[#0d3b78]" />
                            Teks Bacaan Percakapan
                          </span>
                          <h4 className="text-[16px] font-extrabold text-slate-800" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                            Bacalah teks di bawah ini, kemudian pilih jawaban yang tepat!
                          </h4>
                          
                          <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-100 shadow-inner text-right space-y-4">
                            <p className="text-[26px] md:text-[34px] leading-relaxed text-slate-900 font-extrabold space-y-3" dir="rtl" style={{ fontFamily: "'Times New Roman', Times, serif", lineHeight: '4.5rem' }}>
                              <span className="text-blue-700 font-black">سَلْمَىْ:</span> صَبَاحُ الْخَيْرِ.<br/>
                              <span className="text-indigo-700 font-black">خَدِيْجَةُ:</span> صَبَاحُ النُّورِ.<br/>
                              <span className="text-blue-700 font-black">سَلْمَىْ:</span> كَيْفَ حَالُكِ يَا خَدِيجَةُ؟<br/>
                              <span className="text-indigo-700 font-black">خَدِيْجَةُ:</span> بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ. وَأَنْتِ؟<br/>
                              <span className="text-blue-700 font-black">سَلْمَىْ:</span> بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ.<br/>
                              <span className="text-indigo-700 font-black">خَدِيْجَةُ:</span> أَيْنَ فَصْلُكِ يَا سَلْمَى؟<br/>
                              <span className="text-blue-700 font-black">سَلْمَىْ:</span> فَصْلِيْ أَمَامَ الْمَسْجِدِ.<br/>
                              <span className="text-blue-700 font-black">سَلْمَىْ:</span> وَأَيْنَ فَصْلُكِ؟<br/>
                              <span className="text-indigo-700 font-black">خَدِيْجَةُ:</span> فَصْلِيْ وَرَاءَ الْبُسْتَانِ.<br/>
                              <span className="text-blue-700 font-black">سَلْمَى:</span> هَلْ فَصْلُكِ كَبِيْرٌ؟<br/>
                              <span className="text-indigo-700 font-black">خَدِيجَةُ:</span> نَعَمْ، فَصْلِيْ كَبِيْرٌ وَنَظِيْفٌ.<br/>
                              <span className="text-blue-700 font-black">سَلْمَى:</span> شُكْرًا.<br/>
                              <span className="text-indigo-700 font-black">خَدِيجَةُ:</span> عَفْوًا
                            </p>
                          </div>
                        </div>
                      )}

                      {BAHAS_MATERI.id !== 2 && (
                        <>
                          {/* Latihan Header & Timer */}
                      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="space-y-1 text-center sm:text-left">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest font-mono">
                            Lembar Latihan Mandiri
                          </span>
                          <h3 className="text-lg font-black text-slate-800">Uji Pemahaman Kaidah</h3>
                        </div>
                        
                        {!showLatihanResult && (
                          <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-2.5 rounded-xl shadow-sm animate-pulse">
                            <Clock className="w-5 h-5 text-rose-600" />
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider font-mono">Sisa Waktu Anda</span>
                              <div className="flex items-center gap-1.5 font-bold">
                                <span className="text-lg tracking-wider font-mono">
                                  {formatLatihanTime(latihanSecondsLeft)}
                                </span>
                                <span className="text-sm font-semibold opacity-80 font-serif">
                                  ({formatLatihanTimeArabic(latihanSecondsLeft)})
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Latihan List */}
                      <div className="space-y-6">
                        {BAHAS_MATERI.latihanList.map((lat, idx) => {
                          const isAnswered = latihanAnswers[lat.id] !== undefined;
                          const selectedOption = latihanAnswers[lat.id];
                          const isCorrect = selectedOption === lat.correctAnswer;

                          // Smart multi-part question parsing
                          const hasNewlines = lat.question.includes('\n');
                          let instructionText = "";
                          let qSinLine = "";
                          let qJimLine = "";

                          if (hasNewlines) {
                            const lines = lat.question.split('\n').map(l => l.trim()).filter(Boolean);
                            if (lines.length >= 3) {
                              instructionText = lines[0];
                              qSinLine = lines[1];
                              qJimLine = lines[2];
                            } else if (lines.length === 2) {
                              const l1 = lines[0];
                              const l2 = lines[1];
                              if (l2.includes('ج:') || l2.includes('ج :') || l2.includes('فَاطِمَةُ')) {
                                instructionText = "إِخْتَرِ الْإِجَابَةَ الصَّحِيحَةَ.";
                                qSinLine = l1;
                                qJimLine = l2;
                              } else if (l1.includes("أُنْظُرْ") || l1.includes("إِخْتَرِ") || l1.toLowerCase().includes("bacalah")) {
                                instructionText = l1;
                                qSinLine = l2;
                              } else {
                                qSinLine = l1 + "\n" + l2;
                                instructionText = "";
                              }
                            } else {
                              qSinLine = lines[0] || "";
                            }
                          } else {
                            qSinLine = lat.question;
                          }

                          // Only show instruction text on the very first question unless it's a specific question prompt like "أُنْظُرْ إِلَى الْصُّوْرَةِ!" or has image
                          if (idx > 0 && !instructionText.includes("أُنْظُرْ") && !lat.image) {
                            instructionText = "";
                          }

                          // Clean prefix numbering from qSinLine (e.g. "١)", "٢)", etc.) so it doesn't duplicate the Arabic index
                          if (qSinLine) {
                            qSinLine = qSinLine.replace(/^\s*\d+[\)\.]\s*/, '').replace(/^\s*[\u0660-\u0669]+[\)\.]\s*/, '');
                          }

                          // Helper to strip any "أ. ", "ب. ", "a. " prefixes from option texts
                          const cleanOptionText = (optText: string) => {
                            return optText.replace(/^[أبجدad]\.\s*/i, '');
                          };
                          
                          return (
                            <div 
                              key={lat.id}
                              className={`bg-white rounded-xl border p-5 md:p-6 shadow-sm transition duration-150 ${
                                showLatihanResult
                                  ? isCorrect 
                                    ? 'border-emerald-200 bg-emerald-50/10'
                                    : 'border-rose-200 bg-rose-50/10'
                                  : 'border-slate-200'
                              }`}
                            >
                              <div className="flex flex-row-reverse items-start gap-4 text-right" dir="rtl">
                                <span className={`w-10 h-10 rounded-full text-[20px] font-black flex items-center justify-center shrink-0 mt-0.5 border ${
                                  showLatihanResult
                                    ? isCorrect
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                      : 'bg-rose-50 border-rose-200 text-rose-800'
                                    : 'bg-blue-50 border-blue-100 text-[#0d3b78]'
                                }`} style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                  {toArabicNumber(idx + 1)}
                                </span>
                                <div className="space-y-4 w-full text-right" dir="rtl">
                                  
                                  {lat.id === 56 ? (
                                    <div className="space-y-4">
                                      {/* 1. Instruction (Petunjuk) */}
                                      <div className="text-right">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-100 text-[#0d3b78] rounded-full text-xs md:text-sm font-bold shadow-sm font-times" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                          Bacalah teks di bawah ini dengan cermat!
                                        </span>
                                      </div>

                                      {/* 2. Cohesive Arabic Reading Paragraph Card */}
                                      <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-6 md:p-8 text-center shadow-sm relative overflow-hidden my-4">
                                        <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-400" />
                                        <div className="absolute top-3 left-3 text-amber-500/15 font-black text-2xl font-serif select-none" dir="rtl">
                                          نَصُّ الْقِرَاءَةِ
                                        </div>
                                        <p 
                                          className="text-[25px] md:text-[28px] font-black text-slate-800 leading-[2.1] tracking-wide text-center font-arabic"
                                          style={{ 
                                            fontFamily: "'Traditional Arabic', 'Amiri', 'Noto Naskh Arabic', serif",
                                            direction: 'rtl'
                                          }}
                                        >
                                          أَنَا عَلِيٌّ. أَنَا تِلْمِيْذٌ جَدِيْدٌ فِي الْمَدْرَسَةِ الْمُتَوَسِّطَةِ الْإِسْلَامِيَّةِ نُورِ الإسْلاَمِ سِمَارَانْج. أَنَا مِنْ صُولُو. أَسْكُنُ مَعَ جَدِّيْ فِي سِمَارَانْج. هٰذَا خَالِدٌ، هُوَ صَدِيْقِيْ. هُوَ مِنْ سِمَارَانْج، هُوَ تِلْمِيْذٌ جَدِيْدٌ فِي هَذِهِ الْمَدْرَسَةِ.
                                        </p>
                                      </div>

                                      {/* 3. Beautiful Question Box (Sin) */}
                                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-right shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-1 h-full bg-[#0d3b78]" />
                                        <div className="flex flex-row-reverse items-start justify-between gap-4">
                                          <span className="bg-[#0d3b78] text-white font-black px-2.5 py-0.5 rounded-lg text-sm tracking-wide shadow-sm shrink-0 font-times" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                            السُّؤَالُ
                                          </span>
                                          <h4 
                                            className="text-[23px] md:text-[26px] font-extrabold text-slate-900 leading-relaxed text-right w-full font-arabic"
                                            style={{ fontFamily: "'Traditional Arabic', 'Amiri', 'Noto Naskh Arabic', serif" }}
                                          >
                                            عَلِيٌّ ........
                                          </h4>
                                        </div>
                                      </div>
                                    </div>
                                  ) : hasNewlines ? (
                                    <div className="space-y-3">
                                      {/* 1. Instruction (Petunjuk) */}
                                      {instructionText && (
                                        <div className="text-right">
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-100 text-sky-800 rounded-full text-xs md:text-sm font-bold shadow-sm">
                                            <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                                            {renderTextWithArabic(instructionText, "'Times New Roman', Times, serif", 1.1)}
                                          </span>
                                        </div>
                                      )}

                                      {/* 1.5 Image (Gambar Soal) */}
                                      {lat.image && (
                                        <div className="my-3 flex justify-center">
                                          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-2 shadow-md max-w-lg w-full transition-transform hover:scale-[1.01]">
                                            <img 
                                              src={lat.image} 
                                              alt="Gambar Soal" 
                                              className="w-full h-52 md:h-64 object-cover rounded-xl"
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {/* 2. Sin Box (س: Pertanyaan) */}
                                      {qSinLine && (
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-right shadow-sm relative overflow-hidden">
                                          <div className="absolute top-0 right-0 w-1 h-full bg-[#0d3b78]" />
                                          <div className="flex flex-row-reverse items-start justify-between gap-4">
                                            <span className="bg-[#0d3b78] text-white font-black px-2.5 py-0.5 rounded-lg text-sm tracking-wide shadow-sm shrink-0" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                              سـ
                                            </span>
                                            <h4 
                                              className="text-[22px] md:text-[25px] font-extrabold text-slate-900 leading-relaxed text-right w-full whitespace-pre-line"
                                              style={{ fontFamily: "'Times New Roman', Times, serif" }}
                                            >
                                              {renderTextWithArabic(qSinLine, "'Times New Roman', Times, serif", 1.35)}
                                            </h4>
                                          </div>
                                        </div>
                                      )}

                                      {/* 3. Jim Box (ج: Jawaban/Konteks) */}
                                      {qJimLine && (
                                        <div className="bg-amber-50/30 border border-amber-100/50 rounded-xl p-4 text-right shadow-sm relative overflow-hidden">
                                          <div className="absolute top-0 right-0 w-1 h-full bg-amber-500" />
                                          <div className="flex flex-row-reverse items-start justify-between gap-4">
                                            <span className="bg-amber-500 text-white font-black px-2.5 py-0.5 rounded-lg text-sm tracking-wide shadow-sm shrink-0" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                              جـ
                                            </span>
                                            <div 
                                              className="text-[22px] md:text-[25px] font-extrabold text-slate-800 leading-relaxed text-right w-full"
                                              style={{ fontFamily: "'Times New Roman', Times, serif" }}
                                            >
                                              {renderTextWithArabic(qJimLine, "'Times New Roman', Times, serif", 1.35)}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <h4 
                                      className="text-[22px] md:text-[25px] font-extrabold text-slate-900 leading-relaxed text-right"
                                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                                    >
                                      {renderTextWithArabic(lat.question, "'Times New Roman', Times, serif", 1.35)}
                                    </h4>
                                  )}

                                  {/* Radio Options Grid (أ, ب, ج, د) */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4" dir="rtl">
                                    {lat.options.map((opt, oIdx) => {
                                      const isThisOptionSelected = selectedOption === oIdx;
                                      const isCorrectOption = oIdx === lat.correctAnswer;
                                      let optionStyle = "";

                                      if (showLatihanResult) {
                                        if (isCorrectOption) {
                                          optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-black ring-4 ring-emerald-100 shadow-sm";
                                        } else if (isThisOptionSelected) {
                                          optionStyle = "border-rose-400 bg-rose-50 text-rose-950 font-black ring-4 ring-rose-100 shadow-sm";
                                        } else {
                                          optionStyle = "border-slate-100 bg-slate-50/50 text-slate-400 opacity-60";
                                        }
                                      } else {
                                        if (isThisOptionSelected) {
                                          if (oIdx === 0) optionStyle = "border-2 border-blue-500 bg-blue-100 text-blue-950 ring-4 ring-blue-100/70 shadow-md font-black scale-[1.02] transition-all duration-200";
                                          else if (oIdx === 1) optionStyle = "border-2 border-purple-500 bg-purple-100 text-purple-950 ring-4 ring-purple-100/70 shadow-md font-black scale-[1.02] transition-all duration-200";
                                          else if (oIdx === 2) optionStyle = "border-2 border-emerald-500 bg-emerald-100 text-emerald-950 ring-4 ring-emerald-100/70 shadow-md font-black scale-[1.02] transition-all duration-200";
                                          else optionStyle = "border-2 border-amber-500 bg-amber-100 text-amber-950 ring-4 ring-amber-100/70 shadow-md font-black scale-[1.02] transition-all duration-200";
                                        } else {
                                          if (oIdx === 0) optionStyle = "border border-blue-300 bg-blue-50/70 text-blue-950 hover:bg-blue-100 hover:border-blue-500 hover:shadow-md font-extrabold transition-all duration-200";
                                          else if (oIdx === 1) optionStyle = "border border-purple-300 bg-purple-50/70 text-purple-950 hover:bg-purple-100 hover:border-purple-500 hover:shadow-md font-extrabold transition-all duration-200";
                                          else if (oIdx === 2) optionStyle = "border border-emerald-300 bg-emerald-50/70 text-emerald-950 hover:bg-emerald-100 hover:border-emerald-500 hover:shadow-md font-extrabold transition-all duration-200";
                                          else optionStyle = "border border-amber-300 bg-amber-50/70 text-amber-950 hover:bg-amber-100 hover:border-amber-500 hover:shadow-md font-extrabold transition-all duration-200";
                                        }
                                      }

                                      const optionLetters = ['أ', 'ب', 'ج', 'د'];
                                      const optLetter = optionLetters[oIdx] || '';
                                      const cleanedOptText = cleanOptionText(opt);

                                      return (
                                        <button
                                          key={oIdx}
                                          type="button"
                                          disabled={showLatihanResult}
                                          onClick={() => handleLatihanSelect(lat.id, oIdx)}
                                          className={`w-full text-right p-4 rounded-xl text-[19px] md:text-[22px] font-bold border flex items-center justify-between gap-3 transition duration-150 ${
                                            !showLatihanResult ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'
                                          } ${optionStyle}`}
                                          style={{ fontFamily: "'Times New Roman', Times, serif" }}
                                          dir="rtl"
                                        >
                                          <div className="flex items-center gap-3">
                                            {/* Beautiful Option Letter Badge */}
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-base border shrink-0 ${
                                              isThisOptionSelected
                                                ? 'bg-white text-slate-900 border-white/50 shadow-sm'
                                                : oIdx === 0
                                                  ? 'bg-blue-100/80 border-blue-200 text-blue-800'
                                                  : oIdx === 1
                                                    ? 'bg-purple-100/80 border-purple-200 text-purple-800'
                                                    : oIdx === 2
                                                      ? 'bg-emerald-100/80 border-emerald-200 text-emerald-800'
                                                      : 'bg-amber-100/80 border-amber-200 text-amber-800'
                                            }`} style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                              {optLetter}
                                            </span>
                                            
                                            <span className="text-right text-slate-800 font-bold leading-relaxed">
                                              {renderTextWithArabic(cleanedOptText, "'Times New Roman', Times, serif", 1.25)}
                                            </span>
                                          </div>

                                          {showLatihanResult ? (
                                            <span className="shrink-0">
                                              {isCorrectOption && (
                                                <span className="bg-emerald-500 text-white rounded-full flex items-center justify-center w-6 h-6 text-xs font-black shadow-sm">
                                                  ✓
                                                </span>
                                              )}
                                              {!isCorrectOption && isThisOptionSelected && (
                                                <span className="bg-rose-500 text-white rounded-full flex items-center justify-center w-6 h-6 text-xs font-black shadow-sm">
                                                  ✗
                                                </span>
                                              )}
                                            </span>
                                          ) : (
                                            isThisOptionSelected && (
                                              <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0 shadow-sm" />
                                            )
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Explanation and Corrections Detail */}
                                  {showLatihanResult && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className={`mt-4 p-4 rounded-xl border text-left flex items-start gap-3 ${
                                        isCorrect 
                                          ? 'bg-emerald-50 border-emerald-100 text-emerald-950' 
                                          : 'bg-rose-50 border-rose-100 text-rose-950'
                                      }`}
                                      dir="ltr"
                                    >
                                      {isCorrect ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                      ) : (
                                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                      )}
                                      <div className="space-y-1">
                                        <p className="font-extrabold text-sm md:text-base">
                                          {isCorrect ? 'Jawaban Benar! (+10 Poin)' : 'Jawaban Kurang Tepat'}
                                        </p>
                                        <p className="text-xs md:text-sm font-medium text-slate-700 leading-relaxed">
                                          <strong>Penjelasan:</strong> {lat.explanation}
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Evaluation Bar action */}
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left space-y-1.5">
                          <h4 className="text-sm font-extrabold text-slate-800">Hasil Latihan Mandiri Anda</h4>
                          <p className="text-xs text-slate-600 font-semibold">Kirim hasil latihan Anda untuk melihat skor akhir dan ulasan detilnya.</p>
                        </div>

                        <div className="flex gap-2.5">
                          {showLatihanResult ? (
                            <button
                              onClick={resetLatihan}
                              className="px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold text-xs md:text-sm flex items-center gap-1.5 cursor-pointer transition"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Ulangi Latihan
                            </button>
                          ) : (
                            <button
                              onClick={() => handleKirimSemuaJawaban(false)}
                              className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm cursor-pointer transition shadow"
                            >
                              Kirim Semua Jawaban
                            </button>
                          )}
                        </div>
                      </div>

                      {showLatihanResult && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 180, damping: 20 }}
                          className="bg-gradient-to-tr from-[#0b2447] to-[#19376d] text-white p-8 rounded-2xl border border-indigo-950 text-center space-y-6 shadow-xl relative overflow-hidden"
                        >
                          {/* Ambient background glow */}
                          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                          <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />

                          <div className="space-y-1 relative z-10">
                            <span className="text-amber-400 font-extrabold text-[10px] uppercase tracking-widest font-mono bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                              Hasil Akhir Latihan
                            </span>
                            <h3 className="text-xl font-extrabold text-sky-100">Evaluasi Hasil Kerja Anda</h3>
                          </div>

                          {/* Animated SVG circular progress score indicator */}
                          <div className="relative flex items-center justify-center w-40 h-40 mx-auto z-10">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="80"
                                cy="80"
                                r="64"
                                className="text-white/10 stroke-current"
                                strokeWidth="10"
                                fill="transparent"
                              />
                              <motion.circle
                                cx="80"
                                cy="80"
                                r="64"
                                className="text-amber-400 stroke-current"
                                strokeWidth="10"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 64}
                                strokeDashoffset={2 * Math.PI * 64 - (animatedScore / 100) * (2 * Math.PI * 64)}
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 64 - (animatedScore / 100) * (2 * Math.PI * 64) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                              <span className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                {toArabicNumber(animatedScore)}
                              </span>
                              <span className="text-xs text-amber-300 font-bold tracking-wider font-mono mt-0.5">NILAI: {animatedScore}</span>
                            </div>
                          </div>

                          {/* Poin Benar details with Arabic and English numerals */}
                          <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-sm mx-auto space-y-2 relative z-10">
                            <p className="text-xs text-sky-200 font-extrabold uppercase tracking-wider font-mono">Statistik Jawaban</p>
                            <div className="flex items-center justify-around">
                              <div className="text-center">
                                <p className="text-lg font-black text-amber-400" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                  {toArabicNumber(getLatihanCorrectCount())} / {toArabicNumber(BAHAS_MATERI.latihanList.length)}
                                </p>
                                <p className="text-[10px] text-sky-100 font-bold">Benar (Arab)</p>
                              </div>
                              <div className="h-8 w-px bg-white/15" />
                              <div className="text-center">
                                <p className="text-lg font-black text-white">
                                  {getLatihanCorrectCount()} / {BAHAS_MATERI.latihanList.length}
                                </p>
                                <p className="text-[10px] text-sky-100 font-bold">Benar (Latin)</p>
                              </div>
                            </div>
                          </div>

                          {/* Mascot Feedback Section based on Score Tiers */}
                          <div className="relative z-10 pt-4 border-t border-white/10">
                            {animatedScore >= 90 ? (
                              <motion.div 
                                initial={{ scale: 0.3, y: 50, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="flex flex-col items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl max-w-md mx-auto"
                              >
                                <div className="relative">
                                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30 animate-pulse" />
                                  <motion.span 
                                    animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                    className="text-6xl block relative z-10 filter drop-shadow-md"
                                  >
                                    👍
                                  </motion.span>
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xl font-extrabold text-emerald-400 tracking-wide font-serif">MUMTAZ! (مُمْتَاز)</h4>
                                  <p className="text-sm font-extrabold text-sky-100 leading-relaxed">
                                    Good job! Sangat Luar Biasa! 🌟 Jawabanmu sempurna. Kamu telah menguasai kaidah ini dengan sangat matang!
                                  </p>
                                </div>
                              </motion.div>
                            ) : animatedScore >= 50 ? (
                              <motion.div 
                                initial={{ scale: 0.3, y: 50, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="flex flex-col items-center gap-3 bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl max-w-md mx-auto"
                              >
                                <div className="relative">
                                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse" />
                                  <motion.span 
                                    animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="text-6xl block relative z-10 filter drop-shadow-md"
                                  >
                                    😊
                                  </motion.span>
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xl font-extrabold text-blue-400 tracking-wide font-serif">JAYYID JIDDAN! (جَيِّد جِدًّا)</h4>
                                  <p className="text-sm font-extrabold text-sky-100 leading-relaxed">
                                    Hebat! Terus tingkatkan! 💪 Usaha yang sangat baik. Kamu sudah memahami materi dengan baik. Sedikit lagi menuju sempurna!
                                  </p>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div 
                                initial={{ scale: 0.3, y: 50, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="flex flex-col items-center gap-3 bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl max-w-md mx-auto"
                              >
                                <div className="relative">
                                  <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-20 animate-pulse" />
                                  <motion.span 
                                    animate={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                    className="text-6xl block relative z-10 filter drop-shadow-md"
                                  >
                                    📚
                                  </motion.span>
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xl font-extrabold text-amber-400 tracking-wide font-serif">LAA TAY'AS! (لَا تَيْأَسْ)</h4>
                                  <p className="text-sm font-extrabold text-sky-100 leading-relaxed">
                                    Tetap semangat belajar lagi! ⚡ Belajar adalah petualangan seru. Mari baca ulang penjelasan materinya dan coba lagi ya!
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {/* Navigation buttons for proceeding to next material */}
                          {BAHAS_MATERI.latihanList && BAHAS_MATERI.latihanList.length > 0 && (
                            <div className="pt-4 flex justify-center relative z-10">
                              <button
                                onClick={() => {
                                  const virtualIdx = getVirtualIndex(selectedChapter, selectedMateriIndex);
                                  let newCompleted = completedMateriIndices;
                                  if (!completedMateriIndices.includes(virtualIdx)) {
                                    newCompleted = [...completedMateriIndices, virtualIdx];
                                    setCompletedMateriIndices(newCompleted);
                                    try {
                                      localStorage.setItem(`completed_materi_${session.name}`, JSON.stringify(newCompleted));
                                    } catch (e) {
                                      console.error(e);
                                    }
                                  }
                                  if (session.name && session.peran === 'siswa') {
                                    saveStudentProgress(session.name, {
                                      peran: session.peran,
                                      kelas: session.kelas,
                                      gender: session.gender,
                                      completedMateriIndices: newCompleted
                                    });
                                  }

                                  const nextIdx = selectedMateriIndex + 1;
                                  if (selectedChapter === 1) {
                                    if (nextIdx < CURRENT_DAFTAR_MATERI.length) {
                                      setSelectedMateriIndex(nextIdx);
                                      setMateriStep('contoh');
                                      setLatihanAnswers({});
                                      setShowLatihanResult(false);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                      showToast(`Latihan selesai! Mari kita lanjut ke materi '${CURRENT_DAFTAR_MATERI[nextIdx]?.topik?.split(':')[0] || 'berikutnya'}' 🎉`, "success");
                                    } else {
                                      setSelectedChapter(2);
                                      setSelectedMateriIndex(0);
                                      setMateriStep('contoh');
                                      setLatihanAnswers({});
                                      setShowLatihanResult(false);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                      showToast("Selamat! Bab 1 telah selesai. Mari kita lanjut ke Bab 2: Isim Isyarah 🎓", "success");
                                    }
                                  } else {
                                    if (nextIdx < CURRENT_DAFTAR_MATERI.length) {
                                      setSelectedMateriIndex(nextIdx);
                                      setMateriStep('contoh');
                                      setLatihanAnswers({});
                                      setShowLatihanResult(false);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                      showToast("Latihan selesai! Mari kita lanjut ke materi berikutnya 🎉", "success");
                                    } else {
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                      showToast("Luar biasa! Anda telah menyelesaikan seluruh materi pembelajaran 🎉", "success");
                                    }
                                  }
                                }}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow hover:shadow-lg active:scale-95 animate-bounce shadow-emerald-500/20"
                              >
                                Selesaikan & Lanjut ke {selectedChapter === 1 && selectedMateriIndex === CURRENT_DAFTAR_MATERI.length - 1 ? "Bab Berikutnya" : "Materi Berikutnya"}
                                <ArrowRight className="w-4 h-4 text-white animate-pulse" />
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </>
                  )}

                      {/* Section Esai khusus untuk Bab 1, Materi 1 (Bahasa Satu: Al-Istifham) setelah Pilgan selesai */}
                      {BAHAS_MATERI.id === 1 && showLatihanResult && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, type: "spring" }}
                          className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-md mt-8"
                          id="essay-practice-section"
                        >
                          <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse shrink-0" />
                            <div>
                              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-100/60 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono border border-indigo-200">
                                Bagian Kedua: Lembar Esai Mandiri
                              </span>
                              <h3 className="text-lg md:text-xl font-black text-slate-800 mt-1">Ayo Berlatih Esai (أَيُّهَا الطَّالِبُ، لِنَبْدَأْ!)</h3>
                            </div>
                          </div>

                          {/* Hiwar Context */}
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-5 h-5 text-indigo-600" />
                              <h4 className="text-base md:text-lg font-black text-slate-800">Bacalah Percakapan Berikut Ini!</h4>
                            </div>
                            <p className="text-right text-lg md:text-xl font-extrabold text-indigo-700 font-arabic" dir="rtl">
                              إِقْرَأْ هَذَا الْحِوَارِ مَعَ زَمِيْلِكَ!!
                            </p>

                            <div className="bg-gradient-to-tr from-slate-50 to-indigo-50/30 p-5 md:p-8 rounded-2xl border border-indigo-100/80 shadow-inner text-right space-y-5">
                              <p className="text-[28px] md:text-[36px] leading-relaxed text-slate-950 font-extrabold space-y-5 font-arabic" dir="rtl" style={{ lineHeight: '5rem' }}>
                                <span className="text-blue-700 font-black">حَسَنُ :</span> مَرْحَبًا، اِسْمِيْ حَسَنُ. مَا اسْمُكَ يَا أَخِي؟<br/>
                                <span className="text-emerald-700 font-black">عَلِيٌّ:</span> اِسْمِيْ عَلِيٌّ.<br/>
                                <span className="text-blue-700 font-black">حَسَنُ :</span> هَلْ أَنْتَ تِلْمِيْذٌ جَدِيدٌ؟<br/>
                                <span className="text-emerald-700 font-black">عَلِيٌّ :</span> نَعَمْ، أَنَا تِلْمِيْذٌ جَدِيْدٌ.<br/>
                                <span className="text-blue-700 font-black">حَسَنُ :</span> مِنْ أَيْنَ أَنْتَ؟<br/>
                                <span className="text-emerald-700 font-black">عَلِيٌّ :</span> أَنَا مِنْ كُوْنجان، وَأَنْتَ؟<br/>
                                <span className="text-blue-700 font-black">حَسَنُ :</span> أَنَا مِنْ شِرْبون. مَا هِوَايَتُكَ؟<br/>
                                <span className="text-emerald-700 font-black">عَلِيٌّ :</span> هِوَايَتِيْ الْقِرَاءَةُ.<br/>
                                <span className="text-blue-700 font-black">حَسَنُ :</span> هِوَايَتِيْ الْقِرَاءَةُ أَيْضًا. هَيَّا بِنَا نَذْهَبْ إِلَى الْمَكْتَبَةِ فِيْ وَقْتِ الاِسْتِرَاحَةِ!<br/>
                                <span className="text-emerald-700 font-black">عَلِيٌّ :</span> هَيَّا بِنَا
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-right text-lg font-bold text-slate-700" dir="rtl">
                              أَجِبْ عَنِ الْأَسْئِلَةِ الآتِيَةِ وَقْفًا لِلحِوَارِ السَّابِقِ!
                            </p>
                            <p className="text-sm font-semibold text-slate-500">
                              Jawablah pertanyaan-pertanyaan berikut berdasarkan percakapan sebelumnya:
                            </p>
                          </div>

                          {/* Questions List */}
                          <div className="space-y-6">
                            {ESSAY_QUESTIONS.map((q, idx) => {
                              const evaluation = checkEssayCorrectness(q.id, essayAnswers[q.id]);
                              return (
                                <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4">
                                  <div className="flex flex-row-reverse justify-between items-start gap-4">
                                    <span className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-black flex items-center justify-center shrink-0" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                      {toArabicNumber(idx + 1)}
                                    </span>
                                    <div className="text-right w-full space-y-1" dir="rtl">
                                      <h5 className="text-[26px] md:text-[32px] font-black text-slate-900 leading-relaxed font-arabic" dir="rtl">
                                        {q.questionAr}
                                      </h5>
                                      <p className="text-xs md:text-sm font-semibold text-slate-500 text-left" dir="ltr">
                                        {q.questionId}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="block text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                                      Jawaban Anda (Tulis dalam Bahasa Indonesia / Arab):
                                    </label>
                                    <textarea
                                      disabled={showEssayResult}
                                      value={essayAnswers[q.id] || ''}
                                      onChange={(e) => setEssayAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                      placeholder="Ketik jawaban Anda di sini..."
                                      rows={2}
                                      className={`w-full border-2 rounded-2xl px-5 py-4 text-sm md:text-base font-extrabold transition-all duration-300 shadow-inner resize-none ${
                                        !showEssayResult
                                          ? 'bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border-indigo-100 hover:from-blue-100/50 hover:to-indigo-100/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                                          : evaluation === 'correct'
                                            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 focus:outline-none'
                                            : 'bg-amber-50/95 border-amber-300 text-amber-950 focus:outline-none'
                                      }`}
                                    />
                                  </div>

                                  {showEssayResult && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="bg-white border border-indigo-100 rounded-xl p-4 md:p-5 space-y-3 shadow-sm text-left"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                          Analisis Jawaban
                                        </span>
                                        
                                        {evaluation === 'correct' ? (
                                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                                            ✓ Sesuai Kaidah Teks
                                          </span>
                                        ) : (
                                          <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                                            ⚠ Perlu Dicek
                                          </span>
                                        )}
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-sm">
                                        <div className="space-y-1">
                                          <p className="text-xs font-bold text-slate-400">Jawaban Acuan (Bahasa Arab):</p>
                                          <p className="text-xl font-bold text-slate-800 text-right font-arabic" dir="rtl">
                                            {q.refAr}
                                          </p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-xs font-bold text-slate-400">Jawaban Acuan (Bahasa Indonesia):</p>
                                          <p className="font-bold text-slate-800">{q.refId}</p>
                                        </div>
                                      </div>

                                      <div className="bg-slate-50 rounded-lg p-3 text-xs md:text-sm font-medium text-slate-700 leading-relaxed border border-slate-100">
                                        <strong>Penjelasan Kunci:</strong> {q.explanation}
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Essay Action Buttons */}
                          <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-100">
                            {!showEssayResult ? (
                              <button
                                onClick={() => {
                                  const emptyAnswers = Object.keys(essayAnswers).filter(key => !essayAnswers[key].trim());
                                  if (emptyAnswers.length > 0) {
                                    showToast("Harap isi semua pertanyaan esai sebelum mengirim!", "error");
                                    return;
                                  }
                                  setShowEssayResult(true);
                                  showToast("Jawaban esai berhasil dikirim!", "success");
                                }}
                                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm md:text-base cursor-pointer transition shadow hover:shadow-lg flex items-center gap-2"
                              >
                                <Sparkles className="w-5 h-5 text-white" />
                                Kirim Semua Jawaban Esai
                              </button>
                            ) : (
                              <div className="text-center space-y-6 w-full">
                                {/* Score Indicator Animation */}
                                {(() => {
                                  const correctCount = Object.keys(essayAnswers).filter(key => checkEssayCorrectness(key, essayAnswers[key]) === 'correct').length;
                                  const score = Math.round((correctCount / ESSAY_QUESTIONS.length) * 100);
                                  const isPerfect = score === 100;
                                  const isGood = score >= 60;
                                  
                                  return (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ type: "spring", stiffness: 180, damping: 20 }}
                                      className="bg-gradient-to-tr from-[#0b1b3d] to-[#1e2a55] text-white p-8 rounded-3xl border border-indigo-950 text-center space-y-6 shadow-2xl relative overflow-hidden max-w-2xl mx-auto"
                                    >
                                      {/* Background ambient light */}
                                      <div className="absolute top-0 left-0 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                                      <div className="absolute bottom-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl" />

                                      <div className="space-y-1 relative z-10">
                                        <span className="text-indigo-300 font-black text-[10px] uppercase tracking-widest font-mono bg-indigo-400/20 border border-indigo-400/30 px-3 py-1 rounded-full">
                                          Hasil Kerja Esai Mandiri
                                        </span>
                                        <h3 className="text-xl font-extrabold text-indigo-50">Evaluasi Pemahaman Kosakata & Konteks</h3>
                                      </div>

                                      {/* Circle Progress Score */}
                                      <div className="relative flex items-center justify-center w-40 h-40 mx-auto z-10">
                                        <svg className="w-full h-full transform -rotate-90">
                                          <circle
                                            cx="80"
                                            cy="80"
                                            r="64"
                                            className="text-white/10 stroke-current"
                                            strokeWidth="10"
                                            fill="transparent"
                                          />
                                          <motion.circle
                                            cx="80"
                                            cy="80"
                                            r="64"
                                            className="text-indigo-400 stroke-current"
                                            strokeWidth="10"
                                            strokeDasharray="402"
                                            initial={{ strokeDashoffset: 402 }}
                                            animate={{ strokeDashoffset: 402 - (402 * score) / 100 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            fill="transparent"
                                          />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                          <motion.span 
                                            initial={{ scale: 0.5 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring" }}
                                            className="text-4xl font-black text-white"
                                          >
                                            {score}
                                          </motion.span>
                                          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">
                                            Skor Esai
                                          </span>
                                        </div>
                                      </div>

                                      {/* Mascot feedback card */}
                                      <motion.div 
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="bg-indigo-950/50 border border-indigo-900 p-5 rounded-2xl flex items-center gap-4 text-left z-10 relative"
                                      >
                                        <div className="w-16 h-16 rounded-full bg-indigo-600/30 flex items-center justify-center shrink-0 border border-indigo-500/30 text-3xl animate-bounce">
                                          {isPerfect ? '👑' : isGood ? '🌟' : '💪'}
                                        </div>
                                        <div className="space-y-1.5">
                                          <h4 className="text-base font-black text-indigo-300">
                                            {isPerfect ? 'MUMTAZ! (المُمْتَاز)' : isGood ? 'JAYYID JIDDAN! (جَيِّدٌ جِدًّا)' : 'LAA TAY\'AS! (لَا تَيْأَسْ)'}
                                          </h4>
                                          <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                                            {isPerfect 
                                              ? 'Jawaban esai Anda sungguh sempurna dan sesuai dengan kaidah teks percakapan! Pertahankan prestasi luar biasa ini!' 
                                              : isGood 
                                                ? 'Kerja keras yang luar biasa! Pemahaman Anda sangat baik, beberapa jawaban hampir sempurna. Teruskan belajar ya!'
                                                : 'Jangan menyerah! Tata bahasa membutuhkan pembiasaan. Silakan pelajari jawaban acuan dan penjelasan detail di atas.'}
                                          </p>
                                        </div>
                                      </motion.div>

                                      {/* Next material and Action Bar */}
                                      <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3 relative z-10">
                                        <button
                                          onClick={handleLanjutKeTataBahasaDua}
                                          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow hover:shadow-lg active:scale-95"
                                        >
                                          Lanjut ke Tata Bahasa Berikutnya
                                          <ArrowRight className="w-4 h-4 text-white animate-pulse" />
                                        </button>
                                        
                                        <button
                                          onClick={() => {
                                            setEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
                                            setShowEssayResult(false);
                                          }}
                                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-indigo-800 text-indigo-300 hover:bg-indigo-950/40 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                                        >
                                          <RefreshCw className="w-3.5 h-3.5" />
                                          Ulangi Esai
                                        </button>
                                      </div>
                                    </motion.div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Section Esai khusus untuk Bab 1, Materi 3 (Qoidah Tahiyyah) - Melengkapi Percakapan Dialog */}
                      {BAHAS_MATERI.id === 3 && showLatihanResult && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, type: "spring" }}
                          className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-md mt-8"
                          id="tahiyyah-essay-practice-section"
                        >
                          <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse shrink-0" />
                            <div>
                              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-100/60 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono border border-indigo-200">
                                Bagian Kedua: Melengkapi Dialog Percakapan
                              </span>
                              <h3 className="text-lg md:text-xl font-black text-slate-800 mt-1">Latihan Mandiri: Isilah percakapan rumpang!</h3>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-right text-lg font-bold text-slate-700 font-arabic" dir="rtl">
                              أَكْمِلِ الْحِوَارَ الْآتِيَ بِاخْتِيَارِ الْإِجَابَةِ الصَّحِيْحَةِ الْمُنَاسِبَةِ!
                            </p>
                            <p className="text-sm font-semibold text-slate-500">
                              Petunjuk: <span className="font-bold text-indigo-600">Isilah titik-titik kosong dengan jawaban yang tersedia.</span>
                            </p>
                          </div>

                          {/* Beautiful Answer Pool Grid */}
                          <div className="space-y-2">
                            <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">Pilihan Jawaban yang Tersedia:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100">
                              <div className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl p-3 text-center text-lg font-black text-blue-900 shadow-sm transition-all font-arabic" dir="rtl">
                                أ. بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ.
                              </div>
                              <div className="bg-white border-2 border-purple-200 hover:border-purple-400 rounded-xl p-3 text-center text-lg font-black text-purple-900 shadow-sm transition-all font-arabic" dir="rtl">
                                ب. وَأَنَا كَذٰلِكَ
                              </div>
                              <div className="bg-white border-2 border-emerald-200 hover:border-emerald-400 rounded-xl p-3 text-center text-lg font-black text-emerald-900 shadow-sm transition-all font-arabic" dir="rtl">
                                ت. صَبَاحُ النُّوْرِ
                              </div>
                              <div className="bg-white border-2 border-amber-200 hover:border-amber-400 rounded-xl p-3 text-center text-lg font-black text-amber-900 shadow-sm transition-all font-arabic" dir="rtl">
                                ث. أَهْلًا بِكَ
                              </div>
                              <div className="bg-white border-2 border-rose-200 hover:border-rose-400 rounded-xl p-3 text-center text-lg font-black text-rose-900 shadow-sm transition-all font-arabic" dir="rtl">
                                ج. مَعَ السَّلَامَةِ
                              </div>
                            </div>
                          </div>

                          {/* Chat Script Container */}
                          <div className="bg-slate-50 rounded-2xl p-5 md:p-8 border border-slate-100 shadow-inner space-y-6 max-h-[600px] overflow-y-auto">
                            
                            {/* Line 1: Ali */}
                            <div className="flex flex-row-reverse items-start gap-3" dir="rtl">
                              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                عَلِيٌّ
                              </div>
                              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 max-w-lg text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm font-arabic">
                                صَبَاحُ الْخَيْرِ.
                              </div>
                            </div>

                            {/* Line 2: Khalid */}
                            <div className="flex flex-row items-start gap-3" dir="ltr">
                              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                خَالِدٌ
                              </div>
                              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3.5 max-w-xl text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm text-right w-full font-arabic" dir="rtl">
                                <select
                                  disabled={showTahiyyahEssayResult}
                                  value={tahiyyahEssayAnswers['1'] || ''}
                                  onChange={(e) => setTahiyyahEssayAnswers(prev => ({ ...prev, '1': e.target.value }))}
                                  className={`inline-block mx-1 text-center font-black px-4 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer min-w-[220px] text-lg text-slate-800 ${
                                    showTahiyyahEssayResult
                                      ? checkTahiyyahEssayCorrectness('1', tahiyyahEssayAnswers['1'])
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                                        : 'border-rose-400 bg-rose-50 text-rose-950'
                                      : 'bg-white border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/20 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                                  }`}
                                >
                                  <option value="">-- Pilih Jawaban --</option>
                                  <option value="a">أ. بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ.</option>
                                  <option value="b">ب. وَأَنَا كَذٰلِكَ</option>
                                  <option value="t">ت. صَبَاحُ النُّوْرِ</option>
                                  <option value="th">ث. أَهْلًا بِكَ</option>
                                  <option value="j">ج. مَعَ السَّلَامَةِ</option>
                                </select>
                                {showTahiyyahEssayResult && (
                                  <span className="inline-block mr-3 align-middle text-sm font-bold">
                                    {checkTahiyyahEssayCorrectness('1', tahiyyahEssayAnswers['1']) ? (
                                      <span className="text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">✓ Benar</span>
                                    ) : (
                                      <span className="text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full border border-rose-200">✗ Salah ( ت )</span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Line 3: Ali */}
                            <div className="flex flex-row-reverse items-start gap-3" dir="rtl">
                              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                عَلِيٌّ
                              </div>
                              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 max-w-lg text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm font-arabic">
                                أَهْلًا وَسَهْلًا.
                              </div>
                            </div>

                            {/* Line 4: Khalid */}
                            <div className="flex flex-row items-start gap-3" dir="ltr">
                              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                خَالِدٌ
                              </div>
                              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3.5 max-w-xl text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm text-right w-full font-arabic" dir="rtl">
                                <select
                                  disabled={showTahiyyahEssayResult}
                                  value={tahiyyahEssayAnswers['2'] || ''}
                                  onChange={(e) => setTahiyyahEssayAnswers(prev => ({ ...prev, '2': e.target.value }))}
                                  className={`inline-block mx-1 text-center font-black px-4 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer min-w-[220px] text-lg text-slate-800 ${
                                    showTahiyyahEssayResult
                                      ? checkTahiyyahEssayCorrectness('2', tahiyyahEssayAnswers['2'])
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                                        : 'border-rose-400 bg-rose-50 text-rose-950'
                                      : 'bg-white border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/20 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                                  }`}
                                >
                                  <option value="">-- Pilih Jawaban --</option>
                                  <option value="a">أ. بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ.</option>
                                  <option value="b">ب. وَأَنَا كَذٰلِكَ</option>
                                  <option value="t">ت. صَبَاحُ النُّوْرِ</option>
                                  <option value="th">ث. أَهْلًا بِكَ</option>
                                  <option value="j">ج. مَعَ السَّلَامَةِ</option>
                                </select>
                                {showTahiyyahEssayResult && (
                                  <span className="inline-block mr-3 align-middle text-sm font-bold">
                                    {checkTahiyyahEssayCorrectness('2', tahiyyahEssayAnswers['2']) ? (
                                      <span className="text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">✓ Benar</span>
                                    ) : (
                                      <span className="text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full border border-rose-200">✗ Salah ( ث )</span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Line 5: Ali */}
                            <div className="flex flex-row-reverse items-start gap-3" dir="rtl">
                              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                عَلِيٌّ
                              </div>
                              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 max-w-lg text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm font-arabic">
                                اِسْمِيْ عَلِيٌّ، وَمَا اسْمُكَ؟
                              </div>
                            </div>

                            {/* Line 6: Khalid */}
                            <div className="flex flex-row items-start gap-3" dir="ltr">
                              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                خَالِدٌ
                              </div>
                              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3.5 max-w-lg text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm text-right font-arabic" dir="rtl">
                                اِسْمِيْ خَالِدٌ.
                              </div>
                            </div>

                            {/* Line 7: Ali */}
                            <div className="flex flex-row-reverse items-start gap-3" dir="rtl">
                              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                عَلِيٌّ
                              </div>
                              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 max-w-lg text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm font-arabic">
                                كَيْفَ حَالُكَ؟
                              </div>
                            </div>

                            {/* Line 8: Khalid */}
                            <div className="flex flex-row items-start gap-3" dir="ltr">
                              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                خَالِدٌ
                              </div>
                              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3.5 max-w-lg text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm text-right font-arabic" dir="rtl">
                                بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ. وَأَنْتَ؟
                              </div>
                            </div>

                            {/* Line 9: Ali */}
                            <div className="flex flex-row-reverse items-start gap-3" dir="rtl">
                              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                عَلِيٌّ
                              </div>
                              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 max-w-xl text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm text-right w-full font-arabic" dir="rtl">
                                <select
                                  disabled={showTahiyyahEssayResult}
                                  value={tahiyyahEssayAnswers['3'] || ''}
                                  onChange={(e) => setTahiyyahEssayAnswers(prev => ({ ...prev, '3': e.target.value }))}
                                  className={`inline-block mx-1 text-center font-black px-4 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer min-w-[220px] text-lg text-slate-800 ${
                                    showTahiyyahEssayResult
                                      ? checkTahiyyahEssayCorrectness('3', tahiyyahEssayAnswers['3'])
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                                        : 'border-rose-400 bg-rose-50 text-rose-950'
                                      : 'bg-white border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/20 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                                  }`}
                                >
                                  <option value="">-- Pilih Jawaban --</option>
                                  <option value="a">أ. بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ.</option>
                                  <option value="b">ب. وَأَنَا كَذٰلِكَ</option>
                                  <option value="t">ت. صَبَاحُ النُّوْرِ</option>
                                  <option value="th">ث. أَهْلًا بِكَ</option>
                                  <option value="j">ج. مَعَ السَّلَامَةِ</option>
                                </select>
                                {showTahiyyahEssayResult && (
                                  <span className="inline-block mr-3 align-middle text-sm font-bold">
                                    {checkTahiyyahEssayCorrectness('3', tahiyyahEssayAnswers['3']) ? (
                                      <span className="text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">✓ Benar</span>
                                    ) : (
                                      <span className="text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full border border-rose-200">✗ Salah ( أ )</span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Line 10: Khalid */}
                            <div className="flex flex-row items-start gap-3" dir="ltr">
                              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                خَالِدٌ
                              </div>
                              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3.5 max-w-lg text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm text-right font-arabic" dir="rtl">
                                مِنْ أَيْنَ أَنْتَ يَا عَلِيُّ؟
                              </div>
                            </div>

                            {/* Line 11: Ali */}
                            <div className="flex flex-row-reverse items-start gap-3" dir="rtl">
                              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                عَلِيٌّ
                              </div>
                              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 max-w-lg text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm font-arabic">
                                أَنَا مِنْ صُوْلُوْ، وَمِنْ أَيْنَ أَنْتَ؟
                              </div>
                            </div>

                            {/* Line 12: Khalid */}
                            <div className="flex flex-row items-start gap-3" dir="ltr">
                              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                خَالِدٌ
                              </div>
                              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3.5 max-w-lg text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm text-right font-arabic" dir="rtl">
                                أَنَا مِنْ فَاطِيْ.
                              </div>
                            </div>

                            {/* Line 13: Ali */}
                            <div className="flex flex-row-reverse items-start gap-3" dir="rtl">
                              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                عَلِيٌّ
                              </div>
                              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 max-w-lg text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm font-arabic">
                                أَنَا سَعِيْدٌ بِهَذَا اللِّقَاءِ.
                              </div>
                            </div>

                            {/* Line 14: Khalid */}
                            <div className="flex flex-row items-start gap-3" dir="ltr">
                              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                خَالِدٌ
                              </div>
                              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3.5 max-w-xl text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm text-right w-full font-arabic" dir="rtl">
                                <select
                                  disabled={showTahiyyahEssayResult}
                                  value={tahiyyahEssayAnswers['4'] || ''}
                                  onChange={(e) => setTahiyyahEssayAnswers(prev => ({ ...prev, '4': e.target.value }))}
                                  className={`inline-block mx-1 text-center font-black px-4 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer min-w-[220px] text-lg text-slate-800 ${
                                    showTahiyyahEssayResult
                                      ? checkTahiyyahEssayCorrectness('4', tahiyyahEssayAnswers['4'])
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                                        : 'border-rose-400 bg-rose-50 text-rose-950'
                                      : 'bg-white border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/20 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                                  }`}
                                >
                                  <option value="">-- Pilih Jawaban --</option>
                                  <option value="a">أ. بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ.</option>
                                  <option value="b">ب. وَأَنَا كَذٰلِكَ</option>
                                  <option value="t">ت. صَبَاحُ النُّوْرِ</option>
                                  <option value="th">ث. أَهْلًا بِكَ</option>
                                  <option value="j">ج. مَعَ السَّلَامَةِ</option>
                                </select>
                                {showTahiyyahEssayResult && (
                                  <span className="inline-block mr-3 align-middle text-sm font-bold">
                                    {checkTahiyyahEssayCorrectness('4', tahiyyahEssayAnswers['4']) ? (
                                      <span className="text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">✓ Benar</span>
                                    ) : (
                                      <span className="text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full border border-rose-200">✗ Salah ( ب )</span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Line 15: Ali */}
                            <div className="flex flex-row-reverse items-start gap-3" dir="rtl">
                              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                عَلِيٌّ
                              </div>
                              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 max-w-lg text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm font-arabic">
                                إِلَى اللِّقَاءِ يَا خَالِدُ.
                              </div>
                            </div>

                            {/* Line 16: Khalid */}
                            <div className="flex flex-row items-start gap-3" dir="ltr">
                              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 text-xs shadow-md">
                                خَالِدٌ
                              </div>
                              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3.5 max-w-xl text-[22px] md:text-[25px] font-extrabold text-slate-900 shadow-sm text-right w-full font-arabic" dir="rtl">
                                <select
                                  disabled={showTahiyyahEssayResult}
                                  value={tahiyyahEssayAnswers['5'] || ''}
                                  onChange={(e) => setTahiyyahEssayAnswers(prev => ({ ...prev, '5': e.target.value }))}
                                  className={`inline-block mx-1 text-center font-black px-4 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer min-w-[220px] text-lg text-slate-800 ${
                                    showTahiyyahEssayResult
                                      ? checkTahiyyahEssayCorrectness('5', tahiyyahEssayAnswers['5'])
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                                        : 'border-rose-400 bg-rose-50 text-rose-950'
                                      : 'bg-white border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/20 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                                  }`}
                                >
                                  <option value="">-- Pilih Jawaban --</option>
                                  <option value="a">أ. بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ.</option>
                                  <option value="b">ب. وَأَنَا كَذٰلِكَ</option>
                                  <option value="t">ت. صَبَاحُ النُّوْرِ</option>
                                  <option value="th">ث. أَهْلًا بِكَ</option>
                                  <option value="j">ج. مَعَ السَّلَامَةِ</option>
                                </select>
                                {showTahiyyahEssayResult && (
                                  <span className="inline-block mr-3 align-middle text-sm font-bold">
                                    {checkTahiyyahEssayCorrectness('5', tahiyyahEssayAnswers['5']) ? (
                                      <span className="text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">✓ Benar</span>
                                    ) : (
                                      <span className="text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full border border-rose-200">✗ Salah ( ج )</span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-100">
                            {!showTahiyyahEssayResult ? (
                              <button
                                onClick={() => {
                                  const emptyAnswers = Object.keys(tahiyyahEssayAnswers).filter(key => !tahiyyahEssayAnswers[key]);
                                  if (emptyAnswers.length > 0) {
                                    showToast("Harap lengkapi semua titik-titik kosong pada percakapan sebelum mengirim!", "error");
                                    return;
                                  }
                                  setShowTahiyyahEssayResult(true);
                                  if (session.name && session.peran === 'siswa') {
                                    saveStudentProgress(session.name, {
                                      tahiyyahEssayAnswers,
                                      showTahiyyahEssayResult: true
                                    });
                                  }
                                  showToast("Latihan melengkapi dialog berhasil dikirim!", "success");
                                  setTimeout(() => {
                                    const resultSec = document.getElementById('tahiyyah-essay-result-card');
                                    if (resultSec) {
                                      resultSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                  }, 300);
                                }}
                                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm md:text-base cursor-pointer transition shadow hover:shadow-lg flex items-center gap-2"
                              >
                                <Sparkles className="w-5 h-5 text-white" />
                                Kirim Hasil Lengkap Dialog
                              </button>
                            ) : (
                              <div className="text-center space-y-6 w-full">
                                {(() => {
                                  const correctCount = Object.keys(tahiyyahEssayAnswers).filter(key => checkTahiyyahEssayCorrectness(key, tahiyyahEssayAnswers[key])).length;
                                  const isPerfect = correctCount === 5;
                                  const isGood = correctCount >= 3;
                                  
                                  return (
                                    <motion.div 
                                      id="tahiyyah-essay-result-card"
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ type: "spring", stiffness: 180, damping: 20 }}
                                      className="bg-gradient-to-tr from-[#0b1b3d] to-[#1e2a55] text-white p-8 rounded-3xl border border-indigo-950 text-center space-y-6 shadow-2xl relative overflow-hidden max-w-2xl mx-auto"
                                    >
                                      <div className="absolute top-0 left-0 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                                      <div className="absolute bottom-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl" />
 
                                      <div className="space-y-1 relative z-10">
                                        <span className="text-indigo-300 font-black text-[10px] uppercase tracking-widest font-mono bg-indigo-400/20 border border-indigo-400/30 px-3 py-1 rounded-full">
                                          Hasil Kerja Dialog Mandiri
                                        </span>
                                        <h3 className="text-xl font-extrabold text-indigo-50">Evaluasi Pemahaman Struktur Dialog</h3>
                                      </div>
 
                                      <div className="relative flex items-center justify-center w-40 h-40 mx-auto z-10">
                                        <svg className="w-full h-full transform -rotate-90">
                                          <circle
                                            cx="80"
                                            cy="80"
                                            r="64"
                                            className="text-white/10 stroke-current"
                                            strokeWidth="10"
                                            fill="transparent"
                                          />
                                          <motion.circle
                                            cx="80"
                                            cy="80"
                                            r="64"
                                            className="text-indigo-400 stroke-current"
                                            strokeWidth="10"
                                            strokeDasharray={2 * Math.PI * 64}
                                            strokeLinecap="round"
                                            initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 64 - (tahiyyahEssayAnimatedScore / 100) * (2 * Math.PI * 64) }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            fill="transparent"
                                          />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                          <span className="text-4xl md:text-5xl font-black text-white tracking-tight animate-pulse" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                            {toArabicNumber(tahiyyahEssayAnimatedScore)}
                                          </span>
                                          <span className="text-xs text-indigo-300 font-bold tracking-wider font-mono mt-0.5">NILAI: {tahiyyahEssayAnimatedScore}</span>
                                        </div>
                                      </div>
 
                                      {/* Mascot feedback card with pop-in animation */}
                                      <motion.div 
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="bg-indigo-950/50 border border-indigo-900 p-5 rounded-2xl flex items-center gap-4 text-left z-10 relative"
                                      >
                                        <div className="w-16 h-16 rounded-full bg-indigo-600/30 flex items-center justify-center shrink-0 border border-indigo-500/30 text-3xl animate-bounce">
                                          {isPerfect ? '👑' : isGood ? '🌟' : '💪'}
                                        </div>
                                        <div className="space-y-1.5">
                                          <h4 className="text-base font-black text-indigo-300">
                                            {isPerfect ? 'MUMTAZ! (المُمْتَاز)' : isGood ? 'JAYYID JIDDAN! (جَيِّدٌ جِدًّا)' : 'LAA TAY\'AS! (لَا تَيْأَسْ)'}
                                          </h4>
                                          <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                                            {isPerfect 
                                              ? 'Luar biasa! Seluruh dialog percakapan sapaan (Qoidah Tahiyyah) telah Anda lengkapi dengan sempurna sesuai konteks bahasa Arab!' 
                                              : isGood 
                                                ? 'Bagus sekali! Pemahaman Anda tentang sapaan dan balasan (Tahiyyah) sangat kuat. Teruskan belajar ya!'
                                                : 'Jangan berkecil hati! Pelajari kembali hubungan sapaan dan jawabannya pada materi di atas dan ulangi latihan ini.'}
                                          </p>
                                        </div>
                                      </motion.div>
 
                                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-xs mx-auto flex items-center justify-around relative z-10">
                                        <div className="text-center">
                                          <span className="text-lg font-black text-amber-400" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                            {toArabicNumber(correctCount)} / {toArabicNumber(5)}
                                          </span>
                                          <p className="text-[10px] text-indigo-200 font-bold">Benar (Arab)</p>
                                        </div>
                                        <div className="h-8 w-px bg-white/15" />
                                        <div className="text-center">
                                          <span className="text-lg font-black text-white">
                                            {correctCount} / {5}
                                          </span>
                                          <p className="text-[10px] text-indigo-200 font-bold">Benar (Latin)</p>
                                        </div>
                                      </div>
 
                                      <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3 relative z-10">
                                        <button
                                          onClick={() => {
                                            const virtualIdx = getVirtualIndex(selectedChapter, selectedMateriIndex);
                                            let newCompleted = completedMateriIndices;
                                            if (!completedMateriIndices.includes(virtualIdx)) {
                                              newCompleted = [...completedMateriIndices, virtualIdx];
                                              setCompletedMateriIndices(newCompleted);
                                              try {
                                                localStorage.setItem(`completed_materi_${session.name}`, JSON.stringify(newCompleted));
                                              } catch (e) {
                                                console.error(e);
                                              }
                                            }
                                            if (session.name && session.peran === 'siswa') {
                                              saveStudentProgress(session.name, {
                                                peran: session.peran,
                                                kelas: session.kelas,
                                                gender: session.gender,
                                                completedMateriIndices: newCompleted
                                              });
                                            }
                                            
                                            // Directly navigate to next material (index 3)
                                            setSelectedMateriIndex(3);
                                            setMateriStep('contoh');
                                            setLatihanAnswers({});
                                            setShowLatihanResult(false);
                                            setTahiyyahEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
                                            setShowTahiyyahEssayResult(false);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            showToast("Latihan selesai! Mari kita lanjut ke materi 'Kata Ganti Personal Tunggal' 🎉", "success");
                                          }}
                                          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow hover:shadow-lg active:scale-95 animate-bounce shadow-emerald-500/20"
                                        >
                                          Selesaikan & Lanjut ke Materi Berikutnya
                                          <ArrowRight className="w-4 h-4 text-white animate-pulse" />
                                        </button>
                                        
                                        <button
                                          onClick={() => {
                                            setTahiyyahEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
                                            setShowTahiyyahEssayResult(false);
                                          }}
                                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-indigo-800 text-indigo-300 hover:bg-indigo-950/40 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                                        >
                                          <RefreshCw className="w-3.5 h-3.5" />
                                          Ulangi Latihan Dialog
                                        </button>
                                      </div>
                                    </motion.div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Section Esai khusus untuk Bab 1, Materi 4 (Tata Bahasa Tiga) - Menyusun Kata Acak */}
                      {BAHAS_MATERI.id === 4 && showLatihanResult && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, type: "spring" }}
                          className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-md mt-8"
                          id="personal-dhamir-essay-practice-section"
                        >
                          <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse shrink-0" />
                            <div>
                              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-100/60 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono border border-indigo-200">
                                Bagian Kedua: Menyusun Kata Acak
                              </span>
                              <h3 className="text-lg md:text-xl font-black text-slate-800 mt-1">Latihan Esai: رَتِّبِ اللَّفْظَ الآتِيَّ!</h3>
                            </div>
                          </div>

                          {/* Essay instructions */}
                          <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-5 space-y-2">
                            <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
                              <BookOpen className="w-4 h-4" />
                              Petunjuk Pengerjaan:
                            </h4>
                            <p className="text-xs md:text-sm text-amber-700 leading-relaxed font-medium">
                              Susunlah kata-kata acak di bawah ini menjadi kalimat yang sempurna (mufidah) menggunakan bahasa Arab lengkap dengan harakat/tanda baca yang tepat sesuai materi yang telah dipelajari!
                            </p>
                          </div>

                          {/* Essay Form Questions */}
                          <div className="space-y-6">
                            {[
                              {
                                id: '1',
                                scrambled: 'طَبِيْبٌ – أَنَا – جَدِيْدٌ – فِيْ – الْمُسْتَشْفَى–هٰذَا',
                                refAr: 'أَنَا طَبِيبٌ جَدِيدٌ فِي هٰذَا الْمُسْتَشْفَى.',
                                explanation: 'Susunan kata yang benar: Subjek kata ganti "أَنَا" diikuti predikat "طَبِيْبٌ جَدِيْدٌ" dan keterangan tempat "فِيْ هٰذَا الْمُسْتَشْفَى".'
                              },
                              {
                                id: '2',
                                scrambled: 'هُوَ – جُنْدِيٌّ – عَلِيٌّ – هٰذَا',
                                refAr: 'هٰذَا عَلِيٌّ، هُوَ جُنْدِيٌّ.',
                                explanation: 'Susunan kata yang benar: Kata tunjuk "هٰذَا" diikuti nama "عَلِيٌّ", lalu kata ganti "هُوَ" diikuti profesi "جُنْدِيٌّ".'
                              },
                              {
                                id: '3',
                                scrambled: 'هِيَ – مُدَرِّسَةٌ – فَاطِمَةُ – هٰذِهِ',
                                refAr: 'هٰذِهِ فَاطِمَةُ. هِيَ مُدَرِّسَةٌ.',
                                explanation: 'Susunan kata yang benar: Kata tunjuk mu\'annats "هٰذِهِ" diikuti nama "فَاطِمَةُ", lalu kata ganti "هِيَ" diikuti profesi "مُدَرِّسَةٌ".'
                              },
                              {
                                id: '4',
                                scrambled: 'فِي – الدَّرْسِ – اللُّغَةَ – الْعَرَبِيَّةَ – أَنْتَ – غُرْفَةِ – تَدْرُسُ',
                                refAr: 'أَنْتَ تَدْرُسُ اللُّغَةَ الْعَرَبِيَّةَ فِي غُرْفَةِ الدَّرْسِ.',
                                explanation: 'Susunan kata yang benar: Subjek "أَنْتَ" diikuti kata kerja "تَدْرُسُ" objek "اللُّغَةَ الْعَرَبِيَّةَ" lalu keterangan tempat "فِيْ غُرْفَةِ الدَّرْسِ".'
                              },
                              {
                                id: '5',
                                scrambled: 'يَسْكُنُ – هُوَ - الْقَرْيَةِ  - فِي',
                                refAr: 'هُوَ يَسْكُنُ فِي الْقَرْيَةِ.',
                                explanation: 'Susunan kata yang benar: Subjek "هُوَ" diikuti kata kerja "يَسْكُنُ" lalu keterangan tempat "فِيْ الْقَرْيَةِ".'
                              }
                            ].map((q) => {
                              const isCorrect = checkPersonalDhamirEssayCorrectness(q.id, personalDhamirEssayAnswers[q.id]);
                              return (
                                <div key={q.id} className="p-5 md:p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-black text-sm">
                                      {toArabicNumber(parseInt(q.id))}
                                    </span>
                                    <div className="text-right w-full" dir="rtl">
                                      <span className="text-xs text-indigo-600 bg-indigo-50 font-bold px-2.5 py-1 rounded-full border border-indigo-100 font-sans">
                                        Susun Kata Acak:
                                      </span>
                                      <div 
                                        className="text-2xl md:text-3xl font-black text-slate-800 leading-relaxed tracking-wide font-arabic mt-2"
                                        style={{ fontFamily: "'Traditional Arabic', 'Amiri', 'Noto Naskh Arabic', serif" }}
                                      >
                                        {q.scrambled}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Answer Input */}
                                  <div className="space-y-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">
                                      Jawaban Anda (Tulis dalam Bahasa Arab):
                                    </label>
                                    <input
                                      type="text"
                                      dir="rtl"
                                      disabled={showPersonalDhamirEssayResult}
                                      value={personalDhamirEssayAnswers[q.id] || ''}
                                      onChange={(e) => setPersonalDhamirEssayAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                      placeholder="الْجَوَابُ : .................................................."
                                      className={`w-full px-5 py-4 rounded-xl text-right text-xl font-bold bg-white border font-arabic transition focus:outline-none focus:ring-4 ${
                                        showPersonalDhamirEssayResult
                                          ? isCorrect
                                            ? 'border-emerald-300 bg-emerald-50/10 focus:ring-emerald-100'
                                            : 'border-amber-300 bg-amber-50/10 focus:ring-amber-100'
                                          : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                                      }`}
                                      style={{ fontFamily: "'Traditional Arabic', 'Amiri', 'Noto Naskh Arabic', serif" }}
                                    />
                                  </div>

                                  {/* Result & Evaluation */}
                                  {showPersonalDhamirEssayResult && (
                                    <motion.div 
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      className="bg-white border border-slate-100 rounded-xl p-4 space-y-3 shadow-inner"
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        {isCorrect ? (
                                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                                            ✓ Tepat & Sesuai Kaidah
                                          </span>
                                        ) : (
                                          <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                                            ⚠ Perlu Diperiksa Kembali
                                          </span>
                                        )}
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-sm">
                                        <div className="space-y-1">
                                          <p className="text-xs font-bold text-slate-400">Jawaban Acuan:</p>
                                          <p className="text-2xl font-bold text-slate-800 text-right font-arabic leading-relaxed" dir="rtl" style={{ fontFamily: "'Traditional Arabic', 'Amiri', 'Noto Naskh Arabic', serif" }}>
                                            {q.refAr}
                                          </p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-xs font-bold text-slate-400">Penjelasan Struktur:</p>
                                          <p className="font-semibold text-slate-700 text-xs md:text-sm">{q.explanation}</p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Essay Submit Button / Score Board */}
                          <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-100">
                            {!showPersonalDhamirEssayResult ? (
                              <button
                                onClick={() => {
                                  const emptyAnswers = Object.keys(personalDhamirEssayAnswers).filter(key => !personalDhamirEssayAnswers[key].trim());
                                  if (emptyAnswers.length > 0) {
                                    showToast("Harap isi semua jawaban susunan kata acak sebelum mengirim!", "error");
                                    return;
                                  }
                                  const correctCount = Object.keys(personalDhamirEssayAnswers).filter(key => checkPersonalDhamirEssayCorrectness(key, personalDhamirEssayAnswers[key])).length;
                                  const scoreVal = Math.round((correctCount / 5) * 100);

                                  const newRecord: StudentScore = {
                                    name: session.name || (session.gender === 'laki-laki' ? 'Ahmad Mulya' : 'Siti Aisyah'),
                                    role: session.peran === 'siswa' ? 'Siswa' : session.peran === 'guru' ? 'Guru' : 'Admin',
                                    class: session.peran === 'siswa' ? `Kelas ${session.kelas}` : 'Staf Pendidik',
                                    score: scoreVal,
                                    date: new Date().toISOString().split('T')[0],
                                    status: scoreVal >= 75 ? 'Lulus' : 'Remedial'
                                  };

                                  setLocalScores(prev => [newRecord, ...prev]);
                                  saveStudentScore(newRecord);

                                  setShowPersonalDhamirEssayResult(true);
                                  if (session.name && session.peran === 'siswa') {
                                    saveStudentProgress(session.name, {
                                      personalDhamirEssayAnswers,
                                      showPersonalDhamirEssayResult: true
                                    });
                                  }
                                  showToast("Jawaban susunan kata berhasil dikirim!", "success");
                                }}
                                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm md:text-base cursor-pointer transition shadow hover:shadow-lg flex items-center gap-2"
                              >
                                <Sparkles className="w-5 h-5 text-white" />
                                Kirim Semua Jawaban Esai
                              </button>
                            ) : (
                              <div className="text-center space-y-6 w-full">
                                {(() => {
                                  const correctCount = Object.keys(personalDhamirEssayAnswers).filter(key => checkPersonalDhamirEssayCorrectness(key, personalDhamirEssayAnswers[key])).length;
                                  const score = Math.round((correctCount / 5) * 100);
                                  const isPerfect = score === 100;
                                  const isGood = score >= 60;

                                  return (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ type: "spring", stiffness: 180, damping: 20 }}
                                      className="bg-gradient-to-tr from-[#0b1b3d] to-[#1e2a55] text-white p-8 rounded-3xl border border-indigo-950 text-center space-y-6 shadow-2xl relative overflow-hidden max-w-2xl mx-auto"
                                    >
                                      {/* Background ambient light */}
                                      <div className="absolute top-0 left-0 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                                      <div className="absolute bottom-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl" />

                                      <div className="space-y-1 relative z-10">
                                        <span className="text-indigo-300 font-black text-[10px] uppercase tracking-widest font-mono bg-indigo-400/20 border border-indigo-400/30 px-3 py-1 rounded-full">
                                          Hasil Kerja Menyusun Kata Acak
                                        </span>
                                        <h3 className="text-xl font-extrabold text-indigo-50">Evaluasi Susunan Kalimat Mufidah</h3>
                                      </div>

                                      {/* Circle Progress Score */}
                                      <div className="relative flex items-center justify-center w-40 h-40 mx-auto z-10">
                                        <svg className="w-full h-full transform -rotate-90">
                                          <circle
                                            cx="80"
                                            cy="80"
                                            r="64"
                                            className="text-white/10 stroke-current"
                                            strokeWidth="10"
                                            fill="transparent"
                                          />
                                          <motion.circle
                                            cx="80"
                                            cy="80"
                                            r="64"
                                            className="text-indigo-400 stroke-current"
                                            strokeWidth="10"
                                            strokeDasharray="402"
                                            initial={{ strokeDashoffset: 402 }}
                                            animate={{ strokeDashoffset: 402 - (402 * personalDhamirEssayAnimatedScore) / 100 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            fill="transparent"
                                          />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                          <span className="text-4xl md:text-5xl font-black text-white tracking-tight animate-pulse" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{toArabicNumber(personalDhamirEssayAnimatedScore)}</span>
                                          <span className="text-xs text-indigo-300 font-bold tracking-wider font-mono mt-0.5">NILAI: {personalDhamirEssayAnimatedScore}</span>
                                        </div>
                                      </div>

                                      {/* feedback comment */}
                                      <div className="space-y-1.5 max-w-md mx-auto relative z-10">
                                        <p className="text-lg font-black text-indigo-200">
                                          {isPerfect ? "مُمْتَاز! (Mumtaz - Sempurna!)" : isGood ? "جَيِّد جِدًّا! (Jayyid Jiddan - Sangat Hebat!)" : "لَا تَيْأَسْ! (Laa Tay'as - Jangan Menyerah!)"}
                                        </p>
                                        <p className="text-xs text-indigo-200/80 leading-relaxed font-semibold">
                                          {isPerfect 
                                            ? "Luar biasa! Seluruh susunan kalimat Anda sempurna tanpa cela. Anda benar-benar menguasai materi Tata Bahasa Tiga!" 
                                            : isGood 
                                            ? "Sangat bagus! Mayoritas susunan kata Anda sudah tepat sesuai struktur tata bahasa Arab yang benar. Tingkatkan terus!" 
                                            : "Masih ada susunan kata yang kurang pas. Jangan berkecil hati, pelajari kembali kaidahnya lalu coba ulangi latihan ya!"
                                          }
                                        </p>
                                      </div>

                                      {/* Navigation Action Buttons */}
                                      <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3 relative z-10">
                                        <button
                                          onClick={() => {
                                            const virtualIdx = getVirtualIndex(selectedChapter, selectedMateriIndex);
                                            let newCompleted = completedMateriIndices;
                                            if (!completedMateriIndices.includes(virtualIdx)) {
                                              newCompleted = [...completedMateriIndices, virtualIdx];
                                              setCompletedMateriIndices(newCompleted);
                                              try {
                                                localStorage.setItem(`completed_materi_${session.name}`, JSON.stringify(newCompleted));
                                              } catch (e) {
                                                console.error(e);
                                              }
                                            }
                                            if (session.name && session.peran === 'siswa') {
                                              saveStudentProgress(session.name, {
                                                peran: session.peran,
                                                kelas: session.kelas,
                                                gender: session.gender,
                                                completedMateriIndices: newCompleted
                                              });
                                            }

                                            // Navigate to Chapter 2 (Darsul Tsani) - Topic 1 (Tata Bahasa Satu: Isim Isyaroh)
                                            setSelectedChapter(2);
                                            setSelectedMateriIndex(0);
                                            setMateriStep('contoh');
                                            setLatihanAnswers({});
                                            setShowLatihanResult(false);
                                            setPersonalDhamirEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
                                            setShowPersonalDhamirEssayResult(false);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            showToast("Selamat! Bab 1 telah selesai. Mari kita lanjut ke Bab 2: Isim Isyarah 🎓", "success");
                                          }}
                                          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow hover:shadow-lg active:scale-95 animate-bounce shadow-emerald-500/20"
                                        >
                                          Selesaikan & Lanjut ke Bab Berikutnya (Darsul Tsani)
                                          <ArrowRight className="w-4 h-4 text-white animate-pulse" />
                                        </button>

                                        <button
                                          onClick={() => {
                                            setPersonalDhamirEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
                                            setShowPersonalDhamirEssayResult(false);
                                          }}
                                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-indigo-800 text-indigo-300 hover:bg-indigo-950/40 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                                        >
                                          <RefreshCw className="w-3.5 h-3.5" />
                                          Ulangi Latihan Esai
                                        </button>
                                      </div>
                                    </motion.div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Section Esai khusus untuk Bab 1, Materi 2 (Mubtada' wal Khabar) */}
                      {BAHAS_MATERI.id === 2 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, type: "spring" }}
                          className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-md mt-8"
                          id="mubtada-essay-practice-section"
                        >
                          <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse shrink-0" />
                            <div>
                              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-100/60 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono border border-indigo-200">
                                Bagian Kedua: Analisis Struktur Kalimat
                              </span>
                              <h3 className="text-lg md:text-xl font-black text-slate-800 mt-1">Latihan: Sebutkanlah mubtada dan khabar!</h3>
                            </div>
                          </div>

                          {/* Questions List */}
                          <div className="space-y-6">
                            {MUBTADA_ESSAY_QUESTIONS.map((q, idx) => {
                              const userAnswers = mubtadaEssayAnswers[q.id] || { mubtada: '', khabar: '' };
                              const evaluation = checkMubtadaKhabarCorrectness(q.id, userAnswers.mubtada, userAnswers.khabar);
                              
                              const cardStyles = [
                                {
                                  bg: "bg-gradient-to-br from-blue-50/70 to-indigo-50/70",
                                  border: "border-blue-100",
                                  badge: "bg-blue-600 text-white border-blue-400"
                                },
                                {
                                  bg: "bg-gradient-to-br from-purple-50/70 to-pink-50/70",
                                  border: "border-purple-100",
                                  badge: "bg-purple-600 text-white border-purple-400"
                                },
                                {
                                  bg: "bg-gradient-to-br from-emerald-50/70 to-teal-50/70",
                                  border: "border-emerald-100",
                                  badge: "bg-emerald-600 text-white border-emerald-400"
                                },
                                {
                                  bg: "bg-gradient-to-br from-amber-50/70 to-yellow-50/70",
                                  border: "border-amber-100",
                                  badge: "bg-amber-600 text-white border-amber-400"
                                },
                                {
                                  bg: "bg-gradient-to-br from-rose-50/70 to-red-50/70",
                                  border: "border-rose-100",
                                  badge: "bg-rose-600 text-white border-rose-400"
                                }
                              ][idx % 5];

                              return (
                                <motion.div 
                                  key={q.id} 
                                  initial={{ opacity: 0, y: 15 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                                  className={`border rounded-3xl p-6 md:p-8 space-y-4 shadow-sm hover:shadow-md hover:scale-[1.005] transition-all duration-300 ${cardStyles.bg} ${cardStyles.border}`}
                                >
                                  {/* Question Header & Sentence */}
                                  <div className="flex flex-col-reverse md:flex-row-reverse justify-between items-start md:items-center gap-4">
                                    <span className={`w-10 h-10 rounded-full font-black flex items-center justify-center shrink-0 border shadow-sm ${cardStyles.badge} text-lg`} style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                      {toArabicNumber(idx + 1)}
                                    </span>
                                    <div className="text-right w-full space-y-1" dir="rtl">
                                      <h5 className="text-[32px] md:text-[38px] font-black text-slate-900 leading-relaxed font-arabic" dir="rtl" style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.8)" }}>
                                        {q.sentenceAr}
                                      </h5>
                                      <p className="text-xs md:text-sm font-semibold text-slate-500 text-left" dir="ltr">
                                        Arti: "{q.sentenceId}"
                                      </p>
                                    </div>
                                  </div>

                                  {/* Interactive Inputs */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {/* Mubtada Input */}
                                    <div className="space-y-2">
                                      <label className="block text-xs font-black text-slate-600 uppercase tracking-wider flex items-center justify-between">
                                        <span>الْمُبْتَدَأُ (Mubtada') :</span>
                                        {showMubtadaEssayResult && (
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            evaluation.mubtada === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                          }`}>
                                            {evaluation.mubtada === 'correct' ? '✓ Benar' : '✗ Belum Tepat'}
                                          </span>
                                        )}
                                      </label>
                                      <input
                                        type="text"
                                        disabled={showMubtadaEssayResult}
                                        value={userAnswers.mubtada}
                                        onChange={(e) => setMubtadaEssayAnswers(prev => ({
                                          ...prev,
                                          [q.id]: { ...prev[q.id], mubtada: e.target.value }
                                        }))}
                                        placeholder="Ketik Mubtada' (Arab atau Latin)..."
                                        className={`w-full border-2 rounded-2xl px-5 py-3 text-sm md:text-base font-extrabold transition-all duration-300 shadow-sm ${
                                          !showMubtadaEssayResult
                                            ? 'bg-gradient-to-r from-blue-50/40 to-indigo-50/40 border-indigo-100/80 hover:from-blue-50 hover:to-indigo-50 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                                            : evaluation.mubtada === 'correct'
                                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 focus:outline-none'
                                              : 'bg-rose-50/70 border-rose-200 text-rose-950 focus:outline-none'
                                        }`}
                                      />
                                    </div>

                                    {/* Khabar Input */}
                                    <div className="space-y-2">
                                      <label className="block text-xs font-black text-slate-600 uppercase tracking-wider flex items-center justify-between">
                                        <span>الْخَبَرُ (Khabar) :</span>
                                        {showMubtadaEssayResult && (
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            evaluation.khabar === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                          }`}>
                                            {evaluation.khabar === 'correct' ? '✓ Benar' : '✗ Belum Tepat'}
                                          </span>
                                        )}
                                      </label>
                                      <input
                                        type="text"
                                        disabled={showMubtadaEssayResult}
                                        value={userAnswers.khabar}
                                        onChange={(e) => setMubtadaEssayAnswers(prev => ({
                                          ...prev,
                                          [q.id]: { ...prev[q.id], khabar: e.target.value }
                                        }))}
                                        placeholder="Ketik Khabar (Arab atau Latin)..."
                                        className={`w-full border-2 rounded-2xl px-5 py-3 text-sm md:text-base font-extrabold transition-all duration-300 shadow-sm ${
                                          !showMubtadaEssayResult
                                            ? 'bg-gradient-to-r from-blue-50/40 to-indigo-50/40 border-indigo-100/80 hover:from-blue-50 hover:to-indigo-50 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                                            : evaluation.khabar === 'correct'
                                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 focus:outline-none'
                                              : 'bg-rose-50/70 border-rose-200 text-rose-950 focus:outline-none'
                                        }`}
                                      />
                                    </div>
                                  </div>

                                  {/* Result & Explanation */}
                                  {showMubtadaEssayResult && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="bg-white border border-indigo-100 rounded-xl p-4 md:p-5 space-y-3 shadow-sm text-left"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                          Kunci Acuan Guru
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-sm">
                                        <div className="space-y-1">
                                          <p className="text-xs font-bold text-slate-400">Mubtada’ (Subjek):</p>
                                          <p className="text-xl font-bold text-slate-800 text-right font-arabic" dir="rtl">
                                            {q.refMubtada}
                                          </p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-xs font-bold text-slate-400">Khabar (Predikat):</p>
                                          <p className="text-xl font-bold text-slate-800 text-right font-arabic" dir="rtl">
                                            {q.refKhabar}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="bg-slate-50 rounded-lg p-3 text-xs md:text-sm font-medium text-slate-700 leading-relaxed border border-slate-100">
                                        <strong>Penjelasan:</strong> {q.explanation}
                                      </div>
                                    </motion.div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Essay Action Buttons */}
                          <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-100">
                            {!showMubtadaEssayResult ? (
                              <button
                                onClick={() => {
                                  const emptyAnswers = Object.keys(mubtadaEssayAnswers).filter(key => {
                                    const item = mubtadaEssayAnswers[key];
                                    return !item.mubtada.trim() || !item.khabar.trim();
                                  });
                                  if (emptyAnswers.length > 0) {
                                    showToast("Harap isi semua kolom Mubtada' dan Khabar sebelum mengirim!", "error");
                                    return;
                                  }
                                  setShowMubtadaEssayResult(true);
                                  if (session.name && session.peran === 'siswa') {
                                    saveStudentProgress(session.name, {
                                      mubtadaEssayAnswers,
                                      showMubtadaEssayResult: true
                                    });
                                  }
                                  showToast("Latihan Mubtada' & Khabar berhasil dikirim!", "success");
                                }}
                                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm md:text-base cursor-pointer transition shadow hover:shadow-lg flex items-center gap-2"
                              >
                                <Sparkles className="w-5 h-5 text-white" />
                                Kirim Semua Jawaban Latihan
                              </button>
                            ) : (
                              <div className="text-center space-y-6 w-full">
                                {/* Score Indicator Animation */}
                                {(() => {
                                  let correctParts = 0;
                                  Object.keys(mubtadaEssayAnswers).forEach(key => {
                                    const ans = mubtadaEssayAnswers[key];
                                    const evalObj = checkMubtadaKhabarCorrectness(key, ans.mubtada, ans.khabar);
                                    if (evalObj.mubtada === 'correct') correctParts++;
                                    if (evalObj.khabar === 'correct') correctParts++;
                                  });
                                  const totalScore = Math.round((correctParts / 20) * 100);
                                  const isPerfect = totalScore === 100;
                                  const isGood = totalScore >= 60;
                                  
                                  return (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ type: "spring", stiffness: 180, damping: 20 }}
                                      className="bg-gradient-to-tr from-[#0b1b3d] to-[#1e2a55] text-white p-8 rounded-3xl border border-indigo-950 text-center space-y-6 shadow-2xl relative overflow-hidden max-w-2xl mx-auto"
                                    >
                                      {/* Background ambient light */}
                                      <div className="absolute top-0 left-0 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                                      <div className="absolute bottom-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl" />

                                      <div className="space-y-1 relative z-10">
                                        <span className="text-indigo-300 font-black text-[10px] uppercase tracking-widest font-mono bg-indigo-400/20 border border-indigo-400/30 px-3 py-1 rounded-full">
                                          Evaluasi Mubtada' & Khabar
                                        </span>
                                        <h3 className="text-xl font-extrabold text-indigo-50">Hasil Analisis Struktur Kalimat</h3>
                                      </div>

                                      {/* Circle Progress Score */}
                                      <div className="relative flex items-center justify-center w-40 h-40 mx-auto z-10">
                                        <svg className="w-full h-full transform -rotate-90">
                                          <circle
                                            cx="80"
                                            cy="80"
                                            r="64"
                                            className="text-white/10 stroke-current"
                                            strokeWidth="10"
                                            fill="transparent"
                                          />
                                          <motion.circle
                                            cx="80"
                                            cy="80"
                                            r="64"
                                            className="text-indigo-400 stroke-current"
                                            strokeWidth="10"
                                            strokeDasharray="402"
                                            initial={{ strokeDashoffset: 402 }}
                                            animate={{ strokeDashoffset: 402 - (402 * totalScore) / 100 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            fill="transparent"
                                          />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                          <motion.span 
                                            initial={{ scale: 0.5 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring" }}
                                            className="text-4xl font-black text-white"
                                          >
                                            {totalScore}
                                          </motion.span>
                                          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">
                                            Skor Kerja
                                          </span>
                                        </div>
                                      </div>

                                      {/* Mascot feedback card */}
                                      <motion.div 
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="bg-indigo-950/50 border border-indigo-900 p-5 rounded-2xl flex items-center gap-4 text-left z-10 relative"
                                      >
                                        <div className="w-16 h-16 rounded-full bg-indigo-600/30 flex items-center justify-center shrink-0 border border-indigo-500/30 text-3xl animate-bounce">
                                          {isPerfect ? '👑' : isGood ? '🌟' : '💪'}
                                        </div>
                                        <div className="space-y-1.5">
                                          <h4 className="text-base font-black text-indigo-300">
                                            {isPerfect ? 'MUMTAZ! (المُمْتَاز)' : isGood ? 'BARAKALLAH! (بَارَكَ اللّٰهُ)' : 'LAA TAY\'AS! (لَا تَيْأَسْ)'}
                                          </h4>
                                          <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                                            {isPerfect 
                                              ? 'Hebat sekali! Anda telah menguasai konsep subjek (Mubtada\') dan predikat (Khabar) dengan sangat sempurna!' 
                                              : isGood 
                                                ? 'Bagus sekali! Pemahaman Anda tentang Mubtada\' dan Khabar sudah sangat baik. Teruskan berlatih ya!'
                                                : 'Jangan putus asa! Konsep tata bahasa Arab memerlukan pembiasaan. Silakan pelajari kembali kunci jawaban di atas.'}
                                          </p>
                                        </div>
                                      </motion.div>

                                      {/* Action Bar */}
                                      <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3 relative z-10">
                                        <button
                                          onClick={handleLanjutKeTopikBerikutnya}
                                          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow hover:shadow-lg active:scale-95"
                                        >
                                          Lanjut ke Topik Berikutnya
                                          <ArrowRight className="w-4 h-4 text-white animate-pulse" />
                                        </button>
                                        
                                        <button
                                          onClick={() => {
                                            setMubtadaEssayAnswers({
                                              '1': { mubtada: '', khabar: '' },
                                              '2': { mubtada: '', khabar: '' },
                                              '3': { mubtada: '', khabar: '' },
                                              '4': { mubtada: '', khabar: '' },
                                              '5': { mubtada: '', khabar: '' },
                                              '6': { mubtada: '', khabar: '' },
                                              '7': { mubtada: '', khabar: '' },
                                              '8': { mubtada: '', khabar: '' },
                                              '9': { mubtada: '', khabar: '' },
                                              '10': { mubtada: '', khabar: '' }
                                            });
                                            setShowMubtadaEssayResult(false);
                                          }}
                                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-indigo-800 text-indigo-300 hover:bg-indigo-950/40 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                                        >
                                          <RefreshCw className="w-3.5 h-3.5" />
                                          Ulangi Latihan
                                        </button>
                                      </div>
                                    </motion.div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Section Esai / Menjodohkan khusus untuk Bab 2, Materi 1 (Tata Bahasa Satu Darsu Tsani) */}
                      {BAHAS_MATERI.id === 101 && showLatihanResult && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, type: "spring" }}
                          className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-md mt-8"
                          id="darsu-tsani-essay-practice-section"
                        >
                          {/* Header */}
                          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100">
                            <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse shrink-0" />
                            <div>
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono border border-emerald-200">
                                Bagian Kedua: Melengkapi Kalimat Rumpang (Issei)
                              </span>
                              <h3 className="text-lg md:text-xl font-black text-slate-800 mt-1 font-arabic" dir="rtl">
                                اخْتَرِ الْكَلِمَةَ الْمُنَاسِبَةَ لِإِكْمَالِ الْجُمَلِ الْآتِيَةِ.
                              </h3>
                              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                Pilihlah kata yang tepat dari pilihan berwarna di bawah untuk melengkapi kalimat!
                              </p>
                            </div>
                          </div>

                          {/* Bank Pilihan Jawaban Berwarna */}
                          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 p-5 md:p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-xs md:text-sm font-black uppercase text-indigo-950 tracking-wider flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                Bank Pilihan Jawaban (الْإِجَابَةُ):
                              </span>
                              <span className="text-xs font-bold text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-slate-200">Pilih 1 kata untuk setiap soal</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
                              {DARSU_TSANI_ESSAY_OPTIONS.map((opt) => (
                                <div 
                                  key={opt.key}
                                  className={`p-4 md:p-5 rounded-2xl border text-center shadow-sm flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105 ${opt.badgeBg}`}
                                >
                                  <span className="text-xl md:text-2xl font-black font-arabic tracking-wide" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                    {opt.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Questions List */}
                          <div className="space-y-6">
                            {DARSU_TSANI_ESSAY_QUESTIONS.map((q, idx) => {
                              const selectedKey = darsuTsaniEssayAnswers[q.id] || '';
                              const selectedOpt = DARSU_TSANI_ESSAY_OPTIONS.find(o => o.key === selectedKey);
                              const isCorrect = selectedKey === q.correctKey;
                              
                              const cardStyles = [
                                { bg: "bg-gradient-to-br from-emerald-50/70 to-teal-50/70", border: "border-emerald-200", badge: "bg-emerald-600 text-white" },
                                { bg: "bg-gradient-to-br from-amber-50/70 to-orange-50/70", border: "border-amber-200", badge: "bg-amber-600 text-white" },
                                { bg: "bg-gradient-to-br from-sky-50/70 to-blue-50/70", border: "border-sky-200", badge: "bg-sky-600 text-white" },
                                { bg: "bg-gradient-to-br from-rose-50/70 to-red-50/70", border: "border-rose-200", badge: "bg-rose-600 text-white" },
                                { bg: "bg-gradient-to-br from-purple-50/70 to-indigo-50/70", border: "border-purple-200", badge: "bg-purple-600 text-white" }
                              ][idx % 5];

                              return (
                                <motion.div 
                                  key={q.id}
                                  initial={{ opacity: 0, y: 15 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                                  className={`border rounded-3xl p-5 md:p-6 space-y-5 shadow-sm hover:shadow-md transition-all ${cardStyles.bg} ${cardStyles.border}`}
                                >
                                  {/* Header Soal */}
                                  <div className="flex flex-col-reverse md:flex-row-reverse justify-between items-start md:items-center gap-3">
                                    <span className={`w-10 h-10 rounded-full font-black flex items-center justify-center shrink-0 border shadow-sm ${cardStyles.badge} text-lg`} style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                      {toArabicNumber(idx + 1)}
                                    </span>
                                    <div className="text-right w-full space-y-1.5" dir="rtl">
                                      <h5 className="text-[28px] md:text-[36px] font-black text-slate-900 leading-relaxed font-arabic" dir="rtl" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                        {selectedKey ? (
                                          <span>
                                            {q.sentenceAr.replace('....', `(${selectedOpt?.text})`)}
                                          </span>
                                        ) : (
                                          q.sentenceAr
                                        )}
                                      </h5>
                                      <p className="text-xs md:text-sm font-semibold text-slate-600 text-left" dir="ltr">
                                        Arti: "{q.sentenceId}"
                                      </p>
                                    </div>
                                  </div>

                                  {/* Pilihan Jawaban Tombol Berwarna */}
                                  <div className="space-y-2.5 pt-2">
                                    <label className="text-xs md:text-sm font-black text-slate-700 flex items-center gap-1.5">
                                      <span>Pilih Jawaban Kata yang Sesuai:</span>
                                    </label>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                      {DARSU_TSANI_ESSAY_OPTIONS.map((opt) => {
                                        const isSelected = selectedKey === opt.key;
                                        return (
                                          <button
                                            key={opt.key}
                                            disabled={showDarsuTsaniEssayResult}
                                            onClick={() => {
                                              const newAns = { ...darsuTsaniEssayAnswers, [q.id]: opt.key };
                                              setDarsuTsaniEssayAnswers(newAns);
                                              if (session.name && session.peran === 'siswa') {
                                                saveStudentProgress(session.name, {
                                                  darsuTsaniEssayAnswers: newAns
                                                });
                                              }
                                            }}
                                            className={`px-4 py-3.5 rounded-2xl border text-center font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                                              isSelected 
                                                ? `${opt.activeGlow} scale-105` 
                                                : `${opt.badgeBg} hover:scale-103 hover:shadow-md`
                                            } ${showDarsuTsaniEssayResult ? 'cursor-default opacity-90' : ''}`}
                                          >
                                            <span className="font-arabic text-xl md:text-2xl font-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                              {opt.text}
                                            </span>
                                            {isSelected && <CheckCircle2 className="w-5 h-5 shrink-0 text-white animate-pulse" />}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Hasil Feedback jika sudah disubmit */}
                                  {showDarsuTsaniEssayResult && (
                                    <motion.div 
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      className={`p-3.5 rounded-2xl border text-sm flex items-center gap-3 ${
                                        isCorrect 
                                          ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900' 
                                          : 'bg-rose-100/80 border-rose-300 text-rose-900'
                                      }`}
                                    >
                                      {isCorrect ? (
                                        <>
                                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold">✓</div>
                                          <div>
                                            <p className="font-extrabold text-emerald-800">Jawaban Tepat! (+20 Poin)</p>
                                            <p className="text-xs text-emerald-700">Pilihan <strong>{q.correctText}</strong> melengkapi kalimat secara tata bahasa dan makna dengan sempurna.</p>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 font-bold">✕</div>
                                          <div>
                                            <p className="font-extrabold text-rose-800">Kurang Tepat</p>
                                            <p className="text-xs text-rose-700">Jawaban yang benar adalah: <strong className="bg-white/80 px-2 py-0.5 rounded border border-rose-300 font-arabic text-sm">{q.correctText}</strong></p>
                                          </div>
                                        </>
                                      )}
                                    </motion.div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Section Actions & Result Card */}
                          <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-100">
                            {!showDarsuTsaniEssayResult ? (
                              <button
                                onClick={() => {
                                  const emptyAnswers = Object.keys(darsuTsaniEssayAnswers).filter(key => !darsuTsaniEssayAnswers[key]);
                                  if (emptyAnswers.length > 0) {
                                    showToast("Harap pilih jawaban untuk seluruh 5 kalimat di atas sebelum mengirim!", "error");
                                    return;
                                  }
                                  setShowDarsuTsaniEssayResult(true);
                                  if (session.name && session.peran === 'siswa') {
                                    saveStudentProgress(session.name, {
                                      darsuTsaniEssayAnswers,
                                      showDarsuTsaniEssayResult: true
                                    });
                                  }
                                  showToast("Latihan Issei Darsu Tsani berhasil dikirim!", "success");
                                  setTimeout(() => {
                                    const resultSec = document.getElementById('darsu-tsani-essay-result-card');
                                    if (resultSec) {
                                      resultSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                  }, 300);
                                }}
                                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm md:text-base cursor-pointer transition shadow-lg hover:shadow-xl flex items-center gap-2 active:scale-95"
                              >
                                <Sparkles className="w-5 h-5 text-white" />
                                Kirim Hasil Latihan Issei
                              </button>
                            ) : (
                              <div className="text-center space-y-6 w-full">
                                {(() => {
                                  let correctCount = 0;
                                  DARSU_TSANI_ESSAY_QUESTIONS.forEach(q => {
                                    if (darsuTsaniEssayAnswers[q.id] === q.correctKey) {
                                      correctCount++;
                                    }
                                  });
                                  const totalScore = Math.round((correctCount / 5) * 100);
                                  const isPerfect = totalScore === 100;
                                  const isGood = totalScore >= 60;

                                  return (
                                    <motion.div 
                                      id="darsu-tsani-essay-result-card"
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ type: "spring", stiffness: 180, damping: 20 }}
                                      className="bg-gradient-to-tr from-[#0b1b3d] to-[#1e2a55] text-white p-8 rounded-3xl border border-indigo-950 text-center space-y-6 shadow-2xl relative overflow-hidden max-w-2xl mx-auto"
                                    >
                                      <div className="absolute top-0 left-0 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                                      <div className="absolute bottom-0 right-0 w-36 h-36 bg-teal-500/10 rounded-full blur-3xl" />

                                      <div className="space-y-1 relative z-10">
                                        <span className="text-emerald-300 font-black text-[10px] uppercase tracking-widest font-mono bg-emerald-400/20 border border-emerald-400/30 px-3 py-1 rounded-full">
                                          Evaluasi Latihan Issei
                                        </span>
                                        <h3 className="text-xl font-extrabold text-emerald-50">Hasil Melengkapi Kalimat</h3>
                                      </div>

                                      {/* Score Circle Animation */}
                                      <div className="relative flex items-center justify-center w-40 h-40 mx-auto z-10">
                                        <svg className="w-full h-full transform -rotate-90">
                                          <circle
                                            cx="80"
                                            cy="80"
                                            r="64"
                                            className="text-white/10 stroke-current"
                                            strokeWidth="10"
                                            fill="transparent"
                                          />
                                          <motion.circle
                                            cx="80"
                                            cy="80"
                                            r="64"
                                            className="text-emerald-400 stroke-current"
                                            strokeWidth="10"
                                            strokeDasharray="402"
                                            initial={{ strokeDashoffset: 402 }}
                                            animate={{ strokeDashoffset: 402 - (402 * totalScore) / 100 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            fill="transparent"
                                          />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                          <motion.span 
                                            initial={{ scale: 0.5 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring" }}
                                            className="text-4xl font-black text-white"
                                          >
                                            {totalScore}
                                          </motion.span>
                                          <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">
                                            Nilai Issei
                                          </span>
                                        </div>
                                      </div>

                                      {/* Mascot Card */}
                                      <motion.div 
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="bg-indigo-950/50 border border-indigo-900 p-5 rounded-2xl flex items-center gap-4 text-left z-10 relative"
                                      >
                                        <div className="w-16 h-16 rounded-full bg-emerald-600/30 flex items-center justify-center shrink-0 border border-emerald-500/30 text-3xl animate-bounce">
                                          {isPerfect ? '👑' : isGood ? '🌟' : '💪'}
                                        </div>
                                        <div className="space-y-1.5">
                                          <h4 className="text-base font-black text-emerald-300">
                                            {isPerfect ? 'MUMTAZ! (المُمْتَاز)' : isGood ? 'BARAKALLAH! (بَارَكَ اللّٰهُ)' : 'LAA TAY\'AS! (لَا تَيْأَسْ)'}
                                          </h4>
                                          <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                                            {isPerfect 
                                              ? 'Luar biasa! Anda berhasil melengkapi seluruh 5 kalimat rumpang dengan sangat tepat dan sempurna!' 
                                              : isGood 
                                                ? 'Sangat bagus! Pemahaman melengkapi kalimat dalam Bahasa Arab Anda sudah baik. Teruskan berlatih!'
                                                : 'Tetap semangat! Perhatikan pasangan kata dan makna kalimat, lalu coba ulangi kembali.'}
                                          </p>
                                        </div>
                                      </motion.div>

                                      {/* Action Bar */}
                                      <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3 relative z-10">
                                        <button
                                          onClick={handleLanjutKeTopikBerikutnya}
                                          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow hover:shadow-lg active:scale-95"
                                        >
                                          Lanjut ke Materi Berikutnya
                                          <ArrowRight className="w-4 h-4 text-white animate-pulse" />
                                        </button>
                                        
                                        <button
                                          onClick={() => {
                                            setDarsuTsaniEssayAnswers({ '1': '', '2': '', '3': '', '4': '', '5': '' });
                                            setShowDarsuTsaniEssayResult(false);
                                          }}
                                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-indigo-800 text-indigo-300 hover:bg-indigo-950/40 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                                        >
                                          <RefreshCw className="w-3.5 h-3.5" />
                                          Ulangi Latihan Issei
                                        </button>
                                      </div>
                                    </motion.div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Navigation back */}
                      <div className="flex justify-between items-center pt-6">
                        <button
                          onClick={() => setMateriStep('contoh')}
                          className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs md:text-sm flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4 text-slate-500" />
                          Kembali ke Contoh Kalimat
                        </button>

                        <button
                          onClick={() => {
                            unlockStepForCurrentMateri('quiz');
                            setMateriStep('quiz');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs md:text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition cursor-pointer"
                        >
                          <span>Lanjut ke Kuis Pemahaman (Quiz)</span>
                          <Award className="w-4 h-4 text-amber-300" />
                        </button>
                      </div>

                    </motion.div>
                  )}

                  {/* ================= STAGE 4: QUIZ (Kuis Uji Pemahaman Mandiri) ================= */}
                  {materiStep === 'quiz' && (
                    <motion.div
                      key="step-quiz"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8 pb-32"
                    >
                      {/* Quiz Header Banner */}
                      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#0d3b78] text-white p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden border border-purple-700/60">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10 space-y-3 max-w-3xl">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-300/30">
                            <Award className="w-3.5 h-3.5 text-amber-300" />
                            Tahap 4: Kuis Pemahaman (Quiz)
                          </div>
                          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Kuis Uji Pemahaman: {BAHAS_MATERI.topik}
                          </h2>
                          <p className="text-sm md:text-base text-sky-100/90 font-medium leading-relaxed">
                            Jawab seluruh 5 pertanyaan kuis berikut untuk menguji ketepatan pemahaman kaidah Anda. Nilai kuis akan otomatis tersinkronisasi ke server dan rekap nilai resmi madrasah!
                          </p>
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                            <span className="px-3 py-1 rounded-full bg-white/10 text-sky-200 border border-white/10">
                              👤 Peserta: <b>{session.name}</b> ({session.kelas || 'Kelas 7A'})
                            </span>
                            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                              🎯 KKM Kelulusan: 75 / 100
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quiz Questions List */}
                      {(() => {
                        const currentQuizList: QuizQuestion[] = TOPIC_QUIZ_QUESTIONS[selectedMateriIndex] || (EVALUASI_QUESTIONS.map(eq => ({
                          id: eq.id,
                          question: eq.question,
                          options: eq.options,
                          correctAnswer: eq.correctAnswer,
                          explanation: "Pemahaman materi kaidah bahasa Arab."
                        })));

                        const answeredCount = Object.keys(quizAnswers).length;
                        const allAnswered = answeredCount >= currentQuizList.length;

                        const handleSelectQuizOption = (qId: number, optIdx: number) => {
                          if (showQuizResult) return;
                          setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
                        };

                        const handleKirimKuis = async () => {
                          if (!allAnswered) {
                            showToast(`Harap jawab semua ${currentQuizList.length} pertanyaan kuis terlebih dahulu!`, "error");
                            return;
                          }

                          let correctCount = 0;
                          currentQuizList.forEach(q => {
                            if (quizAnswers[q.id] === q.correctAnswer) {
                              correctCount++;
                            }
                          });

                          const finalScore = Math.round((correctCount / currentQuizList.length) * 100);
                          setQuizScore(finalScore);
                          setShowQuizResult(true);

                          const statusVal = finalScore >= 75 ? 'Lulus' : 'Remedial';
                          const docId = `quiz_${session.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}_topic_${selectedMateriIndex}_${Date.now()}`;
                          const record: StudentScore = {
                            id: docId,
                            name: session.name.trim(),
                            gender: session.gender === 'perempuan' ? 'Perempuan' : 'Laki-laki',
                            role: 'Siswa',
                            class: session.kelas || 'Kelas 7A',
                            score: finalScore,
                            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                            status: statusVal,
                            narrativeScore: getNarrativeScore({
                              name: session.name.trim(),
                              class: session.kelas || 'Kelas 7A',
                              gender: session.gender === 'perempuan' ? 'Perempuan' : 'Laki-laki',
                              role: 'Siswa',
                              score: finalScore,
                              date: '',
                              status: statusVal
                            })
                          };

                          // Synchronize to API & Firestore
                          await saveStudentScore(record);
                          
                          // Mark topic completed in student progress
                          const virtualIdx = getVirtualIndex(selectedChapter, selectedMateriIndex);
                          const newCompleted = Array.from(new Set([...completedMateriIndices, virtualIdx]));
                          setCompletedMateriIndices(newCompleted);
                          if (session.name && session.peran === 'siswa') {
                            saveStudentProgress(session.name, {
                              peran: session.peran,
                              kelas: session.kelas,
                              gender: session.gender,
                              completedMateriIndices: newCompleted
                            });
                          }

                          showToast(`Kuis selesai! Skor Anda: ${finalScore}/100 (${statusVal}). Data tersinkron otomatis!`, "success");
                        };

                        const handleResetKuis = () => {
                          setQuizAnswers({});
                          setShowQuizResult(false);
                          setQuizScore(0);
                          showToast("Kuis direset. Silakan kerjakan kembali!", "info");
                        };

                        return (
                          <div className="space-y-6">
                            {/* Questions */}
                            <div className="space-y-6">
                              {currentQuizList.map((q, idx) => {
                                const selectedOption = quizAnswers[q.id];
                                const isAnswered = selectedOption !== undefined;
                                const isCorrect = selectedOption === q.correctAnswer;

                                return (
                                  <div 
                                    key={q.id}
                                    className={`bg-white rounded-2xl border transition duration-200 p-5 md:p-6 shadow-sm space-y-4 ${
                                      showQuizResult 
                                        ? isCorrect 
                                          ? 'border-emerald-300 ring-2 ring-emerald-100 bg-emerald-50/20' 
                                          : 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20'
                                        : isAnswered 
                                        ? 'border-blue-300 ring-2 ring-blue-50' 
                                        : 'border-slate-200'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3">
                                        <span className={`w-8 h-8 rounded-xl font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm ${
                                          showQuizResult 
                                            ? isCorrect 
                                              ? 'bg-emerald-600 text-white' 
                                              : 'bg-rose-600 text-white'
                                            : isAnswered 
                                            ? 'bg-[#0d3b78] text-white' 
                                            : 'bg-slate-100 text-slate-700'
                                        }`}>
                                          {idx + 1}
                                        </span>
                                        <div>
                                          <p className="text-sm md:text-base font-bold text-slate-800 leading-relaxed">
                                            {renderTextWithArabic(q.question, arabicFontFamily, arabicScale)}
                                          </p>
                                        </div>
                                      </div>
                                      {showQuizResult && (
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                        }`}>
                                          {isCorrect ? '✓ Benar' : '✗ Salah'}
                                        </span>
                                      )}
                                    </div>

                                    {/* Options */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                      {q.options.map((opt, oIdx) => {
                                        const isSelected = selectedOption === oIdx;
                                        const isThisCorrect = oIdx === q.correctAnswer;
                                        let btnStyle = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700";

                                        if (showQuizResult) {
                                          if (isThisCorrect) {
                                            btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-black ring-2 ring-emerald-200";
                                          } else if (isSelected) {
                                            btnStyle = "border-rose-400 bg-rose-50 text-rose-950 font-black ring-2 ring-rose-200";
                                          } else {
                                            btnStyle = "border-slate-200 bg-white text-slate-400 opacity-60";
                                          }
                                        } else if (isSelected) {
                                          btnStyle = "border-[#0d3b78] bg-blue-50/70 text-[#0d3b78] font-black ring-2 ring-blue-200";
                                        }

                                        return (
                                          <button
                                            key={oIdx}
                                            type="button"
                                            disabled={showQuizResult}
                                            onClick={() => handleSelectQuizOption(q.id, oIdx)}
                                            className={`p-3.5 rounded-xl border text-left text-xs md:text-sm transition duration-150 flex items-center justify-between gap-2.5 ${btnStyle} ${
                                              !showQuizResult ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2.5">
                                              <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border ${
                                                isSelected ? 'bg-[#0d3b78] text-white border-[#0d3b78]' : 'bg-slate-100 text-slate-600 border-slate-200'
                                              }`}>
                                                {String.fromCharCode(65 + oIdx)}
                                              </span>
                                              <span className="leading-snug font-semibold">
                                                {renderTextWithArabic(opt, arabicFontFamily, arabicScale)}
                                              </span>
                                            </div>
                                            {showQuizResult && isThisCorrect && (
                                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Explanation after submit */}
                                    {showQuizResult && (
                                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                                        <span className="font-extrabold text-[#0d3b78] flex items-center gap-1">
                                          💡 Pembahasan Jawaban:
                                        </span>
                                        <p className="font-medium leading-relaxed">{q.explanation}</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Quiz Result Summary Box */}
                            {showQuizResult ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-br from-[#0a2c5c] via-[#0d3b78] to-indigo-900 text-white rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden"
                              >
                                <div className="space-y-2">
                                  <span className="text-xs uppercase tracking-widest font-extrabold text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-300/30">
                                    Hasil Kuis Pemahaman Resmi
                                  </span>
                                  <h3 className="text-3xl font-black text-white">
                                    Skor Anda: <span className="text-amber-300">{quizScore}</span> / 100
                                  </h3>
                                  <p className="text-sm text-sky-200 font-semibold">
                                    Status: <span className={`px-2.5 py-0.5 rounded font-black ${quizScore >= 75 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>{quizScore >= 75 ? 'LULUS (MUMTAZ)' : 'REMEDIAL'}</span>
                                  </p>
                                  <p className="text-xs text-sky-100/90 max-w-lg mx-auto italic">
                                    Data nilai Anda telah tersinkronisasi otomatis ke server pusat Cloud SQL dan database real-time Firestore.
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                  <button
                                    onClick={handleResetKuis}
                                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition border border-white/20"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    Ulangi Kuis
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveTab('evaluasi');
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
                                  >
                                    <Award className="w-4 h-4" />
                                    Lihat Rekap Nilai di Evaluasi
                                  </button>

                                  {selectedMateriIndex < CURRENT_DAFTAR_MATERI.length - 1 && (
                                    <button
                                      onClick={() => {
                                        handleMateriChange(selectedMateriIndex + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0d3b78] font-black text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
                                    >
                                      <span>Lanjut ke Topik {selectedMateriIndex + 2}</span>
                                      <ArrowRight className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </motion.div>
                            ) : (
                              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="space-y-1 text-center sm:text-left">
                                  <h4 className="text-sm font-extrabold text-slate-800">
                                    Sudah Menjawab Semua Pertanyaan? ({answeredCount} dari {currentQuizList.length} Dijawab)
                                  </h4>
                                  <p className="text-xs text-slate-500 font-medium">
                                    Pastikan seluruh jawaban telah Anda tentukan sebelum mengirimkan hasil kuis.
                                  </p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => setMateriStep('latihan')}
                                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                                  >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke Latihan
                                  </button>

                                  <button
                                    type="button"
                                    onClick={handleKirimKuis}
                                    className={`px-7 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 transition shadow-md cursor-pointer ${
                                      allAnswered 
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-600/30' 
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                  >
                                    <Send className="w-4 h-4" />
                                    Kirim Jawaban Kuis
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}

                </AnimatePresence>
                  </>
                ) : (
                  <motion.div
                    key="materi-chapter-2-placeholder"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-sm max-w-2xl mx-auto"
                  >
                    <div className="mx-auto w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner animate-bounce-slow">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 uppercase tracking-widest font-mono">
                        Bab 2: Al-Darsuts Tsani
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-[#0d3b78] tracking-tight">الدَّرْسُ الثَّانِي</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-md mx-auto">
                        Materi, latihan, dan media pembelajaran interaktif untuk <b>Bab 2 (الدَّرْسُ الثَّانِي)</b> sedang disiapkan oleh Guru.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-left space-y-2.5">
                      <h4 className="text-xs font-black text-[#0d3b78] uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500" />
                        Instruksi Guru Untuk Anda:
                      </h4>
                      <ul className="text-xs text-slate-600 font-semibold space-y-1.5 list-disc pl-4 leading-relaxed">
                        <li>Selesaikan seluruh <b>4 sub-topik</b> pembelajaran di Bab 1 (التَّعَارُفُ).</li>
                        <li>Pastikan Anda melatih kepekaan visual dengan mencoba <b>Latihan Mandiri</b> di setiap sub-topik.</li>
                        <li>Kerjakan <b>Evaluasi Akhir</b> pada menu utama di atas untuk menguji tingkat penguasaan kaidah Anda!</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedChapter(1);
                        handleMateriChange(0);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#1f6fe5] hover:bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition shadow hover:shadow-md"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Kembali Belajar Bab 1
                    </button>
                  </motion.div>
                )}

              </motion.div>
            )}

            {/* ================= 6. TAB: EVALUASI ================= */}
            {activeTab === 'evaluasi' && (
              <motion.div
                key="tab-evaluasi"
                layout="position"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.8 }}
                className="space-y-8"
              >
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-[#0d3b78] via-indigo-900 to-[#104e9e] text-white p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden border border-sky-800">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 space-y-3 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-300/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      Sistem Pencatatan & Evaluasi Nilai Siswa
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      Fitur Evaluasi Belajar & Rekap Nilai
                    </h2>
                    <p className="text-sm md:text-base text-sky-100/90 font-medium leading-relaxed">
                      Sistem input nilai terpadu dalam bentuk kolom. Data disimpan secara permanen, mendukung edit, hapus, rekap kemajuan belajar, serta otomatis diformat menjadi kalimat naratif untuk diunduh ke Microsoft Excel.
                    </p>
                  </div>
                </div>

                {/* Role-Specific Panel: Only Admin can input/edit scores. Guru has read-only monitor. Siswa has personal score status. */}
                {session.peran === 'admin' ? (
                  /* Form Input & Edit Data Siswa (Hak Akses Penuh Administrator) */
                  <div ref={evalFormRef} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-900 to-[#0d3b78] text-white px-6 py-4 flex items-center justify-between">
                      <h3 className="text-base font-extrabold flex items-center gap-2 text-amber-300">
                        <FileText className="w-5 h-5 text-amber-300" />
                        {editingScoreId ? 'Edit / Ganti Data Nilai Murid' : 'Input Nilai Evaluasi Siswa Baru'}
                      </h3>
                      <span className="text-xs font-mono font-bold bg-amber-400 text-slate-950 px-3 py-1 rounded-full">
                        Hak Akses: Administrator Penuh
                      </span>
                    </div>

                    <form onSubmit={handleSaveEvaluationScore} className="p-6 md:p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Kolom 1: Nama Siswa */}
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <User className="w-4 h-4 text-[#0d3b78]" />
                            1. Nama Siswa <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={evalInputName}
                            onChange={(e) => setEvalInputName(e.target.value)}
                            placeholder="Masukkan nama lengkap siswa..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0d3b78] focus:ring-2 focus:ring-[#0d3b78]/20 bg-slate-50/50 font-bold text-slate-800 text-sm outline-none transition"
                          />
                        </div>

                        {/* Kolom 2: Kelas */}
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-[#0d3b78]" />
                            2. Kelas <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={evalInputClass}
                            onChange={(e) => setEvalInputClass(e.target.value)}
                            placeholder="Contoh: Kelas 7A"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0d3b78] focus:ring-2 focus:ring-[#0d3b78]/20 bg-slate-50/50 font-bold text-slate-800 text-sm outline-none transition"
                          />
                        </div>

                        {/* Kolom 3: Jenis Kelamin */}
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#0d3b78]" />
                            3. Jenis Kelamin <span className="text-rose-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => setEvalInputGender('Laki-laki')}
                              className={`px-3 py-2.5 rounded-xl border font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                evalInputGender === 'Laki-laki'
                                  ? 'bg-[#0d3b78] text-white border-[#0d3b78] shadow-sm'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>👨 Laki-laki</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEvalInputGender('Perempuan')}
                              className={`px-3 py-2.5 rounded-xl border font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                evalInputGender === 'Perempuan'
                                  ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>👩 Perempuan</span>
                            </button>
                          </div>
                        </div>

                        {/* Kolom 4: Nilai */}
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-[#0d3b78]" />
                            4. Nilai (Angka 0-100) <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              required
                              value={evalInputScore}
                              onChange={(e) => setEvalInputScore(e.target.value)}
                              placeholder="85"
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0d3b78] focus:ring-2 focus:ring-[#0d3b78]/20 bg-slate-50/50 font-black text-slate-900 text-base outline-none transition"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">
                              / 100
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* Pratinjau Kalimat Naratif Microsoft Excel */}
                      {evalInputName.trim() && (
                        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
                          <span className="text-[11px] font-black uppercase tracking-widest text-amber-800 flex items-center gap-1.5">
                            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-700" />
                            Pratinjau Output Kalimat Naratif pada File Microsoft Excel:
                          </span>
                          <p className="text-xs font-medium text-amber-900 leading-relaxed italic">
                            "{getNarrativeScore({
                              name: evalInputName.trim(),
                              class: evalInputClass.trim() || 'Kelas 7A',
                              gender: evalInputGender,
                              role: 'Siswa',
                              score: Number(evalInputScore) || 0,
                              date: '',
                              status: (Number(evalInputScore) || 0) >= 75 ? 'Lulus' : 'Remedial'
                            })}"
                          </p>
                        </div>
                      )}

                      {/* Action Form Buttons */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="submit"
                            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0d3b78] to-indigo-700 hover:from-blue-900 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                          >
                            <Save className="w-4 h-4 text-amber-300" />
                            {editingScoreId ? 'Simpan Perubahan Nilai' : 'Simpan Data Nilai'}
                          </button>

                          {editingScoreId && (
                            <button
                              type="button"
                              onClick={handleResetForm}
                              className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-extrabold text-xs cursor-pointer transition"
                            >
                              Batal Edit
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const success = exportScoresToExcel(localScores);
                            if (success) {
                              showToast("Berkas Rekap Excel (.xlsx) berhasil diunduh!", "success");
                            }
                          }}
                          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs transition cursor-pointer shadow-sm flex items-center gap-2"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                          Unduh Rekap Excel (.xlsx)
                        </button>
                      </div>
                    </form>
                  </div>
                ) : session.peran === 'guru' ? (
                  /* Panel Guru: Monitoring Nilai & Ekspor Rekap (Hanya Lihat Nilai) */
                  <div className="bg-gradient-to-br from-amber-50 via-sky-50 to-emerald-50 border border-amber-200/90 rounded-2xl p-6 md:p-7 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-300/60">
                          <ShieldCheck className="w-4 h-4 text-amber-700" />
                          Akses Guru: Hak Pantau Nilai Siswa (Read-Only)
                        </div>
                        <h3 className="text-xl font-black text-slate-900">
                          Monitoring Kemajuan & Nilai Evaluasi Siswa
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                          Berdasarkan ketetapan sistem, akun Guru memiliki wewenang untuk melihat seluruh hasil evaluasi dan kemajuan belajar siswa madrasah serta mengunduh rekap format resmi Excel (.xlsx). Hak akses untuk mengubah atau mengganti nilai hanya dimiliki oleh Administrator.
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const success = exportScoresToExcel(localScores);
                            if (success) showToast("Berkas Rekap Excel (.xlsx) berhasil diunduh!", "success");
                          }}
                          className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                          Unduh Rekap Excel (.xlsx)
                        </button>
                        <span className="text-[10px] text-center text-slate-400 font-bold">
                          Total {localScores.length} Data Murid Tersinkron
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Panel Siswa: Tampilan Hasil Evaluasi Pribadi (Hanya Lihat Nilai Sendiri) */
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 border border-blue-200/90 rounded-2xl p-6 md:p-7 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d3b78] text-white text-xs font-black uppercase tracking-wider">
                          <Award className="w-4 h-4 text-amber-300" />
                          Status Evaluasi Belajar Siswa
                        </div>
                        <h3 className="text-xl font-black text-slate-900">
                          Papan Capaian & Nilai Evaluasi: {session.name}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                          Siswa berhak melihat nilai evaluasi dan capaian mandiri yang diperoleh dari pengerjaan kuis pada menu Materi. Nilai otomatis tersinkronisasi ke server madrasah secara terintegrasi.
                        </p>
                      </div>
                      <div className="shrink-0 bg-white p-4 rounded-xl border border-blue-200 shadow-sm text-center min-w-[160px]">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                          Nilai Evaluasi Anda
                        </span>
                        {(() => {
                          const myScore = localScores.find(s => s.name.trim().toLowerCase() === session.name.trim().toLowerCase());
                          if (myScore) {
                            return (
                              <div>
                                <span className="text-3xl font-black text-[#0d3b78] block">
                                  {myScore.score} <span className="text-xs text-slate-400">/ 100</span>
                                </span>
                                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                                  myScore.score >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {myScore.score >= 75 ? '✓ Tuntas / Lulus' : '⚠ Perlu Remedial'}
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div>
                              <span className="text-xs font-bold text-amber-600 block py-1">
                                Belum Mengisi Kuis
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                Buka Menu Materi & selesaikan Kuis
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Rekap Nilai Siswa (Tabel Rekapitulasi Kemajuan Belajar) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
                  <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#0d3b78]" />
                        Rekap Nilai Siswa & Kemajuan Belajar
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Daftar seluruh siswa yang telah dievaluasi beserta kalimat naratif predikat.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={scoreSearchFilter}
                          onChange={(e) => setScoreSearchFilter(e.target.value)}
                          placeholder="Cari nama atau kelas..."
                          className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-[#0d3b78] w-48"
                        />
                      </div>

                      {/* Class Filter */}
                      <select
                        value={scoreClassFilter}
                        onChange={(e) => setScoreClassFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-[#0d3b78]"
                      >
                        {uniqueClasses.map((cls, idx) => (
                          <option key={idx} value={cls}>Kelas: {cls}</option>
                        ))}
                      </select>

                      {/* Export Excel Button */}
                      <button
                        onClick={() => {
                          const success = exportScoresToExcel(filteredScores);
                          if (success) {
                            showToast("Data rekap berhasil diekspor ke Microsoft Excel (.xlsx)!", "success");
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-[#0d3b78] hover:bg-blue-900 active:scale-95 text-white font-extrabold text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-300" />
                        Ekspor Microsoft Excel
                      </button>
                    </div>
                  </div>

                  {/* Score Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-700 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                          <th className="p-4 w-12 text-center">No</th>
                          <th className="p-4">Nama Siswa</th>
                          <th className="p-4 w-28 text-center">Kelas</th>
                          <th className="p-4 w-32 text-center">Jenis Kelamin</th>
                          <th className="p-4">Nilai (Kalimat Naratif & Predikat)</th>
                          <th className="p-4 w-28 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-800">
                        {filteredScores.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 italic font-medium">
                              Belum ada data nilai evaluasi yang tersimpan. Masukkan data siswa baru pada form di atas.
                            </td>
                          </tr>
                        ) : (
                          filteredScores.map((sc, idx) => {
                            const narrative = sc.narrativeScore || getNarrativeScore(sc);
                            return (
                              <tr key={`${sc.id || 'score'}_${idx}`} className="hover:bg-slate-50/80 transition duration-150">
                                <td className="p-4 text-center text-slate-500 font-mono text-xs font-bold">{idx + 1}</td>
                                <td className="p-4 font-black text-slate-900">{sc.name}</td>
                                <td className="p-4 text-center">
                                  <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-extrabold text-xs">
                                    {sc.class}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-extrabold ${
                                    (sc.gender || 'Laki-laki') === 'Perempuan' 
                                      ? 'bg-purple-100 text-purple-800' 
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {sc.gender || 'Laki-laki'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2.5 py-0.5 rounded text-xs font-black ${
                                        sc.score >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                      }`}>
                                        Skor: {sc.score} / 100
                                      </span>
                                      <span className="text-xs text-slate-400 font-medium">{sc.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed italic">
                                      "{narrative}"
                                    </p>
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  {session.peran === 'admin' ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => handleEditScore(sc)}
                                        title="Ganti / Edit Data Nilai (Khusus Administrator)"
                                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0d3b78] hover:text-blue-900 cursor-pointer transition shadow-xs"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteScore(sc)}
                                        title="Hapus Data Nilai (Khusus Administrator)"
                                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-800 cursor-pointer transition shadow-xs"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <span 
                                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100/90 px-2.5 py-1 rounded-md border border-slate-200"
                                      title="Hak akses hanya membaca/melihat nilai. Perubahan nilai murid hanya dapat dilakukan oleh Administrator."
                                    >
                                      <Lock className="w-3 h-3 text-slate-400" />
                                      Lihat Saja
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* MODAL UCAPAN "SYUKRON / TERIMA KASIH" 🙏 OVERLAY ANIMATION */}
                <AnimatePresence>
                  {showSyukronModal && lastSavedRecord && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                        className="bg-white rounded-3xl border border-amber-300/40 shadow-2xl overflow-hidden max-w-xl w-full text-center relative"
                      >
                        {/* Header Banner */}
                        <div className="bg-gradient-to-br from-[#0d3b78] via-indigo-900 to-[#0a2c5c] text-white p-8 relative overflow-hidden">
                          <button
                            onClick={() => setShowSyukronModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>

                          <div className="space-y-3 relative z-10">
                            {/* Animated Syukron Arabic Calligraphy / Hands */}
                            <motion.div
                              animate={{ scale: [1, 1.15, 1], rotate: [0, -3, 3, 0] }}
                              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                              className="text-5xl md:text-6xl text-amber-300 drop-shadow-md select-none py-1"
                            >
                              🙏
                            </motion.div>

                            <h3 className="text-3xl font-black text-amber-300 tracking-wide" style={{ fontFamily: "'Times New Roman', serif" }}>
                              شُكْرًا جَزِيْلًا
                            </h3>
                            <h4 className="text-xl font-extrabold text-white">
                              Syukron / Terima Kasih! 🙏
                            </h4>
                            <p className="text-xs text-sky-200 max-w-md mx-auto">
                              Evaluasi belajar telah diselesaikan. Data nilai siswa berhasil disimpan dan disinkronkan secara aman di sistem.
                            </p>
                          </div>
                        </div>

                        {/* Modal Body: Narrative Preview & Student Details */}
                        <div className="p-6 md:p-8 space-y-6 text-left">
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black uppercase tracking-wider text-[#0d3b78] flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Detail Data Siswa Terdaftar
                              </span>
                              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                                Skor: {lastSavedRecord.score} / 100
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px]">Nama Siswa:</span>
                                {lastSavedRecord.name}
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px]">Kelas:</span>
                                {lastSavedRecord.class}
                              </div>
                              <div>
                                <span className="text-slate-400 block font-semibold text-[10px]">Jenis Kelamin:</span>
                                {lastSavedRecord.gender || 'Laki-laki'}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Formatting Nilai Naratif pada Microsoft Excel:
                              </span>
                              <p className="text-xs font-medium text-slate-800 leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 italic">
                                "{lastSavedRecord.narrativeScore || getNarrativeScore(lastSavedRecord)}"
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons: Continue to Website / Evaluasi */}
                          <div className="space-y-2 pt-2">
                            <button
                              onClick={() => setShowSyukronModal(false)}
                              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0d3b78] to-indigo-700 hover:from-blue-900 hover:to-indigo-800 text-white font-black text-sm shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                            >
                              <span>Lanjutkan ke Website Fitur Evaluasi</span>
                              <ArrowRight className="w-4 h-4 text-amber-300" />
                            </button>

                            <button
                              onClick={() => exportScoresToExcel(localScores)}
                              className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-200"
                            >
                              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                              Unduh Rekap Microsoft Excel (.xlsx)
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* MODAL KONFIRMASI HAPUS DATA NILAI SISWA */}
                  {deletingRecord && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="bg-white rounded-3xl border border-rose-200 shadow-2xl overflow-hidden max-w-md w-full text-center relative p-6 space-y-5"
                      >
                        <div className="mx-auto w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-2xl shadow-inner">
                          <Trash2 className="w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-slate-900">
                            Konfirmasi Hapus Data Nilai
                          </h3>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            Apakah Anda yakin ingin menghapus permanen data nilai siswa <span className="font-black text-rose-600">"{deletingRecord.name}"</span> ({deletingRecord.class || 'Kelas 7A'})? Data yang dihapus tidak dapat dikembalikan.
                          </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setDeletingRecord(null)}
                            className="w-1/2 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={confirmDeleteRecord}
                            className="w-1/2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Trash2 className="w-4 h-4" />
                            Ya, Hapus Data
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

            {/* ================= 7. TAB: REFERENSI ================= */}
            {activeTab === 'referensi' && (
              <motion.div
                key="tab-referensi"
                layout="position"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#0d3b78] tracking-tight">Daftar Referensi Ilmiah</h2>
                  <p className="text-sm text-slate-600 font-semibold">Kumpulan rujukan buku saku, jurnal nasional, serta dokumen kurikulum tata bahasa Arab resmi.</p>
                </div>

                {/* Filter and search bar */}
                <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text" 
                      value={referensiSearch}
                      onChange={(e) => setReferensiSearch(e.target.value)}
                      placeholder="Cari judul, penulis, atau penerbit referensi..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-500 transition duration-150"
                    />
                  </div>
                  {referensiSearch && (
                    <button 
                      onClick={() => setReferensiSearch('')}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg text-sm font-bold transition cursor-pointer"
                    >
                      Bersihkan
                    </button>
                  )}
                </div>

                {/* Referensi Grid with High Contrast colorful indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredReferensi.map((ref) => {
                    const typeColor = 
                      ref.type === 'Buku' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                      ref.type === 'Jurnal' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      'bg-emerald-100 text-emerald-800 border-emerald-200';

                    return (
                      <div 
                        key={ref.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow transition duration-150 flex gap-4 items-start"
                      >
                        <div className="p-3 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                          <BookMarked className="w-5 h-5 text-[#0d3b78]" />
                        </div>

                        <div className="space-y-4 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-xs md:text-sm font-black uppercase px-3 py-1 rounded-md border ${typeColor}`}>
                              {ref.type}
                            </span>
                            <span className="text-sm font-mono font-black text-slate-500">{ref.year}</span>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-base sm:text-lg md:text-xl font-black text-[#0d3b78] leading-snug">
                              {ref.title}
                            </h3>
                            <p className="text-sm md:text-base text-slate-700 font-semibold">
                              Penulis: <span className="font-black text-slate-900">{ref.author}</span>
                            </p>
                          </div>

                          <p className="text-xs md:text-sm text-slate-500 font-bold">
                            Penerbit: {ref.publisher}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {filteredReferensi.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 text-sm font-semibold">
                      Tidak menemukan referensi yang cocok dengan kata pencarian Anda.
                    </div>
                  )}
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </motion.main>

      </div>

      {/* ARABIC ACCESSIBILITY FLOATING WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
        <AnimatePresence>
          {showFontSettings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.15 }}
              className="w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 space-y-4 text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black text-[#0d3b78] uppercase tracking-wider">Aksesibilitas Font Arab</h3>
                </div>
                <button
                  onClick={() => setShowFontSettings(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Font Family Selection */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pilih Model Tulisan (Font)</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'Traditional Arabic', name: 'Tradisional Arab' },
                    { id: 'Noto Naskh Arabic', name: 'Noto Naskh' },
                    { id: 'Amiri', name: 'Amiri (Klasik)' },
                    { id: 'Cairo', name: 'Cairo (Modern)' }
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setArabicFontFamily(font.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition text-center cursor-pointer ${
                        arabicFontFamily === font.id
                          ? 'border-[#0d3b78] bg-[#0d3b78]/5 text-[#0d3b78]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bold Toggle */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tebalkan Huruf (Bold)</span>
                <button
                  onClick={() => setIsArabicBold(!isArabicBold)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                    isArabicBold ? 'bg-[#0d3b78]' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    layout
                    className="bg-white w-4 h-4 rounded-full shadow-md"
                    animate={{ x: isArabicBold ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Dynamic Interactive Drag-to-Scale Component */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarik Naik/Turun (Ukuran)</span>
                  <span className="text-[11px] font-mono font-bold text-[#0d3b78] bg-blue-50 px-2 py-0.5 rounded">
                    Ukuran: {Math.round(arabicScale * 100)}%
                  </span>
                </div>

                <div className="flex gap-4 items-stretch h-44">
                  {/* Vertical Interactive Drag Track */}
                  <div 
                    className="w-16 bg-slate-50 rounded-2xl border border-slate-200/80 relative flex flex-col items-center justify-between py-2 select-none overflow-hidden"
                  >
                    {/* Background Progress Fill */}
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-amber-200/50 to-amber-300/40 rounded-b-2xl transition-all duration-75"
                      style={{ height: `${((arabicScale - 0.8) / 1.7) * 100}%` }}
                    />

                    {/* Up arrow */}
                    <button 
                      onClick={() => setArabicScale(prev => Math.min(2.5, Number((prev + 0.1).toFixed(2))))}
                      className="text-slate-400 hover:text-[#0d3b78] transition z-10 p-1 rounded-full hover:bg-white/80 cursor-pointer"
                      title="Perbesar (Tarik Atas)"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>

                    {/* The Drag Handle */}
                    <motion.div
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className={`w-11 h-11 rounded-full bg-[#0d3b78] text-white shadow-lg flex flex-col items-center justify-center cursor-ns-resize absolute left-2.5 z-20 select-none border-2 border-white transition-shadow ${
                        isDragging ? 'bg-[#ffb020] ring-4 ring-amber-500/20 shadow-xl scale-105' : 'hover:bg-[#1f6fe5]'
                      }`}
                      style={{
                        bottom: `calc(${((arabicScale - 0.8) / 1.7) * 78}% + 4px)`,
                        touchAction: 'none'
                      }}
                    >
                      <ChevronUp className="w-3.5 h-3.5 -mb-1" />
                      <span className="text-[9px] font-bold">{Math.round(arabicScale * 100)}%</span>
                      <ChevronDown className="w-3.5 h-3.5 -mt-1" />
                    </motion.div>

                    {/* Down arrow */}
                    <button 
                      onClick={() => setArabicScale(prev => Math.max(0.8, Number((prev - 0.1).toFixed(2))))}
                      className="text-slate-400 hover:text-[#0d3b78] transition z-10 p-1 rounded-full hover:bg-white/80 cursor-pointer"
                      title="Perkecil (Tarik Bawah)"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Real-time Word Preview Panel */}
                  <div className="flex-1 bg-slate-50 border border-slate-200/60 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
                    <span className="absolute top-1.5 left-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">Pratinjau Live:</span>
                    
                    <div className="w-full text-center py-2 px-1 flex items-center justify-center h-24 overflow-auto bg-white rounded-lg border border-slate-100 shadow-sm">
                      <p 
                        className="arabic text-[#0d3b78] select-none leading-normal transition-all"
                        style={{ 
                          fontFamily: arabicFontFamily, 
                          fontSize: `${18 * arabicScale}px`, 
                          fontWeight: isArabicBold ? 'bold' : 'normal' 
                        }}
                      >
                        الْقَوَاعِدُ الْعَرَبِيَّةُ
                      </p>
                    </div>

                    <p className="text-[9px] text-center text-slate-400 mt-2 font-medium">
                      Tarik tombol biru ke atas / bawah untuk melihat ukuran teks berubah secara elastis!
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions and Reset button */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Dapat diatur kapan saja</span>
                <button
                  onClick={() => {
                    setArabicScale(1.25);
                    setArabicFontFamily('Traditional Arabic');
                    setIsArabicBold(true);
                  }}
                  className="text-xs font-bold text-[#0d3b78] hover:underline cursor-pointer"
                >
                  Reset Aturan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Trigger Button */}
        <button
          onClick={() => setShowFontSettings(!showFontSettings)}
          className={`flex items-center gap-2 bg-[#0d3b78] hover:bg-[#1f6fe5] text-white font-extrabold text-xs px-5 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/25 ${
            showFontSettings ? 'ring-4 ring-blue-500/35 bg-[#1f6fe5]' : ''
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Aksesibilitas Font Arab (ع)</span>
          <span className="bg-amber-400 text-[#0d3b78] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
            {Math.round(arabicScale * 100)}%
          </span>
        </button>
      </div>

      {/* Elegant Custom In-Page Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] pointer-events-auto"
          >
            <div className={`p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur ${
              toast.type === 'success' 
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 ring-2 ring-emerald-500/10' 
                : toast.type === 'error'
                ? 'bg-rose-50/95 border-rose-200 text-rose-900 ring-2 ring-rose-500/10'
                : 'bg-blue-50/95 border-blue-200 text-blue-900 ring-2 ring-blue-500/10'
            }`}>
              {toast.type === 'success' ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
              ) : toast.type === 'error' ? (
                <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">!</div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">i</div>
              )}
              
              <div className="flex-1 text-xs md:text-sm font-extrabold leading-normal">
                {toast.text}
              </div>

              <button 
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-slate-600 transition p-0.5 rounded cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
