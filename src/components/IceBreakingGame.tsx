import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  HelpCircle as QuestionIcon,
  RefreshCw,
  Trophy,
  ArrowLeft,
  Lock,
  CloudLightning,
  Sparkle
} from 'lucide-react';
import { UserSession, StudentScore } from '../types';
import { saveStudentScore } from '../lib/firebase';

import kamarMandiImg from '../assets/images/kamar_mandi_1784131636660.jpg';
import kursiKelasImg from '../assets/images/kursi_kelas_1784131648895.jpg';
import papanTulisImg from '../assets/images/papan_tulis_1784131664239.jpg';

import selamatSoreImg from '../assets/images/selamat_sore_sapaan_1784133870814.jpg';
import terimaKasihImg from '../assets/images/terima_kasih_sapaan_1784133889376.jpg';
import selamatDatangImg from '../assets/images/selamat_datang_sapaan_1784133906371.jpg';
import sampaiJumpaImg from '../assets/images/sampai_jumpa_sapaan_1784133924902.jpg';

import pintuGameImg from '../assets/images/pintu_game_1784207825947.jpg';
import mejaGameImg from '../assets/images/meja_game_1784207839814.jpg';
import sekolahGameImg from '../assets/images/sekolah_game_1784207851435.jpg';
import pulpenGameImg from '../assets/images/pulpen_game_1784207862792.jpg';
import penggarisGameImg from '../assets/images/penggaris_game_1784207875119.jpg';

import samaSamaImg from '../assets/images/sama_sama_sapaan_1784210009079.jpg';
import siapaNamamuImg from '../assets/images/siapa_namamu_sapaan_1784210028431.jpg';
import bagaimanaKabarmuImg from '../assets/images/bagaimana_kabarmu_sapaan_1784210045327.jpg';
import selamatSiangImg from '../assets/images/selamat_siang_sapaan_1784210065284.jpg';
import selamatMalamImg from '../assets/images/selamat_malam_sapaan_1784210084588.jpg';

import pensilGameImg from '../assets/images/pensil_game_1784211295381.jpg';
import tasGameImg from '../assets/images/tas_game_1784211309434.jpg';
import penghapusGameImg from '../assets/images/penghapus_game_1784211320075.jpg';
import guruGameImg from '../assets/images/guru_game_1784211334794.jpg';
import muridGameImg from '../assets/images/murid_game_1784211347906.jpg';

import diaLakiLakiImg from '../assets/images/dia_laki_laki_game_1784212010095.jpg';
import diaPerempuanImg from '../assets/images/dia_perempuan_game_1784212023579.jpg';
import kamuLakiLakiImg from '../assets/images/kamu_laki_laki_game_1784212035728.jpg';
import kamuPerempuanImg from '../assets/images/kamu_perempuan_game_1784212047797.jpg';
import sayaImg from '../assets/images/saya_game_1784212061389.jpg';

// ================= TYPES & DATASETS =================

interface CardItem {
  id: string;
  text: string;
  type: 'arabic' | 'translation';
  pairId: string;
}

interface ImageGameItem {
  imageUrl: string;
  translation: string;
  arabic: string;
  pronunciation: string;
  options: string[]; // Arabic choices
  explanation?: string; // Detailed educational explanation
}

interface RiddleItem {
  clue: string;
  arabic: string;
  pronunciation: string;
  translation: string;
  options: { arabic: string; translation: string }[];
  explanation?: string; // Detailed educational explanation
}

// 1. DATASET FOR CARD MATCHING (TIPE 1)
const CARD_MATCHING_DATA: Record<string, { arabic: string; translation: string }[]> = {
  "1-1": [ // Al-Istifham
    { arabic: "مَنْ", translation: "Siapa" },
    { arabic: "مَا", translation: "Apa" },
    { arabic: "هَلْ", translation: "Apakah" },
    { arabic: "أَيْنَ", translation: "Di mana" },
    { arabic: "كَيْفَ", translation: "Bagaimana" }
  ],
  "2-3": [ // Isim Isyarah
    { arabic: "هَذَا", translation: "Ini (Laki-laki)" },
    { arabic: "هَذِهِ", translation: "Ini (Perempuan)" },
    { arabic: "ذَلِكَ", translation: "Itu (Laki-laki)" },
    { arabic: "تِلْكَ", translation: "Itu (Perempuan)" }
  ]
};

// 2. DATASET FOR GUESS IMAGE (TIPE 2) - DYNAMIC PER TEMA AS REQUESTED BY USER
const IMAGE_GAME_DATA: Record<string, ImageGameItem[]> = {
  "1-2": [ // Tata Bahasa Dua (Mubtada Khabar) -> "buku, kamar mandi, kelas, papan tulis, kursi"
    {
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      translation: "Buku",
      arabic: "كِتَابٌ",
      pronunciation: "Kitaabun",
      options: ["كِتَابٌ", "حَمَّامٌ", "فَصْلٌ", "كُرْسِيٌّ"],
      explanation: "كِتَابٌ (Kitaabun) berarti Buku. Kata ini tergolong isim mudzakkar (maskulin) karena tidak diakhiri huruf ta' marbuthah."
    },
    {
      imageUrl: kamarMandiImg,
      translation: "Kamar Mandi",
      arabic: "حَمَّامٌ",
      pronunciation: "Hammaamun",
      options: ["سَبُّوْرَةٌ", "حَمَّامٌ", "فَصْلٌ", "كِتَابٌ"],
      explanation: "حَمَّامٌ (Hammaamun) berarti Kamar Mandi. Merupakan kosakata tempat mudzakkar yang sering dijumpai di rumah maupun sekolah."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
      translation: "Kelas",
      arabic: "فَصْلٌ",
      pronunciation: "Faslun",
      options: ["كُرْسِيٌّ", "سَبُّوْرَةٌ", "فَصْلٌ", "كِتَابٌ"],
      explanation: "فَصْلٌ (Faslun) berarti Kelas. Merupakan ruangan utama yang digunakan siswa untuk belajar di sekolah."
    },
    {
      imageUrl: papanTulisImg,
      translation: "Papan Tulis",
      arabic: "سَبُّوْرَةٌ",
      pronunciation: "Sabbuuratun",
      options: ["سَبُّوْرَةٌ", "حَمَّامٌ", "كُرْسِيٌّ", "فَصْلٌ"],
      explanation: "سَبُّوْرَةٌ (Sabbuuratun) berarti Papan Tulis. Kata ini tergolong isim mu'annats (feminin) karena diakhiri huruf ta' marbuthah (ة)."
    },
    {
      imageUrl: kursiKelasImg,
      translation: "Kursi",
      arabic: "كُرْسِيٌّ",
      pronunciation: "Kursiyyun",
      options: ["كِتَابٌ", "حَمَّامٌ", "فَصْلٌ", "كُرْسِيٌّ"],
      explanation: "كُرْسِيٌّ (Kursiyyun) berarti Kursi. Termasuk kelompok kata benda benda tidak bernyawa (ghairu 'aqil) bergender mudzakkar."
    },
    {
      imageUrl: pulpenGameImg,
      translation: "Pena / Pulpen",
      arabic: "قَلَمٌ",
      pronunciation: "Qalamun",
      options: ["قَلَمٌ", "مِسْطَرَةٌ", "بَابٌ", "مَدْرَسَةٌ"],
      explanation: "قَلَمٌ (Qalamun) berarti Pena. Merupakan kata benda maskulin (mudzakkar) yang sangat penting untuk menulis pelajaran."
    },
    {
      imageUrl: penggarisGameImg,
      translation: "Penggaris",
      arabic: "مِسْطَرَةٌ",
      pronunciation: "Mistarotun",
      options: ["مِسْطَرَةٌ", "قَلَمٌ", "بَابٌ", "مَدْرَسَةٌ"],
      explanation: "مِسْطَرَةٌ (Mistarotun) berarti Penggaris. Kata ini tergolong isim mu'annats (feminin) karena diakhiri dengan huruf ta' marbuthah (ة)."
    },
    {
      imageUrl: mejaGameImg,
      translation: "Meja",
      arabic: "مَكْتَبٌ",
      pronunciation: "Maktabun",
      options: ["مَكْتَبٌ", "خِزَانَةٌ", "بَابٌ", "فَصْلٌ"],
      explanation: "مَكْتَبٌ (Maktabun) berarti Meja Tulis. Bentuk katanya adalah mudzakkar (maskulin) dan berasal dari akar kata 'kataba' (menulis)."
    },
    {
      imageUrl: sekolahGameImg,
      translation: "Sekolah",
      arabic: "مَدْرَسَةٌ",
      pronunciation: "Madrasatun",
      options: ["مَدْرَسَةٌ", "فَصْلٌ", "مَكْتَبٌ", "حَمَّامٌ"],
      explanation: "مَدْرَسَةٌ (Madrasatun) berarti Sekolah. Tempat menuntut ilmu yang tergolong isim mu'annats (feminin)."
    },
    {
      imageUrl: pintuGameImg,
      translation: "Pintu",
      arabic: "بَابٌ",
      pronunciation: "Baabun",
      options: ["بَابٌ", "مَكْتَبٌ", "خِزَانَةٌ", "فَصْلٌ"],
      explanation: "بَابٌ (Baabun) berarti Pintu. Kata benda ini bertipe mudzakkar (maskulin) karena tidak diakhiri huruf ta' marbuthah."
    }
  ],
  "1-3": [ // Qoidah Tahiyyah -> "greetings/sapaan"
    {
      imageUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=600&q=80",
      translation: "Selamat Pagi",
      arabic: "صَبَاحُ الْخَيْرِ",
      pronunciation: "Shobaahul khair",
      options: ["صَبَاحُ الْخَيْرِ", "مَسَاءُ الْخَيْرِ", "أَهْلًا وَسَهْلًا", "شُكْرًا"],
      explanation: "صَبَاحُ الْخَيْرِ (Shobaahul khair) adalah ucapan selamat pagi. Kalimat ini lazim direspon dengan ucapan 'صَبَاحُ النُّوْرِ' (Shobaahun nuur)."
    },
    {
      imageUrl: selamatSoreImg,
      translation: "Selamat Sore",
      arabic: "مَسَاءُ الْخَيْرِ",
      pronunciation: "Masaa-ul khair",
      options: ["مَسَاءُ الْخَيْرِ", "صَبَاحُ الْخَيْرِ", "أَهْلًا وَسَهْلًا", "شُكْرًا"],
      explanation: "مَسَاءُ الْخَيْرِ (Masaa-ul khair) adalah ucapan selamat sore. Kalimat ini dijawab dengan ucapan 'مَسَاءُ النُّوْرِ' (Masaa-un nuur)."
    },
    {
      imageUrl: terimaKasihImg,
      translation: "Terima Kasih",
      arabic: "شُكْرًا",
      pronunciation: "Syukran",
      options: ["شُكْرًا", "عَفْوًا", "أَهْلًا وَسَهْلًا", "إِلَى اللِّقَاءِ"],
      explanation: "شُكْرًا (Syukran) berarti Terima Kasih. Sapaan ini dijawab dengan ucapan santun 'عَفْوًا' ('Afwan) yang berarti sama-sama."
    },
    {
      imageUrl: selamatDatangImg,
      translation: "Selamat Datang",
      arabic: "أَهْلًا وَسَهْلًا",
      pronunciation: "Ahlan wa sahlan",
      options: ["أَهْلًا وَسَهْلًا", "إِلَى اللِّقَاءِ", "مَعَ السَّلَامَةِ", "صَبَاحُ الْخَيْرِ"],
      explanation: "أَهْلًا وَسَهْلًا (Ahlan wa sahlan) berarti Selamat Datang. Kalimat sapaan selamat datang ini direspon dengan 'أَهْلًا بِكَ' (Ahlan bika) untuk menyapa balik lawan bicara laki-laki."
    },
    {
      imageUrl: sampaiJumpaImg,
      translation: "Sampai Jumpa",
      arabic: "إِلَى اللِّقَاءِ",
      pronunciation: "Ilaal-liqoo'",
      options: ["إِلَى اللِّقَاءِ", "أَهْلًا وَسَهْلًا", "شُكْرًا", "عَفْوًا"],
      explanation: "إِلَى اللِّقَاءِ (Ilaal-liqoo') berarti Sampai Jumpa. Ucapan perpisahan sementara ini direspon dengan ucapan 'مَعَ السَّلَامَةِ' (Ma'as salaamah) yang mendoakan keselamatan."
    },
    {
      imageUrl: bagaimanaKabarmuImg,
      translation: "Bagaimana Kabarmu?",
      arabic: "كَيْفَ حَالُكَ؟",
      pronunciation: "Kayfa haaluka?",
      options: ["كَيْفَ حَالُكَ؟", "مَا اسْمُكَ؟", "شُكْرًا", "أَهْلًا وَسَهْلًا"],
      explanation: "كَيْفَ حَالُكَ؟ (Kayfa haaluka?) digunakan untuk menanyakan kabar lawan bicara laki-laki. Jika perempuan, harakatnya kasrah: 'كَيْفَ حَالُكِ؟'."
    },
    {
      imageUrl: selamatSiangImg,
      translation: "Selamat Siang",
      arabic: "نَهَارُكَ سَعِيْدٌ",
      pronunciation: "Nahaaruka sa'iidun",
      options: ["نَهَارُكَ سَعِيْدٌ", "صَبَاحُ الْخَيْرِ", "لَيْلَتُكَ سَعِيْدَةٌ", "مَسَاءُ الْخَيْرِ"],
      explanation: "نَهَارُكَ سَعِيْدٌ (Nahaaruka sa'iidun) diucapkan pada siang hari, dan dijawab dengan ucapan 'سَعِيْدٌ مُبَارَكٌ' (Sa'iidun mubaarakun)."
    },
    {
      imageUrl: selamatMalamImg,
      translation: "Selamat Malam",
      arabic: "لَيْلَتُكَ سَعِيْدَةٌ",
      pronunciation: "Laylatuka sa'iidatun",
      options: ["لَيْلَتُكَ سَعِيْدَةٌ", "نَهَارُكَ سَعِيْدٌ", "صَبَاحُ الْخَيْرِ", "إِلَى اللِّقَاءِ"],
      explanation: "لَيْلَتُكَ سَعِيْدَةٌ (Laylatuka sa'iidatun) diucapkan pada malam hari, dan dijawab dengan ucapan 'سَعِيْدَةٌ مُبَارَكَةٌ' (Sa'iidun mubaarakatun)."
    },
    {
      imageUrl: siapaNamamuImg,
      translation: "Siapa Namamu?",
      arabic: "مَا اسْمُكَ؟",
      pronunciation: "Mas muka?",
      options: ["مَا اسْمُكَ؟", "كَيْفَ حَالُكَ؟", "مِنْ أَيْنَ أَنْتَ؟", "أَهْلًا وَسَهْلًا"],
      explanation: "مَا اسْمُكَ؟ (Mas muka?) digunakan untuk menanyakan nama lawan bicara laki-laki. Responnya adalah 'اِسْمِي...' (Namaku...)."
    },
    {
      imageUrl: samaSamaImg,
      translation: "Sama-sama",
      arabic: "عَفْوًا",
      pronunciation: "Afwan",
      options: ["عَفْوًا", "شُكْرًا", "أَهْلًا بِكَ", "مَعَ السَّلَامَةِ"],
      explanation: "عَفْوًا ('Afwan) diucapkan sebagai respon santun untuk membalas ucapan terima kasih 'شُكْرًا' (Syukran)."
    }
  ],
  "1-4": [ // Tata Bahasa Tiga (Isim Dhamir) -> "guru, siswa, penghapus, pensil, tas"
    {
      imageUrl: guruGameImg,
      translation: "Guru",
      arabic: "أُسْتَاذٌ",
      pronunciation: "Ustadzun",
      options: ["أُسْتَاذٌ", "تِلْمِيْذٌ", "مِمْسَحَةٌ", "حَقِيْبَةٌ"],
      explanation: "أُسْتَاذٌ (Ustadzun) berarti Guru (Laki-laki). Jika guru perempuan, bentuk katanya diubah menjadi 'أُسْتَاذَةٌ' (Ustadzatun) dengan huruf akhiran ta' marbuthah."
    },
    {
      imageUrl: muridGameImg,
      translation: "Siswa",
      arabic: "تِلْمِيْذٌ",
      pronunciation: "Tilmiidzhun",
      options: ["قَلَمُ الرَّصَاصِ", "تِلْمِيْذٌ", "أُسْتَاذٌ", "حَقِيْبَةٌ"],
      explanation: "تِلْمِيْذٌ (Tilmiidzhun) berarti Siswa / Murid (Laki-laki). Jika siswa perempuan (siswi), bentuk katanya diubah menjadi 'تِلْمِيْذَةٌ' (Tilmiidzatun)."
    },
    {
      imageUrl: penghapusGameImg,
      translation: "Penghapus",
      arabic: "مِمْسَحَةٌ",
      pronunciation: "Mimsahatun",
      options: ["مِمْسَحَةٌ", "تِلْمِيْذٌ", "قَلَمُ الرَّصَاصِ", "حَقِيْبَةٌ"],
      explanation: "مِمْسَحَةٌ (Mimsahatun) berarti Penghapus Papan Tulis. Tergolong sebagai isim mu'annats (feminin) karena memiliki akhiran ta' marbuthah."
    },
    {
      imageUrl: pensilGameImg,
      translation: "Pensil",
      arabic: "قَلَمُ الرَّصَاصِ",
      pronunciation: "Qalamur-rasaashi",
      options: ["أُسْتَاذٌ", "قَلَمُ الرَّصَاصِ", "مِمْسَحَةٌ", "حَقِيْبَةٌ"],
      explanation: "قَلَمُ الرَّصَاصِ (Qalamur-rasaashi) berarti Pensil Tulis. Merupakan idhofah (gabungan kata) dari 'Qalam' (Pena) dan 'Ar-Rasaash' (Timbal/Grafit)."
    },
    {
      imageUrl: tasGameImg,
      translation: "Tas",
      arabic: "حَقِيْبَةٌ",
      pronunciation: "Haqiibatun",
      options: ["حَقِيْبَةٌ", "تِلْمِيْذٌ", "مِمْسَحَةٌ", "قَلَمُ الرَّصَاصِ"],
      explanation: "حَقِيْبَةٌ (Haqiibatun) berarti Tas Sekolah. Tergolong sebagai kata benda bergender mu'annats (feminin)."
    },
    {
      imageUrl: diaLakiLakiImg,
      translation: "Dia (Laki-laki)",
      arabic: "هُوَ",
      pronunciation: "Huwa",
      options: ["هُوَ", "هِيَ", "أَنْتَ", "أَنَا"],
      explanation: "هُوَ (Huwa) adalah kata ganti ketiga tunggal (isim dhamir ghaib) untuk laki-laki (mudzakkar)."
    },
    {
      imageUrl: diaPerempuanImg,
      translation: "Dia (Perempuan)",
      arabic: "هِيَ",
      pronunciation: "Hiya",
      options: ["هِيَ", "هُوَ", "أَنْتِ", "أَنَا"],
      explanation: "هِيَ (Hiya) adalah kata ganti ketiga tunggal (isim dhamir ghaibah) untuk perempuan (mu'annats)."
    },
    {
      imageUrl: kamuLakiLakiImg,
      translation: "Kamu (Laki-laki)",
      arabic: "أَنْتَ",
      pronunciation: "Anta",
      options: ["أَنْتَ", "أَنْتِ", "أَنَا", "هُوَ"],
      explanation: "أَنْتَ (Anta) adalah kata ganti kedua tunggal (isim dhamir mukhatab) untuk lawan bicara laki-laki (mudzakkar)."
    },
    {
      imageUrl: kamuPerempuanImg,
      translation: "Kamu (Perempuan)",
      arabic: "أَنْتِ",
      pronunciation: "Anti",
      options: ["أَنْتِ", "أَنْتَ", "أَنَا", "هِيَ"],
      explanation: "أَنْتِ (Anti) adalah kata ganti kedua tunggal (isim dhamir mukhatabah) untuk lawan bicara perempuan (mu'annats)."
    },
    {
      imageUrl: sayaImg,
      translation: "Saya",
      arabic: "أَنَا",
      pronunciation: "Ana",
      options: ["أَنَا", "أَنْتَ", "أَنْتِ", "هُوَ"],
      explanation: "أَنَا (Ana) adalah kata ganti pertama tunggal (isim dhamir mutakallim) yang bersifat netral, dapat digunakan oleh laki-laki maupun perempuan."
    }
  ],
  "2-101": [ // Bab 2 Materi 1 (Isim Isyarah) -> "Ayah, Ibu, Lapangan, Guru P-R, Insinyur"
    {
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      translation: "Ini Ayahku",
      arabic: "هَذَا أَبِيْ",
      pronunciation: "Haadzaa abii",
      options: ["هَذَا أَبِيْ", "تِلْكَ أُمِّيْ", "ذَلِكَ مَلْعَبٌ", "هَذَا مُهَنْدِسٌ"],
      explanation: "هَذَا أَبِيْ (Haadzaa abii) berarti 'Ini adalah ayahku'. Menggunakan kata tunjuk dekat mudzakkar 'هَذَا' karena ayah (أَبِيْ) bergender laki-laki."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      translation: "Itu Ibuku",
      arabic: "تِلْكَ أُمِّيْ",
      pronunciation: "Tilka ummii",
      options: ["هَذِهِ أُمِّيْ", "تِلْكَ أُمِّيْ", "هَذَا أَبِيْ", "ذَلِكَ مَلْعَبٌ"],
      explanation: "تِلْكَ أُمِّيْ (Tilka ummii) berarti 'Itu adalah ibuku'. Menggunakan kata tunjuk jauh mu'annats 'تِلْكَ' karena ibu (أُمِّيْ) bergender perempuan."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1589487390363-ac145139af45?auto=format&fit=crop&w=600&q=80",
      translation: "Itu Lapangan",
      arabic: "ذَلِكَ مَلْعَبٌ",
      pronunciation: "Dzaalika mal'abun",
      options: ["هَذَا أَبِيْ", "ذَلِكَ مَلْعَبٌ", "تِلْكَ أُمِّيْ", "هَذِهِ مُعَلِّمَةٌ"],
      explanation: "ذَلِكَ مَلْعَبٌ (Dzaalika mal'abun) berarti 'Itu adalah lapangan'. Menggunakan kata tunjuk jauh mudzakkar 'ذَلِكَ' karena 'مَلْعَبٌ' (lapangan) adalah isim mudzakkar."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&w=600&q=80",
      translation: "Ini Guru Perempuan",
      arabic: "هَذِهِ مُعَلِّمَةٌ",
      pronunciation: "Haadzihi mu'allimatun",
      options: ["هَذَا أَبِيْ", "هَذِهِ مُعَلِّمَةٌ", "هَذَا مُهَنْدِسٌ", "تِلْكَ أُمِّيْ"],
      explanation: "هَذِهِ مُعَلِّمَةٌ (Haadzihi mu'allimatun) berarti 'Ini adalah guru perempuan'. Menggunakan kata tunjuk dekat mu'annats 'هَذِهِ' karena guru perempuan ('مُعَلِّمَةٌ') adalah perempuan."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
      translation: "Ini Insinyur / Arsitek",
      arabic: "هَذَا مُهَنْدِسٌ",
      pronunciation: "Haadzaa muhandisun",
      options: ["هَذَا مُهَنْدِسٌ", "هَذِهِ مُعَلِّمَةٌ", "ذَلِكَ مَلْعَبٌ", "تِلْكَ أُمِّيْ"],
      explanation: "هَذَا مُهَنْدِسٌ (Haadzaa muhandisun) berarti 'Ini adalah seorang insinyur/arsitek (laki-laki)'. Menggunakan kata tunjuk dekat mudzakkar 'هَذَا'."
    }
  ]
};

// 2.4 DATASET FOR CARD MATCHING CHAPTER 1 MULTI-LEVEL (LEVELS 1, 2, 3)
const CARD_MATCHING_BAB1_LEVELS: Record<1 | 2 | 3, { arabic: string; translation: string }[]> = {
  1: [ // Level 1: Mudah (Kata Tanya Dasar)
    { arabic: "مَنْ", translation: "Siapa" },
    { arabic: "مَا", translation: "Apa" },
    { arabic: "هَلْ", translation: "Apakah" },
    { arabic: "أَيْنَ", translation: "Di mana" },
    { arabic: "كَيْفَ", translation: "Bagaimana" }
  ],
  2: [ // Level 2: Sedang (Kata Tanya + Kata Ganti / Isim Isyarah)
    { arabic: "مَنْ أَنْتَ؟", translation: "Siapa kamu (Laki-laki)?" },
    { arabic: "مَا هَذَا؟", translation: "Apa ini (Laki-laki)?" },
    { arabic: "كَيْفَ حَالُكَ؟", translation: "Bagaimana kabarmu?" },
    { arabic: "مِنْ أَيْنَ أَنْتَ؟", translation: "Dari mana kamu? (Laki-laki)" },
    { arabic: "هَلْ أَنْتَ طَالِبٌ؟", translation: "Apakah kamu siswa?" }
  ],
  3: [ // Level 3: Tinggi (Kata Tanya + Kalimat Lengkap / Percakapan)
    { arabic: "مَنْ هَذَا الصَّدِيْقُ؟", translation: "Siapa teman ini?" },
    { arabic: "مَا هَذِهِ الْكُرَّاسَةُ؟", translation: "Apa buku tulis ini?" },
    { arabic: "كَيْفَ نَجَحْتَ فِي الْإِمْتِحَانِ؟", translation: "Bagaimana kamu lulus ujian?" },
    { arabic: "مِنْ أَيْنَ جِئْتَ يَا أَخِيْ؟", translation: "Dari mana kamu datang wahai saudaraku?" },
    { arabic: "هَلْ هَذِهِ مَدْرَسَتُكَ؟", translation: "Apakah ini sekolahmu?" }
  ]
};

// 2.5 DATASET FOR CARD MATCHING CHAPTER 2 MULTI-LEVEL (LEVELS 1, 2, 3)
const CARD_MATCHING_BAB2_LEVELS: Record<1 | 2 | 3, { arabic: string; translation: string }[]> = {
  1: [ // Level 1: Mudah (10 pasang kata tunjuk dasar + kata benda sederhana)
    { arabic: "هَذَا", translation: "Ini (Laki-laki)" },
    { arabic: "هَذِهِ", translation: "Ini (Perempuan)" },
    { arabic: "ذَلِكَ", translation: "Itu (Laki-laki)" },
    { arabic: "تِلْكَ", translation: "Itu (Perempuan)" },
    { arabic: "هَذَا بَيْتٌ", translation: "Ini Rumah" },
    { arabic: "هَذِهِ مَدْرَسَةٌ", translation: "Ini Sekolah" },
    { arabic: "ذَلِكَ كِتَابٌ", translation: "Itu Buku" },
    { arabic: "تِلْكَ سَبُّوْرَةٌ", translation: "Itu Papan Tulis" },
    { arabic: "هَذَا قَلَمٌ", translation: "Ini Pulpen" },
    { arabic: "هَذِهِ مِسْطَرَةٌ", translation: "Ini Penggaris" }
  ],
  2: [ // Level 2: Sedang (10 pasang kata tunjuk + keluarga/teman)
    { arabic: "هَذَا أَبِيْ", translation: "Ini Ayahku" },
    { arabic: "هَذِهِ أُمِّيْ", translation: "Ini Ibuku" },
    { arabic: "ذَلِكَ صَدِيْقِيْ", translation: "Itu Temanku (Laki-laki)" },
    { arabic: "تِلْكَ صَدِيْقَتِيْ", translation: "Itu Temanku (Perempuan)" },
    { arabic: "هَذَا أُسْتَاذٌ", translation: "Ini Guru Laki-laki" },
    { arabic: "هَذِهِ أُسْتَاذَةٌ", translation: "Ini Guru Perempuan" },
    { arabic: "ذَلِكَ تِلْمِيْذٌ", translation: "Itu Siswa Laki-laki" },
    { arabic: "تِلْكَ تِلْمِيْذَةٌ", translation: "Itu Siswi Perempuan" },
    { arabic: "هَذَا أَخِيْ", translation: "Ini Saudaraku" },
    { arabic: "هَذِهِ أُخْتِيْ", translation: "Ini Saudariku" }
  ],
  3: [ // Level 3: Susah (10 pasang kata tunjuk + kalimat lengkap/profesi)
    { arabic: "هَذَا مُهَنْدِسٌ", translation: "Ini Insinyur (Laki-laki)" },
    { arabic: "هَذِهِ مُعَلِّمَةٌ", translation: "Ini Guru Perempuan" },
    { arabic: "ذَلِكَ مَلْعَبٌ", translation: "Itu Lapangan" },
    { arabic: "هَذَا طَالِبٌ", translation: "Ini Siswa (Laki-laki)" },
    { arabic: "تِلْكَ طَالِبَةٌ", translation: "Itu Siswi (Perempuan)" },
    { arabic: "هَذِهِ طَبِيْبَةٌ", translation: "Ini Dokter Perempuan" },
    { arabic: "ذَلِكَ طَبِيْبٌ", translation: "Itu Dokter Laki-laki" },
    { arabic: "هَذَا مُوَظَّفٌ", translation: "Ini Karyawan (Laki-laki)" },
    { arabic: "تِلْكَ مُوَظَّفَةٌ", translation: "Itu Karyawati (Perempuan)" },
    { arabic: "ذَلِكَ بَابٌ كَبِيْرٌ", translation: "Itu Pintu yang Besar" }
  ]
};

// 3. DATASET FOR RIDDLES (TIPE 3)
const RIDDLE_DATA: Record<string, RiddleItem[]> = {
  "1-5": [ // Ad-Dhomir (Kata Ganti Tunggal)
    {
      clue: "Aku digunakan ketika kamu ingin menunjuk dirimu sendiri yang sedang berbicara kepada orang lain. Siapa aku?",
      arabic: "أَنَا",
      pronunciation: "Ana",
      translation: "Saya",
      options: [
        { arabic: "أَنَا", translation: "Saya" },
        { arabic: "أَنْتَ", translation: "Kamu (Laki-laki)" },
        { arabic: "هُوَ", translation: "Dia (Laki-laki)" },
        { arabic: "هِيَ", translation: "Dia (Perempuan)" }
      ],
      explanation: "أَنَا (Ana) adalah dhomir mutakallim tunggal (kata ganti orang pertama) yang bersifat netral, dapat digunakan oleh laki-laki maupun perempuan."
    },
    {
      clue: "Kamu sedang berbicara dengan seorang teman laki-laki tepat di hadapanmu. Kata ganti apa yang kamu gunakan untuk menyapanya?",
      arabic: "أَنْتَ",
      pronunciation: "Anta",
      translation: "Kamu (Laki-laki)",
      options: [
        { arabic: "أَنْتَ", translation: "Kamu (Laki-laki)" },
        { arabic: "أَنْتِ", translation: "Kamu (Perempuan)" },
        { arabic: "أَنَا", translation: "Saya" },
        { arabic: "هِيَ", translation: "Dia (Perempuan)" }
      ],
      explanation: "أَنْتَ (Anta) adalah dhomir mukhotob tunggal (kata ganti orang kedua laki-laki) untuk menunjuk satu orang lawan bicara laki-laki."
    },
    {
      clue: "Kamu sedang berbicara dengan seorang teman perempuan tepat di hadapanmu. Kata ganti apa yang cocok untuk memanggilnya?",
      arabic: "أَنْتِ",
      pronunciation: "Anti",
      translation: "Kamu (Perempuan)",
      options: [
        { arabic: "أَنْتِ", translation: "Kamu (Perempuan)" },
        { arabic: "أَنْتَ", translation: "Kamu (Laki-laki)" },
        { arabic: "هُوَ", translation: "Dia (Laki-laki)" },
        { arabic: "أَنَا", translation: "Saya" }
      ],
      explanation: "أَنْتِ (Anti) adalah dhomir mukhotobah tunggal (kata ganti orang kedua perempuan) untuk menunjuk satu orang lawan bicara perempuan."
    },
    {
      clue: "Kamu menceritakan seorang guru laki-laki yang sedang tidak hadir di dalam kelas. Kata ganti orang ketiga apa yang digunakan?",
      arabic: "هُوَ",
      pronunciation: "Huwa",
      translation: "Dia (Laki-laki)",
      options: [
        { arabic: "هُوَ", translation: "Dia (Laki-laki)" },
        { arabic: "هِيَ", translation: "Dia (Perempuan)" },
        { arabic: "أَنْتَ", translation: "Kamu (Laki-laki)" },
        { arabic: "أَنَا", translation: "Saya" }
      ],
      explanation: "هُوَ (Huwa) adalah dhomir ghoib tunggal (kata ganti orang ketiga tunggal laki-laki) untuk menunjuk laki-laki yang sedang dibicarakan."
    },
    {
      clue: "Kamu sedang menceritakan seorang siswi perempuan yang rajin dan tidak sedang bersama kamu. Kata ganti orang ketiga apa yang digunakan?",
      arabic: "هِيَ",
      pronunciation: "Hiya",
      translation: "Dia (Perempuan)",
      options: [
        { arabic: "هِيَ", translation: "Dia (Perempuan)" },
        { arabic: "هُوَ", translation: "Dia (Laki-laki)" },
        { arabic: "أَنْتِ", translation: "Kamu (Perempuan)" },
        { arabic: "أَنَا", translation: "Saya" }
      ],
      explanation: "هِيَ (Hiya) adalah dhomir ghoibah tunggal (kata ganti orang ketiga tunggal perempuan) untuk menunjuk perempuan yang sedang dibicarakan."
    }
  ],
  "2-2": [ // Al-Mubtada' wa Al-Khobar (Zharaf Makan)
    {
      clue: "Aku adalah arah di mana kamu meletakkan peci di atas kepalamu, atau lampu gantung mewah yang menempel di langit-langit kamar. Posisi apakah aku?",
      arabic: "فَوْقَ",
      pronunciation: "Fawqa",
      translation: "Di atas",
      options: [
        { arabic: "فَوْقَ", translation: "Di atas" },
        { arabic: "تَحْتَ", translation: "Di bawah" },
        { arabic: "أَمَامَ", translation: "Di depan" },
        { arabic: "خَلْفَ", translation: "Di belakang" }
      ],
      explanation: "فَوْقَ (Fawqa) berarti di atas (biasanya menempel atau berada di atas tanpa batas langsung secara vertikal)."
    },
    {
      clue: "Aku adalah posisi sandal yang kamu letakkan sebelum masuk rumah, atau karpet lembut yang sedang dipijak oleh telapak kakimu. Posisi apakah aku?",
      arabic: "تَحْتَ",
      pronunciation: "Tahta",
      translation: "Di bawah",
      options: [
        { arabic: "تَحْتَ", translation: "Di bawah" },
        { arabic: "فَوْقَ", translation: "Di atas" },
        { arabic: "أَمَامَ", translation: "Di depan" },
        { arabic: "خَلْفَ", translation: "Di belakang" }
      ],
      explanation: "تَحْتَ (Tahta) berarti di bawah (posisi yang berada di bagian bawah dari suatu benda)."
    },
    {
      clue: "Seorang imam yang memimpin shalat berjamaah di masjid selalu berdiri paling depan membelakangi para makmum. Di manakah posisinya?",
      arabic: "أَمَامَ",
      pronunciation: "Amaama",
      translation: "Di depan",
      options: [
        { arabic: "أَمَامَ", translation: "Di depan" },
        { arabic: "خَلْفَ", translation: "Di belakang" },
        { arabic: "فَوْقَ", translation: "Di atas" },
        { arabic: "تَحْتَ", translation: "Di bawah" }
      ],
      explanation: "أَمَامَ (Amaama) berarti di depan. Digunakan untuk menunjuk arah hadapan suatu benda."
    },
    {
      clue: "Papan tulis berada di depan kelas menghadap siswa, sedangkan lemari buku besar diletakkan di bagian paling belakang kelas. Di manakah posisi lemari?",
      arabic: "خَلْفَ",
      pronunciation: "Khalfa",
      translation: "Di belakang",
      options: [
        { arabic: "خَلْفَ", translation: "Di belakang" },
        { arabic: "أَمَامَ", translation: "Di depan" },
        { arabic: "فَوْقَ", translation: "Di atas" },
        { arabic: "تَحْتَ", translation: "Di bawah" }
      ],
      explanation: "خَلْفَ (Khalfa) berarti di belakang. Digunakan untuk menunjuk arah belakang dari suatu acuan."
    },
    {
      clue: "Ketika kamu duduk bersebelahan di kelas dengan sahabat baikmu, ia berada tepat di sebelah kanan atau kirimu. Posisi apakah aku?",
      arabic: "جَانِبَ",
      pronunciation: "Jaaniba",
      translation: "Di samping",
      options: [
        { arabic: "جَانِبَ", translation: "Di samping" },
        { arabic: "فَوْقَ", translation: "Di atas" },
        { arabic: "تَحْتَ", translation: "Di bawah" },
        { arabic: "خَلْفَ", translation: "Di belakang" }
      ],
      explanation: "جَانِبَ (Jaaniba) berarti di samping atau di sisi sebelah kiri/kanan dari suatu benda."
    }
  ]
};

// ================= INTERACTIVE Fallback Vector Illustrations =================
const ActivityIllustration: React.FC<{ activity: string; className?: string }> = ({ activity, className = "" }) => {
  const norm = activity.toLowerCase().trim();

  if (norm === "makan pagi / sarapan") {
    return (
      <svg className={`w-full h-full text-amber-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#FFFBEB"/>
        {/* Plate */}
        <circle cx="50" cy="55" r="28" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3"/>
        <circle cx="50" cy="55" r="20" fill="#FFFFFF"/>
        {/* Fork */}
        <path d="M32 40V55M29 40H35M29 40V46M35 40V46M32 55V68" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Spoon */}
        <path d="M68 68V55M68 55C71 55 73 50 73 45C73 40 68 40 68 40C68 40 63 40 63 45C63 50 65 55 68 55Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
        {/* Food (Egg) */}
        <circle cx="50" cy="55" r="10" fill="#FEF08A"/>
        <circle cx="48" cy="53" r="4" fill="#F59E0B"/>
        {/* Steam */}
        <path d="M44 24C44 20 48 20 48 16" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M52 26C52 22 56 22 56 18" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M60 25C60 21 64 21 64 17" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (norm === "membaca buku" || norm === "buku") {
    return (
      <svg className={`w-full h-full text-indigo-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#EFF6FF"/>
        {/* Open Book Pages */}
        <path d="M50 72C40 72 20 66 20 66V26C20 26 40 32 50 32C60 32 80 26 80 26V66C80 66 60 72 50 72Z" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="3" strokeLinejoin="round"/>
        {/* Book Spine */}
        <line x1="50" y1="32" x2="50" y2="72" stroke="#1D4ED8" strokeWidth="3"/>
        {/* Left Page Lines */}
        <line x1="28" y1="38" x2="42" y2="41" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="46" x2="42" y2="49" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="54" x2="42" y2="57" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
        {/* Right Page Lines */}
        <line x1="58" y1="41" x2="72" y2="38" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
        <line x1="58" y1="49" x2="72" y2="46" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
        <line x1="58" y1="57" x2="72" y2="54" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
        {/* Sparkles */}
        <path d="M50 12L52 18L58 20L52 22L50 28L48 22L42 20L48 18L50 12Z" fill="#F59E0B"/>
      </svg>
    );
  }
  if (norm === "menulis pelajaran") {
    return (
      <svg className={`w-full h-full text-blue-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#EFF6FF"/>
        {/* Notebook */}
        <rect x="25" y="20" width="45" height="58" rx="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3"/>
        {/* Coils */}
        <circle cx="25" cy="28" r="3" fill="#1E40AF"/>
        <circle cx="25" cy="40" r="3" fill="#1E40AF"/>
        <circle cx="25" cy="52" r="3" fill="#1E40AF"/>
        <circle cx="25" cy="64" r="3" fill="#1E40AF"/>
        {/* Lines */}
        <line x1="34" y1="32" x2="62" y2="32" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
        <line x1="34" y1="44" x2="62" y2="44" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
        <line x1="34" y1="56" x2="62" y2="56" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
        {/* Pencil */}
        <g transform="rotate(45 55 55)">
          <rect x="52" y="15" width="8" height="35" fill="#F59E0B" rx="1"/>
          <path d="M52 15L56 7L60 15H52Z" fill="#FEC831"/>
          <path d="M54 11L56 7L58 11H54Z" fill="#1E293B"/>
          <rect x="52" y="46" width="8" height="4" fill="#FDA4AF"/>
        </g>
      </svg>
    );
  }
  if (norm === "pergi ke sekolah") {
    return (
      <svg className={`w-full h-full text-emerald-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#ECFDF5"/>
        {/* School Building */}
        <path d="M20 75V45L50 25L80 45V75H20Z" fill="#FFFFFF" stroke="#059669" strokeWidth="3"/>
        {/* Door */}
        <rect x="42" y="55" width="16" height="20" rx="2" fill="#059669"/>
        <circle cx="46" cy="65" r="1.5" fill="#FFFFFF"/>
        {/* Windows */}
        <rect x="28" y="48" width="10" height="10" rx="1" fill="#A7F3D0" stroke="#059669" strokeWidth="2"/>
        <rect x="62" y="48" width="10" height="10" rx="1" fill="#A7F3D0" stroke="#059669" strokeWidth="2"/>
        {/* Roof Clock */}
        <circle cx="50" cy="40" r="7" fill="#F9FAFB" stroke="#059669" strokeWidth="2"/>
        <line x1="50" y1="40" x2="50" y2="36" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="50" y1="40" x2="53" y2="40" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Ground */}
        <line x1="12" y1="75" x2="88" y2="75" stroke="#059669" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    );
  }
  if (norm === "tidur lelap di kasur") {
    return (
      <svg className={`w-full h-full text-purple-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#F3E8FF"/>
        {/* Bed Frame */}
        <rect x="15" y="50" width="70" height="18" rx="2" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="3"/>
        <line x1="18" y1="68" x2="18" y2="78" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round"/>
        <line x1="82" y1="68" x2="82" y2="78" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round"/>
        {/* Pillow */}
        <rect x="18" y="42" width="16" height="10" rx="2" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="2"/>
        {/* Blanket */}
        <path d="M34 46H82V67H34V46Z" fill="#C084FC" stroke="#7C3AED" strokeWidth="2"/>
        {/* Crescent Moon */}
        <path d="M72 15C64 15 60 21 60 27C60 34 66 38 73 38C71 35 70 31 71 27C72 22 75 18 78 16C76 15 74 15 72 15Z" fill="#FBBF24"/>
        {/* Little Sleeping 'Z's */}
        <text x="38" y="24" fill="#7C3AED" className="font-sans font-bold text-xs select-none animate-bounce">z</text>
        <text x="46" y="18" fill="#7C3AED" className="font-sans font-bold text-sm select-none animate-pulse">Z</text>
      </svg>
    );
  }
  if (norm === "kamar mandi") {
    return (
      <svg className={`w-full h-full text-sky-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#E0F2FE"/>
        <path d="M20 55H80V65C80 70 75 75 70 75H30C25 75 20 70 20 65V55Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3"/>
        <path d="M75 25C75 25 75 40 65 40" stroke="#0284C7" strokeWidth="3" strokeLinecap="round"/>
        <path d="M60 40H70" stroke="#0284C7" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="62" cy="48" r="1.5" fill="#38BDF8"/>
        <circle cx="68" cy="48" r="1.5" fill="#38BDF8"/>
        <circle cx="65" cy="53" r="1.5" fill="#38BDF8"/>
        <circle cx="35" cy="50" r="4" fill="#BAE6FD" opacity="0.7"/>
        <circle cx="45" cy="46" r="3" fill="#BAE6FD" opacity="0.7"/>
        <circle cx="55" cy="49" r="5" fill="#BAE6FD" opacity="0.7"/>
      </svg>
    );
  }
  if (norm === "kelas") {
    return (
      <svg className={`w-full h-full text-amber-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#FEF3C7"/>
        <rect x="20" y="20" width="60" height="35" rx="3" fill="#15803D" stroke="#78350F" strokeWidth="3"/>
        <line x1="25" y1="45" x2="35" y2="45" stroke="#FFFFFF" strokeWidth="2"/>
        <rect x="35" y="65" width="30" height="15" fill="#B45309"/>
        <rect x="40" y="80" width="4" height="8" fill="#78350F"/>
        <rect x="56" y="80" width="4" height="8" fill="#78350F"/>
        <rect x="85" y="25" width="10" height="30" fill="#BAE6FD" stroke="#78350F" strokeWidth="1.5"/>
      </svg>
    );
  }
  if (norm === "papan tulis") {
    return (
      <svg className={`w-full h-full text-emerald-600 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#F0FDF4"/>
        <rect x="15" y="20" width="70" height="50" rx="4" fill="#14532D" stroke="#78350F" strokeWidth="4"/>
        <path d="M35 45C35 40 40 40 40 45" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M50 45C50 40 55 40 55 45" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M65 45C65 40 70 40 70 45" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="25" y="64" width="10" height="4" fill="#F3F4F6" rx="1"/>
      </svg>
    );
  }
  if (norm === "kursi") {
    return (
      <svg className={`w-full h-full text-orange-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#FFF7ED"/>
        <rect x="35" y="25" width="30" height="25" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="2"/>
        <rect x="30" y="50" width="40" height="6" rx="1" fill="#F59E0B" stroke="#78350F" strokeWidth="2"/>
        <line x1="35" y1="56" x2="35" y2="80" stroke="#78350F" strokeWidth="3" strokeLinecap="round"/>
        <line x1="65" y1="56" x2="65" y2="80" stroke="#78350F" strokeWidth="3" strokeLinecap="round"/>
        <line x1="42" y1="56" x2="42" y2="75" stroke="#9A3412" strokeWidth="2" strokeLinecap="round"/>
        <line x1="58" y1="56" x2="58" y2="75" stroke="#9A3412" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  if (norm === "jam dinding") {
    return (
      <svg className={`w-full h-full text-slate-600 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#F8FAFC"/>
        <circle cx="50" cy="50" r="30" fill="#FFFFFF" stroke="#475569" strokeWidth="4"/>
        <circle cx="50" cy="50" r="2" fill="#475569"/>
        <line x1="50" y1="50" x2="50" y2="32" stroke="#0F172A" strokeWidth="3" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="68" y2="50" stroke="#0F172A" strokeWidth="2" strokeLinecap="round"/>
        <line x1="50" y1="24" x2="50" y2="28" stroke="#475569" strokeWidth="2"/>
        <line x1="50" y1="76" x2="50" y2="72" stroke="#475569" strokeWidth="2"/>
        <line x1="24" y1="50" x2="28" y2="50" stroke="#475569" strokeWidth="2"/>
        <line x1="76" y1="50" x2="72" y2="50" stroke="#475569" strokeWidth="2"/>
      </svg>
    );
  }
  if (norm === "kantor") {
    return (
      <svg className={`w-full h-full text-slate-700 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#F1F5F9"/>
        <rect x="20" y="55" width="60" height="8" rx="1" fill="#475569"/>
        <rect x="28" y="63" width="6" height="22" fill="#334155"/>
        <rect x="66" y="63" width="6" height="22" fill="#334155"/>
        <rect x="38" y="42" width="24" height="12" rx="1" fill="#94A3B8" stroke="#475569" strokeWidth="2"/>
        <line x1="34" y1="54" x2="66" y2="54" stroke="#475569" strokeWidth="3" strokeLinecap="round"/>
        <path d="M25 55L28 45M28 45H24" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 45C22 42 30 42 30 45H22Z" fill="#F59E0B"/>
      </svg>
    );
  }
  if (norm === "perpustakaan") {
    return (
      <svg className={`w-full h-full text-amber-700 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#FAF7F2"/>
        <rect x="15" y="15" width="70" height="70" rx="2" fill="#E7E5E4" stroke="#78311B" strokeWidth="3"/>
        <line x1="15" y1="38" x2="85" y2="38" stroke="#78311B" strokeWidth="3"/>
        <line x1="15" y1="62" x2="85" y2="62" stroke="#78311B" strokeWidth="3"/>
        <rect x="22" y="20" width="8" height="18" fill="#EF4444" rx="1"/>
        <rect x="31" y="22" width="6" height="16" fill="#3B82F6" rx="1"/>
        <rect x="38" y="18" width="9" height="20" fill="#10B981" rx="1"/>
        <rect x="55" y="44" width="7" height="18" fill="#F59E0B" rx="1"/>
        <rect x="63" y="42" width="9" height="20" fill="#8B5CF6" rx="1"/>
        <rect x="73" y="46" width="6" height="16" fill="#EC4899" rx="1"/>
      </svg>
    );
  }
  if (norm === "tangga") {
    return (
      <svg className={`w-full h-full text-purple-600 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#F5F3FF"/>
        <path d="M15 80H30V65H45V50H60V35H75V20H85" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="30" y1="80" x2="30" y2="65" stroke="#DDD6FE" strokeWidth="2"/>
        <line x1="45" y1="80" x2="45" y2="50" stroke="#DDD6FE" strokeWidth="2"/>
        <line x1="60" y1="80" x2="60" y2="35" stroke="#DDD6FE" strokeWidth="2"/>
        <line x1="75" y1="80" x2="75" y2="20" stroke="#DDD6FE" strokeWidth="2"/>
      </svg>
    );
  }
  if (norm === "lab komputer") {
    return (
      <svg className={`w-full h-full text-teal-600 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#ECFDF5"/>
        <rect x="22" y="20" width="32" height="22" rx="2" fill="#0F172A" stroke="#10B981" strokeWidth="2"/>
        <rect x="26" y="24" width="24" height="14" fill="#1E293B"/>
        <line x1="30" y1="28" x2="40" y2="28" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="30" y1="32" x2="46" y2="32" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="35" y="42" width="6" height="8" fill="#475569"/>
        <ellipse cx="38" cy="50" rx="10" ry="2" fill="#475569"/>
        <rect x="62" y="16" width="14" height="34" rx="2" fill="#1E293B" stroke="#10B981" strokeWidth="1.5"/>
        <circle cx="69" cy="24" r="2" fill="#10B981" className="animate-ping"/>
        <line x1="66" y1="44" x2="72" y2="44" stroke="#475569" strokeWidth="2"/>
        <rect x="25" y="58" width="50" height="5" rx="1" fill="#334155"/>
      </svg>
    );
  }
  if (norm === "guru") {
    return (
      <svg className={`w-full h-full text-teal-700 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#F0FDFA"/>
        <rect x="15" y="15" width="70" height="35" rx="2" fill="#115E59"/>
        <circle cx="50" cy="62" r="10" fill="#FDBA74"/>
        <path d="M35 85C35 75 42 72 50 72C58 72 65 75 65 85V90H35V85Z" fill="#0D9488"/>
        <line x1="42" y1="72" x2="25" y2="40" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (norm === "siswa") {
    return (
      <svg className={`w-full h-full text-blue-600 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#EFF6FF"/>
        <circle cx="50" cy="40" r="12" fill="#FED7AA"/>
        <path d="M38 36C42 30 58 30 62 36" stroke="#2563EB" strokeWidth="4" strokeLinecap="round"/>
        <path d="M35 82C35 68 40 60 50 60C60 60 65 68 65 82V90H35V82Z" fill="#2563EB"/>
        <rect x="44" y="60" width="12" height="14" fill="#FFFFFF"/>
        <path d="M50 70L53 78L50 82L47 78L50 70Z" fill="#EF4444"/>
      </svg>
    );
  }
  if (norm === "penghapus") {
    return (
      <svg className={`w-full h-full text-rose-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#FFF1F2"/>
        <g transform="rotate(25 50 50)">
          <rect x="25" y="30" width="30" height="24" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2" rx="1"/>
          <rect x="45" y="30" width="30" height="24" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" rx="1"/>
          <line x1="52" y1="38" x2="68" y2="38" stroke="#FFFFFF" strokeWidth="2"/>
          <line x1="52" y1="46" x2="62" y2="46" stroke="#FFFFFF" strokeWidth="2"/>
        </g>
      </svg>
    );
  }
  if (norm === "pensil") {
    return (
      <svg className={`w-full h-full text-amber-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#FEF3C7"/>
        <g transform="rotate(-45 50 50)">
          <rect x="30" y="42" width="45" height="14" fill="#F59E0B" stroke="#B45309" strokeWidth="2"/>
          <path d="M75 42L88 49L75 56V42Z" fill="#FED7AA" stroke="#B45309" strokeWidth="1.5"/>
          <path d="M84 47L88 49L84 51V47Z" fill="#334155"/>
          <rect x="18" y="42" width="12" height="14" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2" rx="1"/>
          <rect x="26" y="42" width="4" height="14" fill="#94A3B8"/>
        </g>
      </svg>
    );
  }
  if (norm === "tas") {
    return (
      <svg className={`w-full h-full text-pink-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#FDF2F8"/>
        <rect x="25" y="32" width="50" height="48" rx="12" fill="#EC4899" stroke="#9D174D" strokeWidth="3"/>
        <rect x="33" y="52" width="34" height="22" rx="6" fill="#F472B6" stroke="#9D174D" strokeWidth="2"/>
        <path d="M40 32C40 22 60 22 60 32" stroke="#9D174D" strokeWidth="3" fill="none"/>
        <circle cx="50" cy="52" r="2" fill="#9D174D"/>
        <circle cx="50" cy="32" r="2.5" fill="#9D174D"/>
      </svg>
    );
  }
  if (norm === "rumah itu besar") {
    return (
      <svg className={`w-full h-full text-blue-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#EFF6FF"/>
        <path d="M20 80V45L50 20L80 45V80H20Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3"/>
        <path d="M15 45L50 16L85 45" stroke="#1E3A8A" strokeWidth="4" strokeLinecap="round"/>
        <rect x="42" y="58" width="16" height="22" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="2"/>
        <rect x="28" y="50" width="10" height="10" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="2"/>
        <rect x="62" y="50" width="10" height="10" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="2"/>
      </svg>
    );
  }
  if (norm === "gunung itu tinggi") {
    return (
      <svg className={`w-full h-full text-emerald-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#F0FDF4"/>
        <path d="M10 80L45 25L75 80H10Z" fill="#10B981" stroke="#047857" strokeWidth="3"/>
        <path d="M45 80L70 35L90 80H45Z" fill="#34D399" stroke="#047857" strokeWidth="2"/>
        <path d="M45 25L39 34L45 38L51 34L45 25Z" fill="#FFFFFF"/>
        <path d="M70 35L66 42L70 45L74 42L70 35Z" fill="#FFFFFF"/>
      </svg>
    );
  }
  if (norm === "gambar/foto itu indah") {
    return (
      <svg className={`w-full h-full text-amber-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#FFF7ED"/>
        <rect x="20" y="20" width="60" height="60" rx="4" fill="#FFFFFF" stroke="#D97706" strokeWidth="4"/>
        <circle cx="50" cy="50" r="14" fill="#F59E0B"/>
        <path d="M50 30V34M50 66V70M30 50H34M66 50H70" stroke="#D97706" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="8" fill="#EF4444"/>
      </svg>
    );
  }
  if (norm === "taman itu luas") {
    return (
      <svg className={`w-full h-full text-purple-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#F5F3FF"/>
        <path d="M10 80C30 70 50 90 90 80V90H10V80Z" fill="#8B5CF6"/>
        <circle cx="30" cy="65" r="5" fill="#EC4899"/>
        <path d="M30 65V75" stroke="#10B981" strokeWidth="2"/>
        <circle cx="70" cy="60" r="6" fill="#F59E0B"/>
        <path d="M70 60V75" stroke="#10B981" strokeWidth="2"/>
        <rect x="48" y="55" width="6" height="20" fill="#78350F"/>
        <circle cx="51" cy="45" r="15" fill="#10B981"/>
      </svg>
    );
  }
  if (norm === "sekolah itu bersih") {
    return (
      <svg className={`w-full h-full text-emerald-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#ECFDF5"/>
        <rect x="25" y="35" width="50" height="45" rx="2" fill="#10B981" stroke="#047857" strokeWidth="3"/>
        <rect x="42" y="23" width="16" height="12" fill="#10B981" stroke="#047857" strokeWidth="3"/>
        <circle cx="50" cy="29" r="4" fill="#FFFFFF" stroke="#047857" strokeWidth="1.5"/>
        <rect x="44" y="60" width="12" height="20" fill="#FFFFFF" stroke="#047857" strokeWidth="2"/>
        <path d="M80 25L82 29L86 30L82 31L80 35L78 31L74 30L78 29L80 25Z" fill="#FBBF24"/>
        <path d="M20 30L21 33L24 34L21 35L20 38L19 35L16 34L19 33L20 30Z" fill="#FBBF24"/>
      </svg>
    );
  }
  return null;
};

// Image with Fallback Loader Component
const ImageWithFallback: React.FC<{ src: string; alt: string; activity: string; className?: string }> = ({
  src,
  alt,
  activity,
  className = ""
}) => {
  const [error, setError] = useState(false);

  if (error) {
    return <ActivityIllustration activity={activity} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
      className={`${className} object-cover`}
    />
  );
};

// Arabic normalization helper to match strings perfectly stripping any diacritics / harakat variations
const normalizeArabic = (str: string): string => {
  if (!str) return "";
  return str
    .replace(/[\u064B-\u0652]/g, "") // Remove common Arabic harakat diacritics
    .replace(/\s+/g, " ")             // Normalize redundant whitespaces
    .trim();
};

// Synthesize happy or funny annoying sound effects via browser Web Audio API
const playSoundEffect = (type: 'correct' | 'incorrect' | 'shuffle') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'correct') {
      // Ascending major arpeggio - cute, happy, sparkling (C5, E5, G5, C6)
      const now = ctx.currentTime;
      osc.type = 'triangle';
      
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      
      osc.start(now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.stop(now + 0.6);
    } else if (type === 'incorrect') {
      // Goofy and annoying "wuh-wuh-wuuuh" slide down with vibrato - extremely funny and cartoonish
      const now = ctx.currentTime;
      osc.type = 'sawtooth';
      
      // Pitch slide
      osc.frequency.setValueAtTime(260, now); 
      osc.frequency.linearRampToValueAtTime(120, now + 0.15); 
      osc.frequency.linearRampToValueAtTime(85, now + 0.45); 
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
      
      osc.start(now);
      osc.stop(now + 0.55);
    } else { // Shuffle
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.start();
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {
    console.warn("AudioContext failed:", e);
  }
};

// Theme helper depending on current topic theme
const getThemeColors = (chapterId: number, materiId: number) => {
  const key = `${chapterId}-${materiId}`;
  
  let headerBg = "bg-gradient-to-r from-[#0d3b78] to-[#1f6fe5]";
  let labelText = "text-indigo-600 bg-indigo-50";
  let bodyBg = "bg-[#f8fafc]";
  let panelBg = "bg-white border-slate-100";
  
  if (key === "1-1" || key === "2-3" || key === "2-101" || key === "2-1") {
    // Memory card games
    headerBg = "bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900";
    labelText = "text-purple-600 bg-purple-50";
  } else if (key === "1-2" || key === "1-3" || key === "1-4") {
    // At-Tahiyyah
    headerBg = "bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-800";
    labelText = "text-emerald-700 bg-emerald-50";
  } else if (key === "1-5") {
    // Ad-Dhomir
    headerBg = "bg-gradient-to-r from-amber-800 via-orange-800 to-rose-800";
    labelText = "text-amber-700 bg-amber-50";
  } else if (key === "2-1") {
    // Mubtada Khobar Sifat
    headerBg = "bg-gradient-to-r from-blue-900 via-sky-800 to-indigo-800";
    labelText = "text-sky-700 bg-sky-50";
  } else if (key === "2-2") {
    // Zharaf Makan
    headerBg = "bg-gradient-to-r from-teal-800 via-emerald-800 to-green-800";
    labelText = "text-teal-700 bg-teal-50";
  }

  // 4 Option buttons with distinctive rich color schemes
  const optionStyles = [
    "bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-200 text-blue-950 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 ring-blue-100 shadow-sm",
    "bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200 text-emerald-950 hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-400 ring-emerald-100 shadow-sm",
    "bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200 text-amber-950 hover:from-amber-100 hover:to-orange-100 hover:border-amber-400 ring-amber-100 shadow-sm",
    "bg-gradient-to-br from-purple-50 to-fuchsia-50/50 border-purple-200 text-purple-950 hover:from-purple-100 hover:to-fuchsia-100 hover:border-purple-400 ring-purple-100 shadow-sm",
    "bg-gradient-to-br from-rose-50 to-pink-50/50 border-rose-200 text-rose-950 hover:from-rose-100 hover:to-pink-100 hover:border-rose-400 ring-rose-100 shadow-sm"
  ];

  const cardBacks = [
    "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 shadow-lg shadow-indigo-600/10",
    "bg-gradient-to-br from-purple-600 via-fuchsia-700 to-pink-800 shadow-lg shadow-purple-600/10",
    "bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 shadow-lg shadow-emerald-600/10",
    "bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 shadow-lg shadow-amber-600/10"
  ];

  const cardBack = cardBacks[(chapterId + materiId) % cardBacks.length];

  return {
    headerBg,
    labelText,
    bodyBg,
    panelBg,
    optionStyles,
    cardBack
  };
};

interface IceBreakingGameProps {
  materiId: number;
  chapterId: number;
  topicName: string;
  onComplete: () => void;
  session: UserSession;
}

export const IceBreakingGame: React.FC<IceBreakingGameProps> = ({
  materiId,
  chapterId,
  topicName,
  onComplete,
  session
}) => {
  const [gameState, setGameState] = useState<'intro' | 'play' | 'completed'>('intro');
  const [gameType, setGameType] = useState<1 | 2 | 3>(1); // 1: Cards, 2: Image, 3: Riddle
  const [score, setScore] = useState(0);
  const [wobble, setWobble] = useState(false);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  // States for Tipe 1: Card Matching
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchingLevel, setMatchingLevel] = useState<1 | 2 | 3>(1);
  const [showLevelCompletedModal, setShowLevelCompletedModal] = useState(false);

  // States for Tipe 2 & 3
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);

  // Timer & User Answers states
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, {
    chosenIdx: number | null;
    chosenText: string;
    isCorrect: boolean;
    timeOut: boolean;
  }>>({});

  // Dynamic datasets scoped to the current active lesson/chapter to prevent undefined bugs and wrong answers
  const key = `${chapterId}-${materiId}`;
  const imageGameList = IMAGE_GAME_DATA[key] || IMAGE_GAME_DATA["1-2"];
  const riddleList = RIDDLE_DATA[key] || RIDDLE_DATA["1-5"];

  // Determine game type based on material and chapter
  useEffect(() => {
    const key = `${chapterId}-${materiId}`;
    
    // Custom assignments requested by the user:
    // - Tipe 1 (Matching Card) untuk materi 1 (Al-Istifham), bab 2 materi 3 (Isim Isyarah) dan bab 2 materi 1 (Isim Isyarah Levels)
    // - Tipe 2 (Tebak Gambar) untuk materi 2, 3, 4 (At-Tahiyyah)
    // - Tipe 3 (Riddles/Tebak-tebakan) untuk dhomir (1-5) dan zharaf makan (2-2)
    if (key === "1-1" || key === "2-3" || key === "2-101" || key === "2-1") {
      setGameType(1);
    } else if (key === "1-2" || key === "1-3" || key === "1-4") {
      setGameType(2);
    } else {
      setGameType(3); // Default / Fallback to Riddles
    }
  }, [materiId, chapterId]);

  // 15-second countdown timer for Guess Image and Riddles
  useEffect(() => {
    if (!timerActive || gameState !== 'play' || gameType === 1) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, gameState, currentRound, gameType]);

  // Reset the 15-second timer automatically when a new round is loaded
  useEffect(() => {
    if (gameState === 'play' && gameType !== 1) {
      setTimeLeft(15);
      setTimerActive(true);
      setSelectedOptionIdx(null);
      setShowAnswerFeedback(null);
    }
  }, [currentRound, gameState, gameType]);

  // Handle timeout logic (auto-mark wrong and advance to next)
  const handleTimeOut = () => {
    setTimerActive(false);
    setSelectedOptionIdx(-1); // Special visual state showing no selection/timeout
    playSoundEffect('incorrect');
    setShowAnswerFeedback('incorrect');
    
    setUserAnswers(prev => ({
      ...prev,
      [currentRound]: {
        chosenIdx: null,
        chosenText: "(Waktu Habis)",
        isCorrect: false,
        timeOut: true
      }
    }));

    setTimeout(() => {
      setShowAnswerFeedback(null);
      setSelectedOptionIdx(null);
      
      const currentList = gameType === 2 ? imageGameList : riddleList;
      const totalRounds = currentList.length;
      if (currentRound + 1 < totalRounds) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameState('completed');
      }
    }, 1800);
  };

  // Sync / save student score to Firestore upon completion
  useEffect(() => {
    if (gameState === 'completed' && session) {
      setIsSaving(true);
      const studentName = session.name || "Siswa Tamu";
      const studentRole = session.peran === 'siswa' ? 'Siswa' : session.peran === 'guru' ? 'Guru' : 'Admin';
      const studentClass = session.kelas ? `Kelas ${session.kelas}` : 'Kelas 7';
      
      const finalScore: StudentScore = {
        name: studentName,
        role: studentRole,
        class: studentClass,
        score: score,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: score >= 60 ? 'Lulus' : 'Remedial'
      };
      
      saveStudentScore(finalScore)
        .then(() => {
          setIsSaving(false);
          setSaveSuccess(true);
          console.log('Successfully saved Ice Breaking score in Firestore database!');
        })
        .catch(err => {
          setIsSaving(false);
          setSaveSuccess(false);
          console.error('Failed to save score in Firestore:', err);
        });
    }
  }, [gameState, score, session]);

  // Initializer for Game Type 1 (Card Matching)
  const initializeCardMatching = (levelOverride?: number) => {
    const key = `${chapterId}-${materiId}`;
    const levelToUse = levelOverride !== undefined ? levelOverride : matchingLevel;
    
    let rawPairs = CARD_MATCHING_DATA[key] || CARD_MATCHING_DATA["1-1"];
    if (key === "1-1") {
      rawPairs = CARD_MATCHING_BAB1_LEVELS[levelToUse as 1 | 2 | 3] || CARD_MATCHING_BAB1_LEVELS[1];
    } else if (key === "2-101" || key === "2-1") {
      rawPairs = CARD_MATCHING_BAB2_LEVELS[levelToUse as 1 | 2 | 3] || CARD_MATCHING_BAB2_LEVELS[1];
    }
    
    let generatedCards: CardItem[] = [];
    rawPairs.forEach((pair, idx) => {
      const pairId = `pair-${idx}`;
      generatedCards.push({
        id: `arabic-${idx}`,
        text: pair.arabic,
        type: 'arabic',
        pairId
      });
      generatedCards.push({
        id: `trans-${idx}`,
        text: pair.translation,
        type: 'translation',
        pairId
      });
    });

    // Shuffle cards
    generatedCards.sort(() => 0.5 - Math.random());
    setCards(generatedCards);
    setMatchedPairs([]);
    setSelectedCardIds([]);
  };

  const advanceMatchingLevel = () => {
    setShowLevelCompletedModal(false);
    const nextLevel = (matchingLevel + 1) as 1 | 2 | 3;
    setMatchingLevel(nextLevel);
    initializeCardMatching(nextLevel);
  };

  // Start/Restart Game Controller
  const startGame = () => {
    playSoundEffect('shuffle');
    setGameState('play');
    setScore(0);
    setCurrentRound(0);
    setSelectedOptionIdx(null);
    setShowAnswerFeedback(null);
    setSaveSuccess(null);
    setUserAnswers({});
    setMatchingLevel(1);
    setShowLevelCompletedModal(false);

    const currentKey = `${chapterId}-${materiId}`;
    if (currentKey === "1-1" || currentKey === "2-3" || currentKey === "2-101" || currentKey === "2-1") {
      initializeCardMatching(1);
    } else {
      setTimeLeft(15);
      setTimerActive(true);
    }
  };

  // ================= GAME LOGIC HANDLERS =================

  // Card Click Logic (Tipe 1 - memory click flip)
  const handleCardClick = (cardId: string) => {
    if (matchedPairs.includes(cardId)) return;
    if (selectedCardIds.includes(cardId)) return; // Already flipped
    if (showAnswerFeedback !== null) return; // Prevent clicking during feedback window
    if (showLevelCompletedModal) return; // Prevent clicking while level transition is open

    // If first card click
    if (selectedCardIds.length === 0) {
      setSelectedCardIds([cardId]);
      return;
    }

    // If second card click
    if (selectedCardIds.length === 1) {
      const firstId = selectedCardIds[0];
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === cardId);

      if (!firstCard || !secondCard) return;

      // Flip the second card up
      const currentSelection = [firstId, cardId];
      setSelectedCardIds(currentSelection);

      // Prevent matching same types (e.g. Arabic with Arabic, Translation with Translation)
      if (firstCard.type === secondCard.type) {
        playSoundEffect('incorrect');
        setShowAnswerFeedback('incorrect');
        setWobble(true);
        
        setTimeout(() => {
          setWobble(false);
          setSelectedCardIds([]); // Flip back down
          setShowAnswerFeedback(null);
        }, 1500);
        return;
      }

      // Compare pairs using exact pair ID mapping
      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        playSoundEffect('correct');
        setShowAnswerFeedback('correct');
        const updatedMatched = [...matchedPairs, firstId, cardId];
        setMatchedPairs(updatedMatched);
        setSelectedCardIds([]); // Clear active selection
        setScore(prev => prev + 20); // 20 points per match!

        setTimeout(() => {
          setShowAnswerFeedback(null);
          // Check if game is completed using updated list
          if (updatedMatched.length === cards.length) {
            const currentKey = `${chapterId}-${materiId}`;
            if ((currentKey === "1-1" || currentKey === "2-101" || currentKey === "2-1") && matchingLevel < 3) {
              setShowLevelCompletedModal(true);
            } else {
              setGameState('completed');
            }
          }
        }, 1200);
      } else {
        // Mismatched cards
        playSoundEffect('incorrect');
        setShowAnswerFeedback('incorrect');
        setWobble(true);
        
        setTimeout(() => {
          setWobble(false);
          setSelectedCardIds([]); // Flip back down
          setShowAnswerFeedback(null);
        }, 1500);
      }
    }
  };

  // Option Click Logic (Tipe 2 & 3)
  const handleOptionClick = (optionIndex: number, correctText: string, chosenText: string) => {
    if (selectedOptionIdx !== null) return; // Block double clicking
    setTimerActive(false);
    setSelectedOptionIdx(optionIndex);

    // Normalize Arabic strings before checking to guarantee flawless comparison
    const isCorrect = normalizeArabic(chosenText) === normalizeArabic(correctText);

    if (isCorrect) {
      playSoundEffect('correct');
      setShowAnswerFeedback('correct');
      setScore(prev => prev + 20); // 20 points per correct answer (5 questions * 20 = 100 max)

      setUserAnswers(prev => ({
        ...prev,
        [currentRound]: {
          chosenIdx: optionIndex,
          chosenText: chosenText,
          isCorrect: true,
          timeOut: false
        }
      }));

      setTimeout(() => {
        setShowAnswerFeedback(null);
        setSelectedOptionIdx(null);
        
        // Advance round or complete game
        const totalRounds = gameType === 2 ? imageGameList.length : riddleList.length;
        if (currentRound + 1 < totalRounds) {
          setCurrentRound(prev => prev + 1);
        } else {
          setGameState('completed');
        }
      }, 1800);
    } else {
      playSoundEffect('incorrect');
      setShowAnswerFeedback('incorrect');
      setWobble(true);

      setUserAnswers(prev => ({
        ...prev,
        [currentRound]: {
          chosenIdx: optionIndex,
          chosenText: chosenText,
          isCorrect: false,
          timeOut: false
        }
      }));

      setTimeout(() => {
        setWobble(false);
        setSelectedOptionIdx(null);
        setShowAnswerFeedback(null);
        
        // Advance round or complete game directly to next question ("langsung ke soal tiga aja")
        const totalRounds = gameType === 2 ? imageGameList.length : riddleList.length;
        if (currentRound + 1 < totalRounds) {
          setCurrentRound(prev => prev + 1);
        } else {
          setGameState('completed');
        }
      }, 1800);
    }
  };

  const activeTheme = getThemeColors(chapterId, materiId);

  return (
    <div id="ice-breaking-comprehensive-layout" className="w-full max-w-6xl mx-auto px-4 py-6">
      <AnimatePresence mode="wait">

        {/* ================= STAGE 1: INTRO SCREEN ================= */}
        {gameState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden p-8 text-center space-y-6 md:p-12"
          >
            <div className="mx-auto w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center shadow-inner relative">
              <Gamepad2 className="w-10 h-10 animate-pulse text-amber-500" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[10px] text-white font-extrabold shadow">★</div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-black text-amber-700 bg-amber-100/70 border border-amber-200 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block shadow-sm">
                Sesi Penyegar Otak • Sesi Pemanasan Menyimak
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0d3b78] tracking-tight">
                {gameType === 1 && "Mencocokkan Kartu Kata 🗂️"}
                {gameType === 2 && "Tebak Aktivitas Lewat Gambar 🖼️"}
                {gameType === 3 && "Teka-Teki & Tebak Kata Arab 🧩"}
              </h2>
              <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                Sebelum masuk ke pembelajaran kaidah utama, mari kumpulkan konsentrasi dengan bermain game interaktif yang seru dan menantang ini!
              </p>
            </div>

            {/* Structured Guidelines Box */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 text-left max-w-xl mx-auto space-y-4 shadow-inner">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin" /> Aturan Bermain:
              </h4>
              <ul className="text-xs md:text-sm text-slate-600 space-y-3 font-semibold leading-relaxed">
                {gameType === 1 && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">1</span>
                      <span>Kartu bahasa Arab dan artinya tersembunyi secara acak dalam posisi terbalik di layar.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">2</span>
                      <span>Klik satu kartu, temukan pasangan artinya, lalu klik kartu pasangan yang benar.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">3</span>
                      <span>Dapatkan skor setinggi-tingginya dan rayakan dengan kembang api yang seru!</span>
                    </li>
                  </>
                )}
                {gameType === 2 && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">1</span>
                      <span>Kamu akan diperlihatkan sebuah foto aktivitas harian <b>Tema Yawmiyyah</b> yang beresolusi tinggi.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">2</span>
                      <span>Di bagian kanan, pilihlah kartu kalimat bahasa Arab yang mendeskripsikan foto tersebut.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">3</span>
                      <span>Selesaikan kelima tantangan gambar untuk membuka kunci materi utama!</span>
                    </li>
                  </>
                )}
                {gameType === 3 && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">1</span>
                      <span>Bacalah teka-teki interaktif kreatif mengenai peran, benda, atau konsep tata bahasa Arab.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">2</span>
                      <span>Pilihlah satu kartu jawaban bahasa Arab yang paling menggambarkan teka-teki di atas.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">3</span>
                      <span>Kumpulkan poin setinggi-tingginya dan catat namamu di database awan prestasi sekolah!</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={startGame}
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Mulai Bermain Sekarang 🎮</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STAGE 2: ACTIVE PLAY ================= */}
        {gameState === 'play' && (
          <motion.div
            key="active-play"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden ${
              wobble ? 'animate-shake' : ''
            }`}
          >
            {/* Header / HUD panel */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg inline-block ${activeTheme.labelText}`}>
                  {gameType === 1 && "Mencocokkan Kartu Memori 🗂️"}
                  {gameType === 2 && `Tebak Gambar (Ronde ${currentRound + 1} / ${imageGameList.length}) 🖼️`}
                  {gameType === 3 && `Tebak-tebakan (Ronde ${currentRound + 1} / ${riddleList.length}) 🧩`}
                </span>
                <p className="text-xs text-slate-400 font-bold">Topik Bahasan: {topicName}</p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="bg-amber-100/80 border border-amber-300 text-amber-900 px-4 py-1.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{score} Poin</span>
                </div>
                <button
                  onClick={startGame}
                  className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500 transition cursor-pointer"
                  title="Acak Ulang Kartu"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal countdown timer bar */}
            {gameType !== 1 && (
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative shadow-inner border border-slate-200/50">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 15) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                  className={`h-full ${
                    timeLeft <= 4 
                      ? "bg-gradient-to-r from-red-500 to-rose-600 animate-pulse" 
                      : timeLeft <= 8
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-gradient-to-r from-emerald-400 to-teal-500"
                  }`}
                />
                <span className="absolute right-3 top-[-1px] text-[9px] font-black tracking-wider uppercase text-slate-500 drop-shadow-sm">
                  Sisa Waktu: {timeLeft} Detik
                </span>
              </div>
            )}

            {/* EMOTE AND REVELATION MODALS */}
            <AnimatePresence>
              {showAnswerFeedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                >
                  {showAnswerFeedback === 'correct' ? (
                    <motion.div
                      initial={{ scale: 0.85, y: 15 }}
                      animate={{ scale: 1, y: 0, rotate: [0, -2, 2, 0] }}
                      exit={{ scale: 0.85, y: -15 }}
                      className="bg-white rounded-3xl p-8 max-w-sm border-4 border-emerald-500 shadow-2xl space-y-4 flex flex-col items-center"
                    >
                      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-5xl shadow-inner border border-emerald-100 animate-bounce">
                        🥳
                      </div>
                      <h3 className="text-2xl font-black text-emerald-800">Mumtaaz! Benar! 🎉</h3>
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-bold">
                        Langkah yang luar biasa tepat. Teruskan performa cemerlangmu!
                      </p>
                      
                      <div className="flex gap-2.5 pt-1">
                        <span className="animate-bounce text-2xl">⭐</span>
                        <span className="animate-pulse text-2xl">✨</span>
                        <span className="animate-bounce text-2xl">⭐</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.85, y: 15 }}
                      animate={{ scale: 1, y: 0, x: [-10, 10, -10, 10, 0] }}
                      exit={{ scale: 0.85, y: -15 }}
                      className="bg-white rounded-3xl p-8 max-w-sm border-4 border-rose-500 shadow-2xl space-y-4 flex flex-col items-center"
                    >
                      <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-5xl shadow-inner border border-rose-100 animate-bounce">
                        🤪
                      </div>
                      <h3 className="text-2xl font-black text-rose-800">Waduh! Kurang Tepat... 🥺</h3>
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-bold">
                        Yaaah... Coba asah konsentrasimu lagi ya! Kita langsung lanjut ke tantangan berikutnya!
                      </p>
                      <div className="flex gap-2.5 pt-1">
                        <span className="animate-pulse text-2xl">⚡</span>
                        <span className="animate-bounce text-2xl">💔</span>
                        <span className="animate-pulse text-2xl">⚡</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ================= TIPE 1: CARD MATCHING BOARD (PERFECT RESPONSIVE) ================= */}
            {gameType === 1 && (
              <div className="space-y-6">
                {((chapterId === 1 && materiId === 1) || (chapterId === 2 && (materiId === 101 || materiId === 1))) && (
                  <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 border-b border-slate-100 pb-4">
                    <span className={`text-xs font-black px-3 py-1.5 rounded-full transition-all ${matchingLevel >= 1 ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300' : 'bg-slate-100 text-slate-400'}`}>
                      Level 1: Mudah {matchingLevel > 1 && '✓'}
                    </span>
                    <div className="w-6 md:w-8 h-0.5 bg-slate-200" />
                    <span className={`text-xs font-black px-3 py-1.5 rounded-full transition-all ${matchingLevel >= 2 ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300' : 'bg-slate-100 text-slate-400'}`}>
                      Level 2: Sedang {matchingLevel > 2 && '✓'}
                    </span>
                    <div className="w-6 md:w-8 h-0.5 bg-slate-200" />
                    <span className={`text-xs font-black px-3 py-1.5 rounded-full transition-all ${matchingLevel >= 3 ? 'bg-rose-100 text-rose-800 ring-2 ring-rose-300' : 'bg-slate-100 text-slate-400'}`}>
                      Level 3: Susah
                    </span>
                  </div>
                )}

                {showLevelCompletedModal ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-3xl p-8 text-center space-y-6 max-w-lg mx-auto shadow-xl"
                  >
                    <div className="mx-auto w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-200 shadow-sm">
                      <Trophy className="w-10 h-10 text-amber-500 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-[#0d3b78] tracking-tight">
                        Mumtaz! Level {matchingLevel === 1 ? 'Mudah' : 'Sedang'} Selesai! 🎉
                      </h3>
                      <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                        {chapterId === 1
                          ? "Kamu berhasil mencocokkan semua kata tanya Al-Istifham dengan sempurna di level ini! Siap untuk tantangan berikutnya yang lebih seru?"
                          : "Kamu berhasil mencocokkan semua kata tunjuk dengan sempurna di level ini! Siap untuk tantangan berikutnya yang lebih seru?"
                        }
                      </p>
                    </div>
                    <button
                      onClick={advanceMatchingLevel}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/25 transition duration-200 cursor-pointer"
                    >
                      Mulai Level {matchingLevel === 1 ? 'Sedang' : 'Susah'} ⚡
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-center max-w-lg mx-auto">
                      <span className="text-xs font-black text-slate-500 px-4 py-1.5 bg-slate-50 border border-slate-150 rounded-full shadow-sm inline-block">
                        💡 Klik kartu bahasa Arab dan pasangkan dengan arti terjemahan bahasa Indonesianya!
                      </span>
                    </div>

                    {/* Structured card grid: responsive layout adapting cleanly to small screens & large screen monitors */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                      {cards.map((card) => {
                        const isMatched = matchedPairs.includes(card.id);
                        const isSelected = selectedCardIds.includes(card.id);
                        const isOpen = isMatched || isSelected;

                        return (
                          <motion.button
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            disabled={isMatched}
                            whileHover={{ scale: isMatched ? 1 : 1.05 }}
                            whileTap={{ scale: isMatched ? 1 : 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            layout
                            className={`h-32 p-3 rounded-2xl border flex flex-col items-center justify-center cursor-pointer shadow-md text-center transition-all duration-300 relative select-none ${
                              isOpen
                                ? isMatched
                                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-600 text-white cursor-default"
                                  : "bg-amber-50 border-amber-400 text-amber-900 ring-4 ring-amber-100"
                                : `${activeTheme.cardBack} text-white border-transparent`
                            }`}
                          >
                            {isOpen ? (
                              <div className="flex flex-col items-center justify-center h-full w-full">
                                {card.type === 'arabic' ? (
                                  <span 
                                    className={`font-arabic text-2xl tracking-wide leading-relaxed font-black ${isMatched ? 'text-white' : 'text-slate-900'}`}
                                    style={{ direction: 'rtl' }}
                                  >
                                    {card.text}
                                  </span>
                                ) : (
                                  <span className={`text-xs md:text-sm font-black px-1.5 ${isMatched ? 'text-white' : 'text-slate-800'}`}>
                                    {card.text}
                                  </span>
                                )}
                                {isMatched && (
                                  <span className="text-[9px] bg-emerald-700/80 text-white font-extrabold px-2 py-0.5 rounded-full mt-2 flex items-center gap-0.5">
                                    ✓ Cocok
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-amber-300 animate-pulse">؟</span>
                                <span className="text-[9px] font-extrabold tracking-widest text-indigo-100 uppercase mt-1">Klik Buka</span>
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ================= TIPE 2: TEBAK GAMBAR BOARD (SPLIT SCREEN FOR PERFECT desktop COHESION) ================= */}
            {gameType === 2 && imageGameList[currentRound] && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left Side: Photo panel */}
                <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 shadow-md flex flex-col space-y-4">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-200 relative shadow-inner">
                    <ImageWithFallback 
                      src={imageGameList[currentRound].imageUrl} 
                      alt={imageGameList[currentRound].translation}
                      activity={imageGameList[currentRound].translation}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                      Tema: Yawmiyyah 📆
                    </div>
                  </div>
                  <div className="text-center py-2 border-t border-slate-200/50">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Arti Aktivitas</span>
                    <h3 className="text-base md:text-lg font-black text-[#0d3b78]">{imageGameList[currentRound].translation}</h3>
                  </div>
                </div>

                {/* Right Side: Options and helper text */}
                <div className="space-y-6">
                  <div className="text-center lg:text-left">
                    <h4 className="text-sm md:text-base font-black text-slate-700">Pilihlah Kalimat Bahasa Arab yang Tepat:</h4>
                    <p className="text-xs text-slate-400 font-bold mt-1">Amatilah foto di sebelah kiri dan pasangkan kalimat bahasa Arabnya dengan benar.</p>
                  </div>

                  {/* Choices list - grid layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {imageGameList[currentRound].options.map((option, idx) => {
                      const isSelected = selectedOptionIdx === idx;
                      const isCorrect = option === imageGameList[currentRound].arabic;
                      
                      const defaultColorClass = activeTheme.optionStyles[idx % activeTheme.optionStyles.length];

                      let btnClass = defaultColorClass;
                      if (selectedOptionIdx !== null) {
                        if (isSelected) {
                          btnClass = isCorrect 
                             ? "bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
                             : "bg-gradient-to-r from-rose-500 to-rose-600 border-rose-600 text-white shadow-lg shadow-rose-500/20 scale-[0.98]";
                        } else if (isCorrect) {
                          btnClass = "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-400 text-emerald-950 font-black";
                        } else {
                          btnClass = "opacity-30 border-slate-200 bg-slate-50 text-slate-400 pointer-events-none";
                        }
                      }

                      return (
                        <motion.button
                          key={idx}
                          onClick={() => handleOptionClick(idx, imageGameList[currentRound].arabic, option)}
                          disabled={selectedOptionIdx !== null}
                          whileHover={{ scale: selectedOptionIdx === null ? 1.03 : 1 }}
                          whileTap={{ scale: selectedOptionIdx === null ? 0.97 : 1 }}
                          className={`p-4 rounded-2xl border text-center font-bold flex flex-col justify-center items-center h-28 shadow-md cursor-pointer transition-all duration-300 ring-2 ring-transparent ${btnClass}`}
                        >
                          <span className="font-arabic text-xl md:text-2xl select-none font-black leading-relaxed" style={{ direction: 'rtl' }}>
                            {option}
                          </span>
                          {selectedOptionIdx !== null && isCorrect && (
                            <span className="text-[10px] md:text-xs font-bold font-mono text-emerald-800 opacity-90 mt-1.5">{imageGameList[currentRound].pronunciation}</span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TIPE 3: TEBAK-TEBAKAN / RIDDLES BOARD (SPLIT SCREEN FOR LARGE DEV) ================= */}
            {gameType === 3 && riddleList[currentRound] && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* Left Side: Riddle clue panel */}
                <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden min-h-[220px] flex flex-col justify-center">
                  <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
                    <QuestionIcon className="w-56 h-56" />
                  </div>

                  <div className="space-y-4 relative z-10 text-center">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-black text-lg shadow-inner">
                      ?
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase text-indigo-300 tracking-widest block">Teka-Teki Pemikiran 🤔</span>
                    <p className="text-sm md:text-base lg:text-lg font-bold leading-relaxed max-w-lg mx-auto">
                      "{riddleList[currentRound].clue}"
                    </p>
                  </div>
                </div>

                {/* Right Side: Options list */}
                <div className="space-y-6">
                  <div className="text-center lg:text-left">
                    <h4 className="text-sm md:text-base font-black text-slate-700">Tebak Siapakah Aku:</h4>
                    <p className="text-xs text-slate-400 font-bold mt-1">Pilih kartu jawaban bahasa Arab yang paling mewakili teka-teki di atas.</p>
                  </div>

                  {/* Options list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {riddleList[currentRound].options.map((option, idx) => {
                      const isSelected = selectedOptionIdx === idx;
                      const isCorrect = option.arabic === riddleList[currentRound].arabic;
                      
                      const defaultColorClass = activeTheme.optionStyles[idx % activeTheme.optionStyles.length];

                      let btnClass = defaultColorClass;
                      if (selectedOptionIdx !== null) {
                        if (isSelected) {
                          btnClass = isCorrect 
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
                            : "bg-gradient-to-r from-rose-500 to-rose-600 border-rose-600 text-white shadow-lg shadow-rose-500/20 scale-[0.98]";
                        } else if (isCorrect) {
                          btnClass = "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-400 text-emerald-950 font-black";
                        } else {
                          btnClass = "opacity-30 border-slate-200 bg-slate-50 text-slate-400 pointer-events-none";
                        }
                      }

                      return (
                        <motion.button
                          key={idx}
                          onClick={() => handleOptionClick(idx, riddleList[currentRound].arabic, option.arabic)}
                          disabled={selectedOptionIdx !== null}
                          whileHover={{ scale: selectedOptionIdx === null ? 1.03 : 1 }}
                          whileTap={{ scale: selectedOptionIdx === null ? 0.97 : 1 }}
                          className={`p-4 rounded-2xl border text-center h-28 flex flex-col justify-center items-center shadow-md cursor-pointer transition-all duration-300 ring-2 ring-transparent ${btnClass}`}
                        >
                          <span className="font-arabic text-2xl md:text-3xl font-black select-none leading-relaxed" style={{ direction: 'rtl' }}>
                            {option.arabic}
                          </span>
                          <span className="text-xs font-black mt-1.5 opacity-85">{option.translation}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </motion.div>
        )}

        {/* ================= STAGE 3: COMPLETED SCREEN ================= */}
        {gameState === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-8 text-center space-y-6 md:p-12 relative"
          >
            {/* Visual floating confetti particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(18)].map((_, i) => {
                const colors = ['bg-amber-400', 'bg-blue-400', 'bg-emerald-400', 'bg-pink-400', 'bg-purple-400', 'bg-yellow-400'];
                return (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 1, 
                      scale: Math.random() * 0.6 + 0.4, 
                      x: `${20 + Math.random() * 60}%`, 
                      y: '100%',
                      rotate: 0 
                    }}
                    animate={{ 
                      x: `${Math.random() * 100}%`, 
                      y: `${Math.random() * 45}%`,
                      rotate: Math.random() * 360,
                      opacity: [1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 1.5 + Math.random() * 2, 
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatDelay: Math.random() * 1
                    }}
                    className={`absolute w-3.5 h-3.5 rounded-full ${colors[i % colors.length]} shadow-md`}
                  />
                );
              })}
            </div>

            <div className="mx-auto w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner border border-emerald-100 relative z-10">
              <Trophy className="w-12 h-12 text-emerald-500 animate-bounce" />
            </div>

            <div className="space-y-3 relative z-10">
              <span className="text-[10px] md:text-xs font-black text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block animate-pulse">
                Sesi Sukses Selesai • Mumtaaz!
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0d3b78] tracking-tight">
                Pemanasan Otakmu Selesai! 🌟
              </h2>
              <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-semibold">
                Hebat sekali! Kamu berhasil menaklukkan tantangan Ice Breaking untuk materi <b>{topicName}</b>. Fokus belajarmu sekarang berada di level maksimal!
              </p>
            </div>

            {/* Achievement Badge & Final Score Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto relative z-10">
              
              {/* Score card display */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-150 p-5 rounded-2xl flex flex-col justify-center items-center shadow-sm">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider block">Akumulasi Skor</span>
                <div className="text-4xl font-black text-[#0d3b78] my-1 tracking-tight">
                  {score} <span className="text-xs font-bold text-slate-400">Poin</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Terbaca dan Dinilai oleh Sistem</span>
              </div>

              {/* Status and Database storage card */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-150 p-5 rounded-2xl flex flex-col justify-center items-center shadow-sm space-y-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Penyimpanan Cloud</span>
                
                {isSaving ? (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sinkronisasi Data...</span>
                  </div>
                ) : saveSuccess ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <CloudLightning className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Tersimpan di Cloud!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Skor Tersimpan Lokal</span>
                  </div>
                )}
                
                <span className="text-[10px] font-semibold text-slate-400 text-center leading-tight">
                  Siswa: {session.name || "Tamu"} • {session.kelas ? `Kelas ${session.kelas}` : "Kelas 7"}
                </span>
              </div>
            </div>

            {/* Detail Analisis & Pembahasan Jawaban (Review Section) */}
            {gameType !== 1 && (
              <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 text-left space-y-4 relative z-10 shadow-inner mt-8">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-500" /> Detail Analisis & Pembahasan Jawaban
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    Siswa: {session.name || "Siswa Tamu"}
                  </span>
                </div>
                
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  { (gameType === 2 ? imageGameList : riddleList).map((item, idx) => {
                    const answer = userAnswers[idx];
                    const isCorrect = answer?.isCorrect;
                    const isTimeout = answer?.timeOut;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 justify-between items-start md:items-center ${
                          isCorrect 
                            ? "bg-emerald-50/70 border-emerald-200" 
                            : isTimeout 
                              ? "bg-amber-50/70 border-amber-200"
                              : "bg-rose-50/70 border-rose-200"
                        }`}
                      >
                        {/* Question Content */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-500">Soal #{idx + 1}</span>
                            {isCorrect ? (
                              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 animate-pulse" /> Benar (+20 Poin)
                              </span>
                            ) : isTimeout ? (
                              <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                ⏱ Waktu Habis (+0 Poin)
                              </span>
                            ) : (
                              <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-rose-600 animate-bounce" /> Salah (+0 Poin)
                              </span>
                            )}
                          </div>
                          
                          {/* Description or Image clue */}
                          {gameType === 2 ? (
                            <div className="flex items-center gap-3">
                              <img 
                                src={(item as ImageGameItem).imageUrl} 
                                alt={(item as ImageGameItem).translation} 
                                className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0 shadow-sm" 
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-xs font-black text-slate-700">Mufrodat: {(item as ImageGameItem).translation}</span>
                            </div>
                          ) : (
                            <p className="text-xs font-black text-slate-700 leading-relaxed">
                              "{ (item as RiddleItem).clue }"
                            </p>
                          )}

                          {/* Educational Explanation */}
                          {item.explanation && (
                            <div className="bg-white/90 border border-slate-150 p-3 rounded-lg text-xs font-semibold text-slate-600 leading-relaxed shadow-sm">
                              <span className="font-black text-[#0d3b78] block mb-1">Penjelasan Edukatif:</span>
                              {item.explanation}
                            </div>
                          )}
                        </div>

                        {/* Answers comparison panel */}
                        <div className="flex flex-row md:flex-col gap-3 md:gap-1.5 md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-dashed border-slate-200/80 pt-2.5 md:pt-0">
                          <div>
                            <span className="text-[9px] font-extrabold uppercase text-slate-400 block tracking-wider">Jawaban Kamu</span>
                            <span className={`text-sm font-black font-arabic ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {answer?.chosenText || "(Waktu Habis)"}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[9px] font-extrabold uppercase text-slate-400 block tracking-wider text-right">Kunci Jawaban</span>
                            <span className="text-sm font-black font-arabic text-[#0d3b78] block">
                              {item.arabic}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 font-sans block">
                              ({item.pronunciation})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-4 relative z-10">
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Masuk ke Pembelajaran Utama 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
