import { 
  KbcSection, 
  CpFaseDSection, 
  ContohItem, 
  MateriContent, 
  LatihanItem, 
  EvaluasiQuestion, 
  StudentScore, 
  ReferensiItem,
  ArabicQuote
} from '../types';
import maleGraduateAvatar from '../assets/images/male_graduate_avatar_1783514919038.jpg';
import ruangKelasImg from '../assets/images/ruang_kelas_sekolah_1784906345092.jpg';
import perpustakaanImg from '../assets/images/perpustakaan_sekolah_1784906361229.jpg';
import bukuBahasaArabImg from '../assets/images/buku_pelajaran_bahasa_arab_1784908247091.jpg';
import ayahPedagangPasarImg from '../assets/images/ayah_pedagang_pasar_1784907752414.jpg';
import tamanBustanImg from '../assets/images/taman_bustan_1784907809254.jpg';
import siswaMembacaPerpustakaanImg from '../assets/images/siswa_membaca_perpustakaan_1784907841919.jpg';

export const RESEARCH_INFO = {
  title: "PENGEMBANGAN MEDIA PEMBELAJARAN INTERAKTIF TATA BAHASA ARAB (مُدْخَلُ القَوَاعِدِ الْعَرَبِيَّةِ)",
  subTitle: "Metode Pembelajaran Mendalam Berbasis Pembelajaran Terstruktur untuk Siswa Fase D (Madrasah Tsanawiyah / SMP)",
  investigator: "Tim Peneliti Pengembangan Kurikulum Bahasa Arab",
  school: "MTs Nurul Islam Ngaliyan Semarang",
  description: "Website ini merupakan media pembelajaran digital untuk membantu peserta didik pemula (mubtadi'īn) memahami kaidah dasar bahasa Arab secara mudah, interaktif, dan aplikatif.",
  features: [
    {
      title: "Pendekatan Contoh–Materi–Latihan",
      desc: "Belajar melalui contoh, materi, dan latihan secara bertahap.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Kurikulum Fase D Terintegrasi",
      desc: "Materi sesuai CP Bahasa Arab Fase D.",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "KBC (Keterampilan Berpikir Cinta)",
      desc: "Latihan interaktif untuk melatih kecepatan berpikir dan memahami materi.",
      color: "from-rose-500 to-pink-600"
    },
    {
      title: "Responsif & Elegan",
      desc: "Tampilan modern yang responsif di berbagai perangkat.",
      color: "from-emerald-500 to-teal-600"
    }
  ]
};

export const PROFILE_INFO = {
  author: {
    name: "Miftah Rizki Abdulloh",
    role: "Peneliti",
    avatar: maleGraduateAvatar,
    phone: "+62 85715680212",
    bio: "Peneliti dan Pengembang Media Pembelajaran Interaktif Tata Bahasa Arab (Mubtadi'in).",
    email: "miftahrizky57@gmail.com"
  },
  school: {
    name: "Madrasah Tsanawiyah Nurul Islam Ngaliyan Semarang",
    address: "Jl. Prof. Dr. Hamka Ngaliyan, Kec. Ngaliyan, Kota Semarang, Jawa Tengah 50185",
    accreditation: "Akreditasi A (Unggul)",
    vision: "Mewujudkan generasi qurani yang unggul dalam ilmu bahasa, sains, dan akhlak mulia berbasis teknologi digital.",
    phone: "+62 85715680212",
    website: "www.mtsnuris-ngaliyan.sch.id"
  }
};

export const KBC_SUMMARY: KbcSection[] = [
  {
    title: "Konsep Keterampilan Berpikir Cepat (KBC) Bahasa Arab",
    content: "Keterampilan Berpikir Cepat (KBC) dalam pembelajaran bahasa Arab adalah kemampuan siswa untuk memproses informasi linguistik, membedakan jenis kata (Isim, Fi'il, Harf), serta menentukan kedudukan harakat akhir secara cepat dan presisi tanpa harus menghafal rumus verbal yang rumit.",
    points: [
      "Reflek Linguistik: Kemampuan spontan mengenali tanda fisik kata (tanwin, alif lam, tak marbuthah).",
      "Asosiasi Visual: Menghubungkan pola kata (Wazan) dengan makna secara intuitif.",
      "Pembelajaran Mendalam (Deep Learning): Proses internalisasi di mana siswa mampu merekonstruksi kalimat mandiri berdasarkan pola yang diamati, bukan sekadar meniru."
    ]
  },
  {
    title: "Prinsip Pembelajaran Mendalam (Deep Learning)",
    content: "Pembelajaran mendalam tercapai ketika siswa beralih dari sekadar penerima pasif (rote learning) menjadi pembelajar aktif yang mampu mengaitkan konsep baru dengan skema pemahaman yang telah ada sebelumnya.",
    points: [
      "Pembelajaran Induktif: Memulai dari data empiris (Contoh konkret) ke rumusan abstrak (Materi Kaidah).",
      "Analisis Kritis: Membandingkan perbedaan harakat pada posisi kalimat yang berbeda (I'rab).",
      "Aplikasi Kontekstual: Menguji pemahaman melalui latihan soal adaptif yang bervariasi."
    ]
  }
];

export const CP_FASE_D: CpFaseDSection[] = [
  {
    elemen: "Menyimak (Al-Istima')",
    capaian: "Siswa mampu memahami, menganalisis, dan merefleksi gagasan dari percakapan atau teks lisan sederhana terkait topik perkenalan, fasilitas sekolah, peralatan belajar, dan aktivitas sehari-hari.",
    kompetensi: ["Mendeteksi bunyi huruf & kata", "Mengidentifikasi makna kosakata inti", "Menangkap pesan tersurat dalam dialog"]
  },
  {
    elemen: "Membaca & Memirsa (Al-Qira'ah wa Al-Mutala'ah)",
    capaian: "Siswa mampu memahami struktur teks, menerjemahkan, dan mengevaluasi informasi dari teks tertulis sederhana yang berharakat lengkap mengenai lingkungan madrasah dan keluarga.",
    kompetensi: ["Membaca teks dengan intonasi tepat", "Menguraikan unsur-unsur pembentuk kalimat", "Menemukan gagasan utama paragraf"]
  },
  {
    elemen: "Berbicara & Mempresentasikan (Al-Kalam)",
    capaian: "Siswa mampu memproduksi ujaran bahasa Arab sederhana untuk berinteraksi, menyatakan keinginan, mendeskripsikan benda, serta mempresentasikan laporan singkat tentang hobi atau profesi.",
    kompetensi: ["Melakukan dialog interaktif (Hiwar)", "Menggunakan Isim Isyarah & Isim Sifat dengan benar", "Melafalkan kalimat berpola subjek-predikat (Jumlah Ismiyah)"]
  },
  {
    elemen: "Menulis (Al-Kitabah)",
    capaian: "Siswa mampu menyusun, memformulasikan, dan merevisi tulisan pendek dalam aksara Arab yang baik dan benar sesuai kaidah dasar tata bahasa (Isim, Fi'il, Harf).",
    kompetensi: ["Menyusun kata acak menjadi kalimat padu", "Menulis kata berharakat akhir sesuai kedudukan gramatikal", "Membuat karangan terbimbing sangat pendek (Insya' Muwajjah)"]
  }
];

// MATERI FLOW: Contoh (1) -> Materi (2) -> Latihan (3)
export interface MateriItem {
  id: number;
  topik: string;
  subTopik: string;
  contohList: ContohItem[];
  materiContent: MateriContent;
  latihanList: LatihanItem[];
}

export const DAFTAR_MATERI: MateriItem[] = [
  {
    id: 1,
    topik: "Tata Bahasa Satu: Al-Istifham (الإِسْتِفْهَامُ)",
    subTopik: "Materi Kata Tanya dalam Percakapan Perkenalan (الْتَّعارفُ)",
    contohList: [
      {
        id: 21,
        arabic: "حَسَنُ : <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>مَنْ</span></u> أَنْتَ؟<br/>حُسَيْنُ : أَنَا مُهَنْدِسٌ",
        latin: "Hasanu: <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Man</span></u> anta?<br/>Husain: Ana muhandisun.",
        translation: "Hasanu: Siapa kamu (laki-laki)?\nHusain: Saya seorang insinyur.",
        explanation: "Perhatikan kata tanya 'مَنْ' (Siapa):\n- Kata 'مَنْ' digarisbawahi dan diwarnai merah khusus sebagai kata tanya (istifhām).\n- Digunakan khusus untuk menanyakan manusia / subjek yang berakal (orang).\n- 'أَنْتَ' adalah kata ganti untuk kamu laki-laki.\n- 'مُهَنْدِسٌ' (muhandisun) berarti insinyur."
      },
      {
        id: 22,
        arabic: "خَدِيْجَةُ : <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>هَلْ</span></u> أَنْتِ صَحَفِيَّةٌ؟<br/>فَاطِمَةُ : نَعَمْ، أَنَا صَحَفِيَّةٌ",
        latin: "Khodijatu: <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Hal</span></u> anti sohapiyatun?<br/>Fatimatu: Naam ana sohapiyatun.",
        translation: "Khodijatu: Apakah kamu (perempuan) seorang jurnalis?\nFatimatu: Ya, saya seorang jurnalis.",
        explanation: "Perhatikan kata tanya 'هَلْ' (Apakah):\n- Kata 'هَلْ' digarisbawahi dan diwarnai merah khusus sebagai kata tanya (istifhām).\n- Digunakan untuk mengonfirmasi suatu hal, sehingga jawabannya membutuhkan 'نَعَمْ' (Ya) atau 'لَا' (Tidak).\n- 'أَنْتِ' adalah kata ganti untuk kamu perempuan.\n- 'صَحَفِيَّةٌ' (sohapiyatun/shahafiyyatun) berarti jurnalis perempuan."
      },
      {
        id: 23,
        arabic: "خَدِيْجَةُ : <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>مَا</span></u> هَذِهِ؟<br/>فَاطِمَةُ : هَذِهِ كُرَّاسَةٌ",
        latin: "Khadijatu: <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Maa</span></u> hadzihi?<br/>Fatimatu: Hadzihi kurosatun.",
        translation: "Khadijatu: Apa ini (perempuan)?\nFatimatu: Ini buku tulis.",
        explanation: "Perhatikan kata tanya 'مَا' (Apa):\n- Kata 'مَا' digarisbawahi dan diwarnai merah khusus sebagai kata tanya (istifhām).\n- Digunakan khusus menanyakan kata benda atau hal-hal yang tidak berakal (benda mati/hewan).\n- 'هَذِهِ' (hadzihi) adalah kata tunjuk dekat untuk benda jenis perempuan (muannats).\n- 'كُرَّاسَةٌ' (kurosatun) berarti buku tulis."
      }
    ] as ContohItem[],
    materiContent: {
      title: "Tata Bahasa 1: Al-Istifham (الْإِسْتِفْهَامُ)",
      introduction: "Kata tanya dalam bahasa Arab disebut istifham. Kata tanya dalam bahasa Arab digunakan untuk menanyakan sesuatu, baik yang berakal maupun tidak berakal. Alat untuk menanyakan sesuatu dalam bahasa Arab, ada yang disebut huruf istifham dan isim istifham. Pada pelajaran ini, kita tidak akan membahas keduanya, tetapi hanya mengenalkan kosakata tanya dalam bahasa Arab yang dapat digunakan dalam percakapan sehari-hari. Kata tanya yang akan kita pelajari adalah مَا، مَنْ، مِنْ أَيْنَ، هَلْ dan كَيْفَ\n\nPerhatikan tabel berikut!",
      table: [
        {
          no: "1",
          kataTanya: "هَلْ",
          arti: "Apakah",
          peruntukan: "Menanyakan kepastian sehingga jawabannya hanya “ya” (نَعَمْ) atau “tidak” (لا).",
          contohPertanyaan: "هَلْ هَذَا كِتَابُكَ؟",
          contohJawaban: "1. نَعَمْ، هَذَا كِتَابِيْ\n2. لَا، هَذَا كِتَابُ صَدِيْقِيْ"
        },
        {
          no: "2",
          kataTanya: "مِنْ أَيْنَ",
          arti: "Dari mana",
          peruntukan: "Menanyakan dari mana datang suatu benda.",
          contohPertanyaan: "مِنْ أَيْنَ جِئْتَ؟",
          contohJawaban: "جِئْتُ مِنْ سِيْمَارَانْج."
        },
        {
          no: "3",
          kataTanya: "مَنْ",
          arti: "Siapa",
          peruntukan: "Menanyakan kata benda yang berakal (seseorang).",
          contohPertanyaan: "1. مَنْ أَنْتَ؟\n2. مَنْ صَدِيْقُكَ؟",
          contohJawaban: "1. أَنَا سُلَيْمَانُ\n2. صَدِيْقِيْ خَالِدٌ"
        },
        {
          no: "4",
          kataTanya: "مَا",
          arti: "Apa",
          peruntukan: "Menanyakan kata benda yang tidak berakal (benda).",
          contohPertanyaan: "1. مَا هَذَا؟\n2. مَا تِلْكَ؟",
          contohJawaban: "1. هَذَا مَكْتَبٌ\n2. تِلْكَ كُرَّاسَةٌ"
        },
        {
          no: "5",
          kataTanya: "كَيْفَ",
          arti: "Bagaimana",
          peruntukan: "Menanyakan keadaan",
          contohPertanyaan: "1. كَيْفَ حَالُكَ؟\n2. كَيْفَ نَجَحْتَ فِي الْإِمْتِحَانِ",
          contohJawaban: "1. الْحَمْدُ للهِ، أَنَا بِخَيْرٍ\n2. نَجَحْتُ فِي الْإِمْتِحَانِ بِسَبَبِ جُهْدِيْ فِي التَّعَلُّمِ."
        }
      ],
      sections: [
        {
          subtitle: "Keterangan Kaidah Penggunaan:",
          explanation: "Berikut penjelasan detail fungsi masing-masing kata tanya berdasarkan tabel di atas:",
          points: [
            "1. هَلْ digunakan untuk menanyakan keadaan sesuatu yang belum pasti. Jawaban dari pertanyaan ini selalu diawali dengan \"ya\" (نَعَمْ) atau \"tidak\" (لَا), sebagaimana contoh dalam tabel di atas.",
            "2. مِنْ أَيْنَ digunakan untuk menanyakan asal sesuatu (lihat contoh di atas!).",
            "3. مَنْ digunakan untuk menanyakan kata benda berakal atau seseorang, sebagaimana contoh di atas.",
            "4. مَا digunakan untuk menanyakan sesuatu yang tidak berakal, selain manusia, sebagaimana contoh di atas.",
            "5. كَيْفَ digunakan untuk menanyakan kabar, kondisi atau keadaan sesuatu (lihat contoh di atas!)."
          ]
        }
      ]
    } as MateriContent,
    latihanList: [
      {
        id: 21,
        question: "١) مَا مَعْنَى \"كَيْفَ\"؟",
        options: [
          "A. Di mana",
          "B. Siapa",
          "C. Bagaimana",
          "D. Kapan"
        ],
        correctAnswer: 2,
        explanation: "Lafal 'كَيْفَ' (kayfa) berarti 'Bagaimana', digunakan untuk menanyakan keadaan atau kabar."
      },
      {
        id: 22,
        question: "٢) مَا مَعْنَى \"أَيْنَ\"؟",
        options: [
          "A. Dari mana",
          "B. Di mana",
          "C. Kapan",
          "D. Ke mana"
        ],
        correctAnswer: 1,
        explanation: "Lafal 'أَيْنَ' (ayna) berarti 'Di mana', digunakan untuk menanyakan tempat atau lokasi."
      },
      {
        id: 23,
        question: "٣) أَيْنَ فَصْلُ السَلْمَىْ؟",
        options: [
          "أ. وَرَاءَ الْبُسْتَانِ",
          "ب. أَمَامَ الْمَسْجِدِ",
          "ج. فِي الْمَكْتَبَةِ",
          "د. جَانِبَ الْفَصْلِ"
        ],
        correctAnswer: 1,
        explanation: "Berdasarkan percakapan di atas, Salma mengatakan: 'فَصْلِيْ أَمَامَ الْمَسْجِدِ' (Kelasku di depan masjid)."
      },
      {
        id: 24,
        question: "٤) أَيْنَ فَصْلُ خَدِيْجَةَ؟",
        options: [
          "أ. أَمَامَ الْمَسْجِدِ",
          "ب. وَرَاءَ الْبُسْتَانِ",
          "ج. أَمَامَ السَاحَةِ",
          "د. وَرَاءَ الْمَكْتَبَةِ"
        ],
        correctAnswer: 1,
        explanation: "Berdasarkan percakapan di atas, Khadijah mengatakan: 'فَصْلِيْ وَرَاءَ الْبُسْتَانِ' (Kelasku di belakang kebun)."
      },
      {
        id: 25,
        question: "٥) كَيْفَ فَصْلُ خَدِيْجَةَ؟",
        options: [
          "أ. صَغِيْرٌ وَقَذِرٌ",
          "ب. وَاسِعٌ وَجَمِيْلٌ",
          "ج. كَبِيْرٌ وَنَظِيْفٌ",
          "د. مَكْتَبَةٌ كَبِيْرَةٌ"
        ],
        correctAnswer: 2,
        explanation: "Berdasarkan percakapan di atas, Khadijah mengatakan: 'نَعَمْ، فَصْلِيْ كَبِيْرٌ وَنَظِيْفٌ' (Ya, kelasku besar dan bersih)."
      },
      {
        id: 26,
        question: "٦) مِنْ أَيْنَ أَنْتَ؟ .......... مِنْ جَاكَرْتَا.",
        options: [
          "أ. أَنَا",
          "ب. هُوَ",
          "ج. هِيَ",
          "د. أَنْتَ"
        ],
        correctAnswer: 0,
        explanation: "Pertanyaan 'Dari mana kamu?' membutuhkan jawaban orang pertama 'Saya dari Jakarta' ('أَنَا مِنْ جَاكَرْتَا')."
      },
      {
        id: 27,
        question: "٧) هَلْ أَنْتَ مُدَرِّسٌ؟ لَا، أَنَا ..........",
        options: [
          "أ. مُدَرِّسٌ",
          "ب. طَالِبٌ",
          "ج. طَالِبَةٌ",
          "د. مُدَرِّسَةٌ"
        ],
        correctAnswer: 1,
        explanation: "Pertanyaan 'Apakah kamu (laki-laki) seorang guru?' dijawab 'Tidak, saya...' Karena mengonfirmasi laki-laki ('أَنْتَ'), maka jawabannya harus kata benda laki-laki yaitu 'طَالِبٌ' (siswa), bukan 'طَالِبَةٌ' (siswi)."
      },
      {
        id: 28,
        question: "٨) مَااسْمُكَ؟ .......... حَسَنُ",
        options: [
          "أ. إِسْمُهُمَا",
          "ب. إِسْمُهَا",
          "ج. إِسْمِيْ",
          "د. إِسْمُكِ"
        ],
        correctAnswer: 2,
        explanation: "Pertanyaan 'Siapa namamu (laki-laki)?' dijawab dengan 'Namaku Hasan' ('إِسْمِيْ حَسَنُ')."
      },
      {
        id: 29,
        question: "٩) أَحْمَدُ : مِنْ أَيْنَ أَنْتَ؟\n...............",
        options: [
          "أ. أَنَا مِنَ الْمَلْعَبِ",
          "ب. أَنْتَ مِنَ الْفَصْلِ",
          "ج. هُوَ عَنِ الْمَلْعَبِ",
          "د. هُمَا عَنِ الْبَيْتِ"
        ],
        correctAnswer: 0,
        explanation: "Jawaban yang tepat untuk pertanyaan 'Dari mana kamu?' adalah 'Saya dari lapangan' ('أَنَا مِنَ الْمَلْعَبِ')."
      },
      {
        id: 30,
        question: "١٠) هَلْ هَذَا كِتَابُكَ ؟ لَا, هَذَا ...............",
        options: [
          "أ. قَلَمِيْ",
          "ب. كِتَابِيْ",
          "ج. كِتَابُ أَخِيْ",
          "د. أَنَا"
        ],
        correctAnswer: 2,
        explanation: "Pertanyaan 'Apakah ini bukumu?' dijawab dengan sanggahan 'Tidak, ini buku saudaraku' ('لَا، هَذَا كِتَابُ أَخِيْ')."
      }
    ] as LatihanItem[]
  },
  {
    id: 2,
    topik: "Tata Bahasa Dua: Al-Mubtada' wal Khabar (الْمُبْتَدَأُ وَالْخَبَرُ)",
    subTopik: "Subjek dan Predikat dalam Struktur Kalimat Nominal Bahasa Arab",
    contohList: [
      {
        id: 31,
        arabic: "<u style='text-underline-offset: 6px; text-decoration-color: #0d3b78;'><span style='color: #0d3b78;'>هُوَ</span></u> <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>يَذْهَبُ إِلَى الْمَدْرَسَةِ</span></u>",
        latin: "<u style='text-underline-offset: 3px; text-decoration-color: #0d3b78;'><span style='color: #0d3b78; font-weight: bold;'>Huwa</span></u> <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>yadhabu ilal-madrasati</span></u>",
        translation: "Dia (laki-laki) pergi ke sekolah.",
        explanation: "Perhatikan struktur kalimat nominal (Jumlah Ismiyah) dengan kata ganti:\n- هُوَ (Dia) adalah Mubtada' (subjek) berupa kata ganti (Dhamir) laki-laki.\n- يَذْهَبُ إِلَى الْمَدْرَسَةِ (Pergi ke sekolah) adalah Khabar (predikat) berupa kalimat kata kerja (Jumlah Fi'liyah) yang menerangkan aktivitas Mubtada'."
      },
      {
        id: 32,
        arabic: "<u style='text-underline-offset: 6px; text-decoration-color: #0d3b78;'><span style='color: #0d3b78;'>حَفْصَةُ</span></u> <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>طَبِيْبَةٌ</span></u>",
        latin: "<u style='text-underline-offset: 3px; text-decoration-color: #0d3b78;'><span style='color: #0d3b78; font-weight: bold;'>Hafshatu</span></u> <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>thabiibatun</span></u>",
        translation: "Hafsah adalah seorang dokter (perempuan).",
        explanation: "Perhatikan keselarasan gender perempuan (Muannats):\n- حَفْصَةُ (Hafsah) adalah Mubtada' (subjek) berupa Isim Alam (nama orang perempuan).\n- طَبِيْبَةٌ (Dokter) adalah Khabar (predikat) yang juga wajib berjenis perempuan (Muannats) yang ditandai dengan Ta' Marbuthah (ة)."
      },
      {
        id: 33,
        arabic: "<u style='text-underline-offset: 6px; text-decoration-color: #0d3b78;'><span style='color: #0d3b78;'>هِيَ</span></u> <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>صَدِيْقَتِيْ</span></u>",
        latin: "<u style='text-underline-offset: 3px; text-decoration-color: #0d3b78;'><span style='color: #0d3b78; font-weight: bold;'>Hiya</span></u> <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>shadiiqatii</span></u>",
        translation: "Dia (perempuan) adalah temanku.",
        explanation: "Perhatikan keselarasan gender dengan kata ganti kepemilikan:\n- هِيَ (Dia) adalah Mubtada' (subjek) berupa kata ganti (Dhamir) perempuan.\n- صَدِيْقَتِيْ (Temanku) adalah Khabar (predikat) yang juga berjenis perempuan (Muannats) dengan sandangan kata ganti kepemilikan 'saya' (Ya' Mutakallim)."
      }
    ] as ContohItem[],
    materiContent: {
      title: "Tata Bahasa 2: Al-Mubtada’ wal Khabar (الْمُبْتَدَأُ وَالْخَبَرُ)",
      introduction: "Mubtada’ adalah isim marfu’ yang terletak di awal kalimat. Mubtada’ merupakan subjek yang diterangkan. Adapun khabar adalah isim yang menerangkan mubtada’ sehingga maknanya menjadi sempurna.\n\nPada umumnya, mubtada’ memiliki empat ciri, yaitu marfu’, terletak di awal kalimat, ma’rifah, dan berupa isim damir. Pada pelajaran ini, akan diperkenalkan mubtada’ yang terdiri atas isim damir mufrad (kata ganti tunggal). Damir merupakan isim ma’rifah yang mabni. Maksud dari mabni adalah tidak berubah harakat akhirnya, baik dalam kedudukan rafa’, nasab, maupun jarr. Jadi, isim damir mufrad (kata ganti tunggal) di sini sering juga dikenal dengan kata yang menujukan makna saya, kamu, dan dia, baik laki – laki maupun perempuan.\n\nPerhatikan tabel di bawah ini!",
      sections: [],
      mubtadaTable: [
        {
          dhamir: "أَنَا",
          contoh: "طَالِبٌ / طَالِبَةٌ",
          makna: "Saya (lk/pr) seorang murid."
        },
        {
          dhamir: "أَنْتَ",
          contoh: "طَالِبٌ",
          makna: "Kamu (lk) seorang murid."
        },
        {
          dhamir: "أَنْتِ",
          contoh: "طَالِبَةٌ",
          makna: "Kamu (pr) seorang murid."
        },
        {
          dhamir: "هُوَ",
          contoh: "طَالِبٌ",
          makna: "Dia (lk) seorang murid."
        },
        {
          dhamir: "هِيَ",
          contoh: "طَالِبَةٌ",
          makna: "Dia (pr) seorang murid."
        }
      ],
      keteranganMubtada: [
        "Kata أَنَا, أَنْتَ, أَنْتِ, هُوَ, هِيَ adalah mubtada’ yang terdiri atas damir munfasil (damir yang berdiri sendiri).",
        "Kata طَالِبٌ / طَالِبَةٌ merupakan khabar (isim yang menerangkan mubtada’).",
        "Khabar harus menyesuaikan mubtada’ dalam bilangan (mufrad, mutsanna, dan jamak).",
        "Khabar menyesuaikan mubtada’ dalam hal jenis (muzakkar dan mu’annas)."
      ],
      sifatTableTitle: "Perhatikan contoh – contoh khabar yang terdiri atas kata sifat berikut!",
      sifatTable: [
        {
          contoh: "الْبَيْتُ كَبِيْرٌ",
          mubtada: "الْبَيْتُ",
          khabar: "كَبِيْرٌ"
        },
        {
          contoh: "الْجَبَلُ مُرْتَفِعٌ",
          mubtada: "الْجَبَلُ",
          khabar: "مُرْتَفِعٌ"
        },
        {
          contoh: "الصُّوْرَةُ جَمِيْلَةٌ",
          mubtada: "الصُّوْرَةُ",
          khabar: "جَمِيْلَةٌ"
        },
        {
          contoh: "الْرَّوْضَةُ وَاسِعَةٌ",
          mubtada: "الْرَّوْضَةُ",
          khabar: "وَاسِعَةٌ"
        }
      ],
      materiTambahan: {
        title: "📘 Materi Tambahan: Mubtada’ & Khabar",
        points: [
          "Isim ma‘rifat di awal kalimat menjadi mubtada’.",
          "Hukum mubtada’ adalah rafa‘ (marfū‘).",
          "Mubtada’ bisa didahului oleh kata penghubung atau partikel seperti: مَا، مَنْ، لَا، هَلْ، أَ، بَلْ، أَمَّا، وَلَكِنْ، وَ، فَ، ثُمَّ، إِنَّمَا، أَلَا"
        ],
        macamMaarifatingTitle: "Macam Isim Ma‘rifat (6 macam)",
        macamMaarifatingList: [
          {
            id: 1,
            title: "Isim yang ada al",
            contoh: "الْمَسْجِدُ، الْمَدْرَسَةُ، الْقَلَمُ"
          },
          {
            id: 2,
            title: "Isim ḍlamir",
            contoh: "أَنَا، نَحْنُ، هُوَ، هُمَا، هُمْ، هِيَ، هُنَّ، هُ، هُمَا، هُمْ"
          },
          {
            id: 3,
            title: "Isim isyarah",
            contoh: "هَذَا، هَذَانِ، هَاؤُلَاءِ، هَذِهِ، هَاتَانِ، ذَلِكَ، تِلْكَ، هُنَالِكَ، هَاهُنَا"
          },
          {
            id: 4,
            title: "Nama ‘alam",
            contoh: "أَحْمَدُ، مُحَمَّدُ، فَاطِمَةُ، عُمَرٌ، عُثْمَانٌ، إِبْرَهِيْمُ"
          },
          {
            id: 5,
            title: "Isim maushul",
            contoh: "مَنْ، مَا، الَّذِى، الَّلذَانِ، الَّذِيْنَ، الَّتِى"
          },
          {
            id: 6,
            title: "Idhāfah bila mudhāf ilaih-nya ma‘rifat",
            contoh: "بَابُ الْمَسْجِدِ، كِتَابُ الْفِقْهِ، أَهْلُ الْكِتَابِ، أَصْحَابُ الْجَنَّةِ"
          }
        ],
        closingPoint: "Khabar adalah bagian kalimat yang menyempurnakan faedah, sehingga kalimat dapat dipahami."
      }
    } as MateriContent,
    latihanList: [
      {
        id: 31,
        question: "Kata benda yang terletak di awal kalimat nominal (Jumlah Ismiyah) dan berfungsi sebagai subjek disebut...",
        options: [
          "Fi'il (Kata Kerja)",
          "Mubtada' (Subjek)",
          "Khabar (Predikat)",
          "Harf (Kata Depan)"
        ],
        correctAnswer: 1,
        explanation: "Subjek kalimat nominal di awal kalimat disebut Mubtada'."
      },
      {
        id: 32,
        question: "Mengapa susunan kalimat 'الْمَدْرَسَةُ جَمِيْلٌ' dianggap keliru dalam tata bahasa Arab?",
        options: [
          "Karena tidak menggunakan tanda tanya",
          "Karena tidak ada kata kerja di dalamnya",
          "Karena Mubtada'-nya perempuan (Muannats) tetapi Khabar-nya laki-laki (Mudzakkar)",
          "Karena diawali huruf Alif Lam"
        ],
        correctAnswer: 2,
        explanation: "الْمَدْرَسَةُ memiliki Ta' Marbuthah (Muannats), sehingga Khabarnya juga wajib Muannats yaitu 'جَمِيْلَةٌ', bukan 'جَمِيْلٌ'."
      },
      {
        id: 33,
        question: "Tentukan manakah lafal yang berkedudukan sebagai Khabar pada kalimat 'عَلِيٌّ طَالِبٌ' (Ali adalah seorang siswa)?",
        options: [
          "عَلِيٌّ",
          "طَالِبٌ",
          "Tidak ada khabar",
          "Kedua kata di atas"
        ],
        correctAnswer: 1,
        explanation: "عَلِيٌّ adalah subjek (Mubtada'), sedangkan 'طَالِبٌ' adalah predikat penjelas (Khabar)."
      },
      {
        id: 34,
        question: "Pilihlah Khabar yang selaras dan tepat untuk melengkapi kalimat berikut: 'السَّبُّوْرَةُ ...' (Papan tulis itu...)",
        options: [
          "نَظِيْفٌ (Nadhiifun)",
          "نَظِيْفَةٌ (Nadhiifatun)",
          "كَبِيْرٌ (Kabiirun)",
          "مَفْتُوْحٌ (Maftuuhun)"
        ],
        correctAnswer: 1,
        explanation: "السَّبُّوْرَةُ adalah kata benda Muannats, sehingga membutuhkan khabar Muannats yang diakhiri Ta' Marbuthah pula, yaitu 'نَظِيْفَةٌ'."
      }
    ] as LatihanItem[]
  },
  {
    id: 3,
    topik: "Qoidah Tahiyyah: Ucapan Sapaan (الْتَّحِيَّاتُ)",
    subTopik: "Ungkapan Sapaan dan Pasangan Jawaban Respon dalam Komunikasi Harian",
    contohList: [
      {
        id: 41,
        arabic: "أَحْمَدُ : <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>أَنَا سَعِيْدٌ بِهٰذَا اللِّقَاءِ</span></u><br/>مُحَمَّدٌ : <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>وَأَنَا كَذٰلِكَ</span></u>",
        latin: "Ahmadu: <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Ana sa'eedun bihaadzal-liqoo'i</span></u><br/>Muhammadun: <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Wa ana kadzaalika</span></u>",
        translation: "Ahmad: Saya senang dengan pertemuan ini.\nMuhammad: Dan saya juga demikian.",
        explanation: "Ucapan kebahagiaan dalam pertemuan"
      },
      {
        id: 42,
        arabic: "حَسَنُ : <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>أَهْلًا وَسَهْلًا</span></u><br/>عَلِيٌّ : <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>أَهْلًا بِكَ</span></u>",
        latin: "Hasanu: <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Ahlan wa sahlan</span></u><br/>'Aliyyun: <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Ahlan bika</span></u>",
        translation: "Hasan: Selamat datang!\nAli: Selamat datang juga untukmu!",
        explanation: "Ucapan untuk selamat datang."
      },
      {
        id: 43,
        arabic: "إِبْرَاهِيْمُ : <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>مَسَاءُ الْخَيْرِ</span></u><br/>إِسْمَاعِيْلُ : <u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>مَسَاءُ النُّوْرِ</span></u>",
        latin: "Ibraahiimu: <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Masaa-ul khairi</span></u><br/>Ismaa'iilu: <u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Masaa-un-nuuri</span></u>",
        translation: "Ibrahim: Selamat sore!\nIsmail: Selamat sore juga!",
        explanation: "Ucapan untuk selamat sore."
      }
    ] as ContohItem[],
    materiContent: {
      title: "Ucapan Sapaan (التَّحِيَّاتُ)",
      introduction: "Dalam percakapan di atas digunakan kata sapaan atau ucapan salam Ketika kita bertemu seseorang atau teman. Pada pertemuan tersebut terkadang ada seseorang yang belum kita kenal dan sudah kita kenal. Dalam pertemuan tersebut tentu kita ingin memberikan kesan yang baik kepada orang yang kita sapa. Nah, berikut ini adalah kata sapaan dalam bahasa Arab yang biasa dipakai dalam percakapan sehari-hari.",
      tahiyyahTable: [
        {
          tahiyyah: "السَّلَامُ عَلَيْكُمْ",
          jawab: "وَعَلَيْكُمُ السَّلَامُ",
          bayan: "Diucapkan ketika bertemu."
        },
        {
          tahiyyah: "أَهْلًا وَسَهْلًا",
          jawab: "أَهْلًا بِكَ",
          bayan: "Ucapan untuk selamat datang."
        },
        {
          tahiyyah: "كَيْفَ حَالُكَ؟",
          jawab: "بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ",
          bayan: "Digunakan untuk menanyakan keadaan."
        },
        {
          tahiyyah: "صَبَاحُ الْخَيْرِ",
          jawab: "صَبَاحُ النُّوْرِ",
          bayan: "Ucapan untuk selamat pagi."
        },
        {
          tahiyyah: "نَهَارُكَ سَعِيْدٌ",
          jawab: "سَعِيْدٌ مُبَارَكٌ",
          bayan: "Ucapan untuk selamat siang."
        },
        {
          tahiyyah: "مَسَاءُ الْخَيْرِ",
          jawab: "مَسَاءُ النُّوْرِ",
          bayan: "Ucapan untuk selamat sore."
        },
        {
          tahiyyah: "لَيْلَتُكَ سَعِيْدَةٌ",
          jawab: "سَعِيْدَةٌ مُبَارَكَةٌ",
          bayan: "Ucapan untuk selamat malam."
        },
        {
          tahiyyah: "مَا اسْمُكَ؟ / مَا اسْمُكِ؟",
          jawab: "اِسْمِيْ....",
          bayan: "Ucapan untuk menanyakan nama."
        },
        {
          tahiyyah: "مِنْ أَيْنَ أَنْتَ؟ / مِنْ أَيْنَ أَنْتِ؟",
          jawab: "أَنَا مِنْ ....",
          bayan: "Ucapan untuk menanyakan asalnya."
        },
        {
          tahiyyah: "مَا عُنْوَانُكَ؟ / مَا عُنْوَانُكِ؟",
          jawab: "عُنْوَانِيْ....",
          bayan: "Ucapan untuk menanyakan alamat."
        },
        {
          tahiyyah: "شُكْرًا",
          jawab: "عَفْوًا",
          bayan: "Ucapan terima kasih."
        },
        {
          tahiyyah: "أَنَا سَعِيْدٌ بِهٰذَا اللِّقَاءِ",
          jawab: "وَأَنَا كَذٰلِكَ",
          bayan: "Ucapan kebahagiaan dalam pertemuan."
        },
        {
          tahiyyah: "إِلَى اللِّقَاءِ",
          jawab: "مَعَ السَّلَامَةِ",
          bayan: "Ucapan sampai jumpa kembali."
        }
      ],
      tahiyyahTambahanIntro: "Materi utama telah memperkenalkan berbagai ucapan sapaan dasar (التَّحِيَّاتُ) yang digunakan dalam percakapan sehari-hari. Untuk melengkapi pemahaman siswa, berikut disajikan materi tambahan yang berisi ungkapan-ungkapan lain yang belum tercantum dalam materi utama. Ungkapan ini memperkaya komunikasi dengan nuansa penghormatan, keakraban, dan ekspresi emosional yang lebih luas.",
      tahiyyahTambahanTable: [
        {
          tahiyyah: "وَكَيْفَ حَالُكَ أَنْتَ؟",
          jawab: "أَنَا أَيْضًا بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ",
          bayan: "Digunakan untuk menanyakan keadaan."
        },
        {
          tahiyyah: "أَنَا مَسْرُوْرٌ بِلِقَائِكَ",
          jawab: "وَأَنَا كَذَلِكَ",
          bayan: "Ucapan kebahagiaan dalam pertemuan."
        },
        {
          tahiyyah: "تَشَرَّفْنَا",
          jawab: "تَشَرَّفْنَا",
          bayan: "Ucapan penghormatan dalam perkenalan."
        },
        {
          tahiyyah: "مَسَاءُ الْخَيْرِ",
          jawab: "مَسَاءُ الْبَهْجَةِ وَالسُّرُوْرِ",
          bayan: "Ucapan untuk selamat sore."
        },
        {
          tahiyyah: "أَنَا مُشْتَاقٌ إِلَيْكَ",
          jawab: "وَأَنَا كَذَلِكَ",
          bayan: "Ucapan kerinduan dalam percakapan."
        },
        {
          tahiyyah: "شُكْرًا",
          jawab: "عَفْوًا / لَا شُكْرَ عَلَى وَاجِبٍ",
          bayan: "Ucapan terima kasih."
        }
      ],
      sections: []
    } as MateriContent,
    latihanList: [
      {
        id: 41,
        question: "إِخْتَرِ الْإِجَابَةَ الصَّحِيحَةَ.\n\n١) س: مَا اسْمُكَ ، يَا أَخِيْ ؟\nج :......",
        options: [
          "أ. أَهْلًا بِكَ.",
          "ب. اِسْمِيْ عَلِيٌّ",
          "ج. بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ",
          "د. أَهْلًا وَسَهْلًا"
        ],
        correctAnswer: 1,
        explanation: "Pertanyaan 'مَا اسْمُكَ ، يَا أَخِيْ ؟' menanyakan nama saudara laki-laki, jawaban yang tepat adalah memberi tahu nama diri sendiri 'اِسْمِيْ عَلِيٌّ'."
      },
      {
        id: 42,
        question: "٢) س: ...... ؟\nج: بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ.",
        options: [
          "أ. صَبَاحُ الْخَيْرِ",
          "ب. السَّلَامُ عَلَيْكُمْ",
          "ج. كَيْفَ حَالُكَ؟",
          "د. أَهْلًا وَسَهْلًا"
        ],
        correctAnswer: 2,
        explanation: "Jawaban 'بِخَيْرٍ، وَالْحَمْدُ لِلّٰهِ' (Kabar baik, alhamdulillah) adalah respon khas untuk pertanyaan kabar 'كَيْفَ حَالُكَ؟' (Bagaimana kabarmu?)."
      },
      {
        id: 43,
        question: "٣) س: مَسَاءُ الْخَيْرِ!\nج:………….",
        options: [
          "أ. صَبَاحُ الْخَيْرِ",
          "ب. سَعِيْدَةٌ مُبَارَكَةٌ",
          "ج. نَهَارُكَ سَعِيْدٌ",
          "د. مَسَاءُ النُّوْرِ"
        ],
        correctAnswer: 3,
        explanation: "Sapaan sore 'مَسَاءُ الْخَيْرِ' (Selamat sore) dijawab dengan 'مَسَاءُ النُّوْرِ' (Selamat sore juga)."
      },
      {
        id: 44,
        question: "٤) عَلِيٌّ: مَا....؟\nفَاطِمَةُ : اِسْمِيْ فَاطِمَةُ.",
        options: [
          "أ. اسْمُكَ",
          "ب. اسْمُكِ",
          "ج. اسْمُهَا",
          "د. اسْمُهُ"
        ],
        correctAnswer: 1,
        explanation: "Karena yang ditanya adalah Fatimah (perempuan / muannats), maka kata ganti kepemilikan yang digunakan adalah muannats tunggal yaitu 'اسْمُكِ' (namamu [pr])."
      },
      {
        id: 45,
        question: "٥) س: إِلَى اللِّقَاءِ\nج: مَعَ السَّلَامَةِ",
        options: [
          "a. selamat datang",
          "b. selamat siang",
          "c. Sampai jumpa",
          "d. terima kasih"
        ],
        correctAnswer: 2,
        explanation: "Ungkapan 'إِلَى اللِّقَاءِ' berarti 'Sampai jumpa' yang dijawab dengan 'مَعَ السَّلَامَةِ' (Semoga dalam keselamatan)."
      },
      {
        id: 46,
        question: "٦) س: شُكْرًا\nج: عَفْوًا.",
        options: [
          "a. Terima kasih",
          "b. selamat siang",
          "c. sampai jumpa",
          "d. bagaimana kabar mu"
        ],
        correctAnswer: 0,
        explanation: "Ungkapan 'شُكْرًا' berarti 'Terima kasih', yang dibalas dengan 'عَفْوًا' (Sama-sama)."
      },
      {
        id: 47,
        question: "٧) س: أَنَا سَعِيْدٌ بِهَذَا اللِّقَاءِ\nج :......",
        options: [
          "أ. وَأَنَا كَذٰلِكَ",
          "ب. اِسْمِيْ ....",
          "ج. مَعَ السَّلَامَةِ",
          "د. عُنْوَانِيْ...."
        ],
        correctAnswer: 0,
        explanation: "Sapaan kebahagiaan dalam pertemuan 'أَنَا سَعِيْدٌ بِهَذَا اللِّقَاءِ' (Saya senang dengan pertemuan ini) dijawab dengan 'وَأَنَا كَذٰلِكَ' (Dan saya juga demikian)."
      },
      {
        id: 48,
        question: "٨) س: ........\nج : سَعِيْدَةٌ مُبَارَكَةٌ",
        options: [
          "أ. مَسَاءُ النُّوْرِ",
          "ب. اِسْمِيْ",
          "ج. لَيْلَتُكَ سَعِيْدَةٌ!",
          "د. مَا عُنْوَانُكَ؟"
        ],
        correctAnswer: 2,
        explanation: "Sapaan malam hari 'لَيْلَتُكَ سَعِيْدَةٌ!' (Selamat malam!) dijawab dengan 'سَعِيْدَةٌ مُبَارَكَةٌ' (Semoga malammu diberkahi)."
      },
      {
        id: 49,
        question: "٩) س: مِنْ أَيْنَ أَنْتَ؟\nج :......",
        options: [
          "أ. أَنَا مِنْ سُوْرابايا",
          "ب. عَفْوًا",
          "ج. سَعِيْدَةٌ مُبَارَكَةٌ",
          "د. مَسَاءُ الْخَيْرِ"
        ],
        correctAnswer: 0,
        explanation: "Pertanyaan 'مِنْ أَيْنَ أَنْتَ؟' (Dari mana kamu?) dijawab dengan asal kota/daerah, yaitu 'أَنَا مِنْ سُوْرابايا' (Saya dari Surabaya)."
      },
      {
        id: 50,
        question: "١٠) س : ....\nج: أَهْلًا بِكَ",
        options: [
          "أ. عَفْوًا",
          "ب. أَهْلًا وَسَهْلًا",
          "ج. وَأَنَا كَذٰلِكَ",
          "د. مَعَ السَّلَامَةِ"
        ],
        correctAnswer: 1,
        explanation: "Sapaan selamat datang 'أَهْلًا وَسَهْلًا' dijawab dengan 'أَهْلًا بِكَ'."
      }
    ] as LatihanItem[]
  },
  {
    id: 4,
    topik: "Tata Bahasa Tiga: Kata Ganti Personal Tunggal (إِسْمُ ضَمِيْرٍ لِلْمُفْرَدِ)",
    subTopik: "Kaidah Isim Dhamir Tunggal Orang Pertama, Kedua, dan Ketiga",
    contohList: [
      {
        id: 51,
        arabic: "<u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>هُوَ</span></u> شُرْطِيٌّ جَدِيْدٌ",
        latin: "<u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Huwa</span></u> syurthiyyun jadiidun",
        translation: "dia adalah polisi baru",
        explanation: "huwa adalah kata ganti orang ketiga tunggal untuk laki-laki (mudzakkar)"
      },
      {
        id: 52,
        arabic: "<u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>أَنْتِ</span></u> تِلْمِيْذَةٌ جَدِيْدَةٌ فِي الْمَدْرَسَةِ الثَّانَوِيَّةِ الْإِسْلَامِيَّةِ نُوْرِ الْإِسْلَامِ",
        latin: "<u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Anti</span></u> tilmiidzatun jadiidatun fil-madrasatits-tsaanawiyyatil-islaamiyyati nuuril-islaami",
        translation: "kamu adalah siswa baru di madrasah tsanawiyyah Nurul islam",
        explanation: "Adalah kata ganti orang kedua tunggal untuk perempuan (mu’annats)."
      },
      {
        id: 53,
        arabic: "<u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>أَنَا</span></u> عَلِيٌّ",
        latin: "<u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Ana</span></u> 'Aliyyun",
        translation: "saya adalah ali",
        explanation: "Adalah kata ganti orang pertama tunggal untuk laki-laki (mudzakkar) atau perempuan (mu’annats)."
      }
    ] as ContohItem[],
    materiContent: {
      title: "Materi Tata Bahasa 3 : Kata Ganti Personal Tunggal (إِسْمِ ضَمِيْرٍ لِلْمُفْرَدِ)",
      introduction: "Di atas telah disinggung tentang isim damir mufrad, yaitu kata ganti persona tunggal. Isim damir mufrad ada lima, yaitu أَنَا , أَنْتَ, أَنْتِ, هُوَ, dan هِيَ.",
      dhamirTable: [
        {
          dhamir: "أَنَا",
          arti: "Saya",
          keterangan: "Adalah kata ganti orang pertama tunggal untuk laki-laki (mudzakkar) atau perempuan (mu’annats)."
        },
        {
          dhamir: "أَنْتَ",
          arti: "Kamu (lk)",
          keterangan: "Adalah kata ganti orang kedua tunggal untuk laki-laki (mudzakkar)."
        },
        {
          dhamir: "أَنْتِ",
          arti: "Kamu (pr)",
          keterangan: "Adalah kata ganti orang kedua tunggal untuk perempuan (mu’annats)."
        },
        {
          dhamir: "هُوَ",
          arti: "Dia (lk)",
          keterangan: "Adalah kata ganti orang ketiga tunggal untuk laki-laki (mudzakkar)"
        },
        {
          dhamir: "هِيَ",
          arti: "Dia (pr)",
          keterangan: "Adalah kata ganti orang ketiga tunggal untuk perempuan (mu’annats)."
        }
      ],
      fiilChangeTable: [
        { nomor: "1", makna: "Menulis", ana: "أَكْتُبُ", anta: "تَكْتُبُ", anti: "تَكْتُبِيْنَ", huwa: "يَكْتُبُ", hiya: "تَكْتُبُ" },
        { nomor: "2", makna: "Makan", ana: "آكُلُ", anta: "تَأْكُلُ", anti: "تَأْكُلِيْنَ", huwa: "يَأْكُلُ", hiya: "تَأْكُلُ" },
        { nomor: "3", makna: "Minum", ana: "أَشْرَبُ", anta: "تَشْرَبُ", anti: "تَشْرَبِيْنَ", huwa: "يَشْرَبُ", hiya: "تَشْرَبُ" },
        { nomor: "4", makna: "Mendengar", ana: "أَسْمَعُ", anta: "تَسْمَعُ", anti: "تَسْمَعِيْنَ", huwa: "يَسْمَعُ", hiya: "تَسْمَعُ" },
        { nomor: "5", makna: "Berbicara", ana: "أَتَكَلَّمُ", anta: "تَتَكَلَّمُ", anti: "تَتَكَلَّمِيْنَ", huwa: "يَتَكَلَّمُ", hiya: "تَتَكَلَّمُ" },
        { nomor: "6", makna: "Berdiri", ana: "أَقُوْمُ", anta: "تَقُوْمُ", anti: "تَقُوْمِيْنَ", huwa: "يَقُوْمُ", hiya: "تَقُوْمُ" },
        { nomor: "7", makna: "Duduk", ana: "أَجْلِسُ", anta: "تَجْلِسُ", anti: "تَجْلِسِيْنَ", huwa: "يَجْلِسُ", hiya: "تَجْلِسُ" },
        { nomor: "8", makna: "Pergi", ana: "أَذْهَبُ", anta: "تَذْهَبُ", anti: "تَذْهَبِيْنَ", huwa: "يَذْهَبُ", hiya: "تَذْهَبُ" },
        { nomor: "9", makna: "Pulang", ana: "أَرْجِعُ", anta: "تَرْجِعُ", anti: "تَرْجِعِيْنَ", huwa: "يَرْجِعُ", hiya: "تَرْجِعُ" },
        { nomor: "10", makna: "Membeli", ana: "أَشْتَرِيْ", anta: "تَشْتَرِيْ", anti: "تَشْتَرِيْنَ", huwa: "يَشْتَرِيْ", hiya: "تَشْتَرِيْ" }
      ],
      dhamirTambahan: {
        hukumDhamir: "Isim dhomir hukumnya mabni (tetap, tidak berubah harakat akhirnya).",
        jenisDhamirPoints: [
          "Dhomir munfasil → berdiri sendiri. Contoh rofa‘: هُوَ، هِيَ، أَنْتَ، أَنْتِ، أَنَا. Contoh nasab: إِيَّاهُ، إِيَّاهَا، إِيَّايَ، إِيَّاكَ، إِيَّاكِ",
          "Dhomir muttasil → melekat pada kata lain. Contoh: ـهُ، ـهَا، ـكَ، ـكِ، ـيَ (contoh di atas semuanya untuk bentuk mufrad/tunggal)"
        ],
        polaPenggunaan: [
          {
            dhamir: "أَنَا (ana)",
            items: [
              { category: "Pada isim", examples: "menggunakan ـي → كِتَابِي (kitabi), قَلَمِي (qalami)" },
              { category: "Pada fi‘il mudhāri‘", examples: "menggunakan أَ → أَجْلِسُ (ajlisu), أَذْهَبُ (adzhabu), أَرْجِعُ (arji'u), أَتَكَلَّمُ (atakallamu)" },
              { category: "Pada fi‘il mādhī", examples: "menggunakan ـتُ → ضَرَبْتُ (dharabtu), تَكَلَّمْتُ (takallamtu), رَجَعْتُ (raja'tu)" }
            ]
          },
          {
            dhamir: "أَنْتَ (anta)",
            items: [
              { category: "Pada isim", examples: "menggunakan ـكَ → كِتَابُكَ (kitabuka), قَلَمُكَ (qalamuka)" },
              { category: "Pada fi‘il mudhāri‘", examples: "menggunakan تَ → تَجْلِسُ (tajlisu), تَذْهَبُ (tadhabu), تَرْجِعُ (tarji'u), تَتَكَلَّمُ (tatakallamu)" },
              { category: "Pada fi‘il mādhī", examples: "menggunakan ـتَ → ضَرَبْتَ (dharabta), تَكَلَّمْتَ (takallamta), رَجَعْتَ (raja'ta)" }
            ]
          },
          {
            dhamir: "أَنْتِ (anti)",
            items: [
              { category: "Pada isim", examples: "menggunakan ـكِ → كِتَابُكِ (kitabuki), قَلَمُكِ (qalamuki)" },
              { category: "Pada fi‘il mudhāri‘", examples: "menggunakan تَ...ينَ → تَجْلِسِينَ (tajlisiina), تَذْهَبِينَ (tadhabiina), تَرْجِعِينَ (tarji'iina), تَتَكَلَّمِينَ (tatakallamiina)" },
              { category: "Pada fi‘il mādhī", examples: "menggunakan ـتِ → ضَرَبْتِ (dharabti), تَكَلَّمْتِ (takallamti), رَجَعْتِ (raja'ti)" }
            ]
          },
          {
            dhamir: "هُوَ (huwa)",
            items: [
              { category: "Pada isim", examples: "menggunakan ـهُ → كِتَابُهُ (kitabuhu), قَلَمُهُ (qalamuhu)" },
              { category: "Pada fi‘il mudhāri‘", examples: "menggunakan يَ → يَجْلِسُ (yajlisu), يَذْهَبُ (yadhabu), يَرْجِعُ (yarji'u), يَتَكَلَّمُ (yatakallamu)" },
              { category: "Pada fi‘il mādhī", examples: "bentuk dasar tanpa tambahan → ضَرَبَ (dharaba), تَكَلَّمَ (takallama), رَجَعَ (raja'a)" }
            ]
          },
          {
            dhamir: "هِيَ (hiya)",
            items: [
              { category: "Pada isim", examples: "menggunakan ـهَا → كِتَابُهَا (kitabuha), قَلَمُهَا (qalamuha)" },
              { category: "Pada fi‘il mudhāri‘", examples: "menggunakan تَ → تَجْلِسُ (tajlisu), تَذْهَبُ (tadhabu), تَرْجِعُ (tarji'u), تَتَكَلَّمُ (tatakallamu)" },
              { category: "Pada fi‘il mādhī", examples: "menggunakan ـتْ → ضَرَبَتْ (dharabat), تَكَلَّمَتْ (takallamat), رَجَعَتْ (raja'at)" }
            ]
          }
        ]
      },
      sections: []
    } as MateriContent,
    latihanList: [
      {
        id: 51,
        question: "إِخْتَرِ الْإِجَابَةَ الصَّحِيحَةَ.\nأنَا....",
        options: [
          "أ. جُنْدِيٌّ",
          "ب. كِتَابٌ",
          "ج. طُيُوْرٌ",
          "د. مَدْرَسَةٌ"
        ],
        correctAnswer: 0,
        explanation: "Kata ganti أَنَا (Saya) dapat diikuti oleh profesi tunggal bergender mudzakkar seperti جُنْدِيٌّ (prajurit)."
      },
      {
        id: 52,
        question: "هَذِهِ فَاطِمَةُ... مُعَلِّمَةٌ.",
        options: [
          "أ. هُوَ",
          "ب. هِيَ",
          "ج.أَنْتِ",
          "د. أَنْتَ"
        ],
        correctAnswer: 1,
        explanation: "Fatimah adalah muannats (perempuan) pihak ketiga, sehingga dhamir yang tepat adalah هِيَ (dia)."
      },
      {
        id: 53,
        question: "ذَلِكَ عُثْمَانُ ... أُسْتَاذٌ فِيْ هَذَا الْمَدْرَسَةِ.",
        options: [
          "أ. هُوَ",
          "ب. هِيَ",
          "ج.أَنْتِ",
          "د. أَنْتَ"
        ],
        correctAnswer: 0,
        explanation: "Utsman adalah mudzakkar (laki-laki) pihak ketiga, sehingga dhamir yang tepat adalah هُوَ (dia)."
      },
      {
        id: 54,
        question: "هَذَا أَخِيْ ... الْصَحَافِيُّ.",
        options: [
          "أ. هُوَ",
          "ب. هِيَ",
          "ج.أَنْتِ",
          "د. أَنَا"
        ],
        correctAnswer: 0,
        explanation: "Saudaraku (أَخِيْ) bergender mudzakkar (laki-laki), maka dhamir (kata ganti) yang tepat adalah هُوَ (dia)."
      },
      {
        id: 55,
        question: "الْكَلِمَاتُ تَدُلُّ عَلَى ضَمَائِرِ مُفْرَدَةٍ....",
        options: [
          "أ. هُوَ – أَنْتَ - أَنَا",
          "ب. هِيَ – أَنْتِ – نَحْنُ",
          "ج.أَنْتِ – نَحْنُ -هُمَا",
          "د. أَنْتِ– هُمْ- هُمَا"
        ],
        correctAnswer: 0,
        explanation: "Dhamir mufrad (kata ganti tunggal) meliputi هُوَ (dia lk), أَنْتَ (kamu lk), dan أَنَا (saya)."
      },
      {
        id: 56,
        question: "Bacalah teks dibawah ini, kemudian pilih jawaban yang tepat.\nأَنَا عَلِيٌّ. أَنَا تِلْمِيْذٌ جَدِيْدٌ فِي الْمَدْرَسَةِ الْمُتَوَسِّطَةِ الْإِسْلَامِيَّةِ نُورِ الإسْلاَمِ سِمَارَانْج. أَنَا مِنْ صولو. أَسْكُنُ مَعَ جَدِّيْ فِي سِمَارَانْج. هٰذَا خَالِدٌ، هُوَ صَدِيْقِيْ. هُوَ مِنْ سِمَارَانْج، هُوَ تِلْمِيْذٌ جَدِيْدٌ فِي هَذِهِ الْمَدْرَسَةِ\nعَلِيٌّ ........",
        options: [
          "أ. أُسْتَاذٌ فِي فِي الْمَدْرَسَةِ الْمُتَوَسِّطَةِ الْإِسْلَامِيَّةِ نُورُ الإسْلاَمِ",
          "ب. تِلْمِيْذٌ جَدِيْدٌ فِيْ فِي الْمَدْرَسَةِ الْمُتَوَسِّطَةِ الْإِسْلَامِيَّةِ نُورُ الإسْلاَمِ سِمَارَانْج",
          "ج. تِلْمِيْذٌ جَدِيْدٌ فِيْ الْمَدْرَسَةِ الْإِبْتِدَائِيَّةِ الْحُكُومِيَّةِ",
          "د. تِلْمِيْذٌ جَدِيْدٌ فِيْ الْمَدْرَسَةِ الْثَّانَوِيَّةِ الْحُكُومِيَّةِ"
        ],
        correctAnswer: 1,
        explanation: "Berdasarkan teks: Ali adalah siswa baru di MTs Nurul Islam Semarang."
      },
      {
        id: 57,
        question: "مِنْ أَيْنَ عَلِيٌّ؟....",
        options: [
          "أ. سِمَارَانْج",
          "ب. صُولُو",
          "ج. جَاكَرْتَا",
          "د. سُورابايا"
        ],
        correctAnswer: 1,
        explanation: "Berdasarkan teks: 'أَنَا مِنْ صولو' (Saya dari Solo)."
      },
      {
        id: 58,
        question: "عَلِيٌّ يَسْكُنُ مَعَ ....",
        options: [
          "أ. صَدِيْقِهِ",
          "ب. أَبِيْهِ",
          "ج. جَدِّهِ",
          "د. عَمِّهِ"
        ],
        correctAnswer: 2,
        explanation: "Berdasarkan teks: 'أَسْكُنُ مَعَ جَدِّيْ' (Saya tinggal bersama kakek saya)."
      },
      {
        id: 59,
        question: "هٰذَا خَالِدٌ، هُوَ ........",
        options: [
          "أ. أُسْتَاذِيْ",
          "ب. صَدِيْقِيْ",
          "ج. أَخِيْ",
          "د. أَبِيْ"
        ],
        correctAnswer: 1,
        explanation: "Berdasarkan teks: 'هٰذَا خَالِدٌ، هُوَ صَدِيْقِيْ' (Ini Khalid, dia temanku)."
      },
      {
        id: 60,
        question: "مُرَادِفُ مِنْ كَلِمَةِ تِلْمِيْذٌ\".....",
        options: [
          "أ. طَالِبٌ",
          "ب. طَالِبَةٌ",
          "ج. أُسْتَاذٌ",
          "د. أُسْتَاذَةٌ"
        ],
        correctAnswer: 0,
        explanation: "Sinonim (muradif) dari kata تِلْمِيْذٌ (murid laki-laki) adalah طَالِبٌ (siswa laki-laki)."
      }
    ] as LatihanItem[]
  }
];

export const DAFTAR_MATERI_BAB2: MateriItem[] = [
  {
    id: 101,
    topik: "Tata Bahasa Satu: Isim Isyaroh (اِسْمُ الإِشَارَةِ)",
    subTopik: "Kata Tunjuk Dekat dan Jauh dalam Bahasa Arab Berdasarkan Gender",
    contohList: [
      {
        id: 111,
        arabic: "<u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>هَذَا</span></u> أَبِيْ هُوَ مُهَنْدِسٌ",
        latin: "<u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Haadzaa</span></u> abii huwa muhandisun",
        translation: "Ini adalah ayah ku dia adalah seorang arsitek",
        explanation: "هَذَا (ini) adalah isim isyarah untuk mudzakkar"
      },
      {
        id: 112,
        arabic: "<u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>تِلْكَ</span></u> أُمِّيْ هِيَ مُعَلِّمَةٌ فِي الْمَدْرَسَةِ",
        latin: "<u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Tilka</span></u> ummii hiya mu'allimatun fil madrasati",
        translation: "Itu adalah ibu ku dia adalah seorang guru di sekolah",
        explanation: "تِلْكَ (itu) adalah isim isyarah untuk mu'annats"
      },
      {
        id: 113,
        arabic: "<u style='text-underline-offset: 6px; text-decoration-color: #ef4444;'><span style='color: #ef4444;'>ذَلِكَ</span></u> مَلْعَبٌ كَبِيْرٌ",
        latin: "<u style='text-underline-offset: 3px; text-decoration-color: #ef4444;'><span style='color: #ef4444; font-weight: bold;'>Dzaalika</span></u> mal'abun kabiirun",
        translation: "Itu adalah lapangan yang besar",
        explanation: "ذَلِكَ (itu) adalah isim isyarah untuk mudzakkar"
      }
    ] as ContohItem[],
    materiContent: {
      title: "Tata Bahasa 1: Isim Isyarah (اِسْمُ الإِشَارَةِ)",
      introduction: "Isim isyarah adalah kata tunjuk yang digunakan untuk menunjuk sesuatu, baik yang berjarak dekat maupun jauh. Dalam bahasa Arab, kata tunjuk disesuaikan dengan jenis peruntukannya, baik jenis (mudzakkar atau muannats),  maupun jumlahnya (tunggal, dua, atau jamak), serta berakal atau tidak berakal.",
      isyarahTable: [
        {
          kataTunjuk: "هَذَا",
          arti: "Ini (Laki-laki)",
          penggunaan: "Dekat (Qorib) & Mudzakkar",
          contoh: "هَذَا قَلَمٌ جَمِيْلٌ",
          penjelasan: "Digunakan untuk menunjuk benda dekat berjenis mudzakkar (tanpa ta' marbuthah)."
        },
        {
          kataTunjuk: "هَذِهِ",
          arti: "Ini (Perempuan)",
          penggunaan: "Dekat (Qorib) & Muannats",
          contoh: "هَذِهِ مِسْطَرَةٌ طَوِيْلَةٌ",
          penjelasan: "Digunakan untuk menunjuk benda dekat berjenis muannats (dengan akhiran ta' marbuthah ة)."
        },
        {
          kataTunjuk: "ذَلِكَ",
          arti: "Itu (Laki-laki)",
          penggunaan: "Jauh (Ba'id) & Mudzakkar",
          contoh: "ذَلِكَ كِتَابٌ مُفِيْدٌ",
          penjelasan: "Digunakan untuk menunjuk benda jauh berjenis mudzakkar."
        },
        {
          kataTunjuk: "تِلْكَ",
          arti: "Itu (Perempuan)",
          penggunaan: "Jauh (Ba'id) & Muannats",
          contoh: "تِلْكَ سَبُّوْرَةٌ نَظِيْفَةٌ",
          penjelasan: "Digunakan untuk menunjuk benda jauh berjenis muannats."
        }
      ],
      sections: []
    } as MateriContent,
    latihanList: [
      {
        id: 1011,
        question: "تِلْكَ أُخْتِي ... طَالِبَةٌ مُجْتَهِدَةٌ.\nالَّلفْظُ الْمُنَاسِبُ لِلْجُمْلَةِ يَعْنِيْ.......",
        options: [
          "أ. هُوَ",
          "ب. هِيَ",
          "ج. أَنْتِ",
          "د. أَنْتَ"
        ],
        correctAnswer: 1,
        explanation: "Untuk melengkapi kata ganti (dhamir) bagi 'تِلْكَ أُخْتِي' (perempuan/muannats), digunakan kata ganti orang ketiga tunggal perempuan 'هِيَ'."
      },
      {
        id: 1012,
        question: "أُنْظُرْ إِلَى الْصُّوْرَةِ!\nهَذِهِ الْصُّوْرَةُ......",
        image: ruangKelasImg,
        options: [
          "أ. مَسْجِدٌ",
          "ب. فَصْلٌ",
          "ج. مُدَرِّسٌ",
          "د. حَمَّامٌ"
        ],
        correctAnswer: 1,
        explanation: "Gambar menunjukkan Ruang Kelas (فَصْلٌ)."
      },
      {
        id: 1013,
        question: "أُنْظُرْ إِلَى الْصُّوْرَةِ!\nهَذِهِ الْصُّوْرَةُ......",
        image: perpustakaanImg,
        options: [
          "أ. مَسْجِدٌ",
          "ب. فَصْلٌ",
          "ج. مَيْدَانٌ",
          "د. مَكْتَبَةٌ"
        ],
        correctAnswer: 3,
        explanation: "Gambar menunjukkan Perpustakaan (مَكْتَبَةٌ)."
      },
      {
        id: 1014,
        question: "أُنْظُرْ إِلَى الْصُّوْرَةِ!\nهَذِهِ الْصُّوْرَةُ......",
        image: bukuBahasaArabImg,
        options: [
          "أ. الُّلغَةُ الْعَرَبِيَّةُ",
          "ب. الْعُلُوْمُ الْطَّبِيْعِيَّةِ",
          "ج. الْتَارِيْخُ الْإِسْلاَمِيُّ",
          "د. الْعُلُوْمُ الْإِجْتِمَاعِيَّةِ"
        ],
        correctAnswer: 0,
        explanation: "Gambar menunjukkan pelajaran/buku Bahasa Arab (الُّلغَةُ الْعَرَبِيَّةُ)."
      },
      {
        id: 1015,
        question: "أُنْظُرْ إِلَى الْصُّوْرَةِ!\nهَذَا أَبِيْ هُوَ...",
        image: ayahPedagangPasarImg,
        options: [
          "أ. مُدَرِّسٌ",
          "ب. مُهَنْدِسٌ",
          "ج. تَاجِرٌ",
          "د. سُرْطِيٌّ"
        ],
        correctAnswer: 2,
        explanation: "Gambar menunjukkan seorang Pedagang (تَاجِرٌ)."
      },
      {
        id: 1016,
        question: "الْمَعْنَى مِنْ \"ذَلِكَ مُدَرِّسٌ ذَكِيٌّ\" هُوَ...",
        options: [
          "A. Ini guru yang tampan",
          "B. Itu guru yang pandai",
          "C. Itu siswa yang cantik",
          "D. Ini guru yang adil"
        ],
        correctAnswer: 1,
        explanation: "\"ذَلِكَ\" berarti 'Itu', \"مُدَرِّسٌ\" berarti 'guru', \"ذَكِيٌّ\" berarti 'yang pandai/cerdas'."
      },
      {
        id: 1017,
        question: "أُنْظُرْ إِلَى الْصُّوْرَةِ!\nهَذِهِ الْصُّوْرَةُ......",
        image: tamanBustanImg,
        options: [
          "أ. مَسْجِدٌ",
          "ب. فَصْلٌ",
          "ج. بُسْتَانٌ",
          "د. مَكْتَبَةٌ"
        ],
        correctAnswer: 2,
        explanation: "Gambar menunjukkan Taman/Kebun (بُسْتَانٌ)."
      },
      {
        id: 1018,
        question: "أُنْظُرْ إِلَى الْصُّوْرَةِ!\nالْجُمْلَةُ الْمُنَاسِبَةُ لِهَذِهِ الصُّورَةِ هِيَ...",
        image: siswaMembacaPerpustakaanImg,
        options: [
          "أ. هَذَ تِلْمِيْذٌ ذَكِيٌّ فِيْ الْمَدْرَسَةِ",
          "ب. هَذَا مُدَرِّسٌ يَقُوْمُ أَمَامَ الْفَصْلِ",
          "ج. يَقْرَاُ الْطُلاَّبُ الْكُتُبَ فِيْ الْمَكْتَبَةِ",
          "د. تِلْكَ تِلْمِيْذَةٌ تَجْلِسُ أَمَامَ الْفَصْلِ"
        ],
        correctAnswer: 2,
        explanation: "Gambar menunjukkan para siswa membaca buku di perpustakaan (يَقْرَاُ الْطُلاَّبُ الْكُتُبَ فِيْ الْمَكْتَبَةِ)."
      },
      {
        id: 1019,
        question: "هَذَا أَخِيْ (...) خَالِدٌ، هُوَ مُهَنْدِسٌ.\nاللَّفْظُ الْمُنَاسِبُ لِلْجُمْلَةِ هُوَ...",
        options: [
          "أ. إِسْمُهَا",
          "ب. إِسْمُهُ",
          "ج. إِسْمُكَ",
          "د. إِسْمُكِ"
        ],
        correctAnswer: 1,
        explanation: "Karena 'أَخِي' (saudaraku) berjenis Mudzakkar (laki-laki), maka kata ganti kepemilikannya adalah 'إِسْمُهُ' (namanya)."
      },
      {
        id: 1020,
        question: "ذَلِكَ مُدَرِّسٌ مُجْتَهِدٌ فِيْ الْمَدْرَسَةِ.\nالْخَبَرُ فِيْ الْجُمْلَةِ الْسَّابِقَةِ يَعْنِيْ...",
        options: [
          "أ. ذَلِكَ",
          "ب. مُدَرِّسٌ",
          "ج. مُجْتَهِدٌ",
          "د. فِيْ الْمَدْرَسَةِ"
        ],
        correctAnswer: 2,
        explanation: "Pilihan yang tepat untuk melengkapi jawaban sesuai kunci jawaban adalah 'ج. مُجْتَهِدٌ'."
      }
    ] as LatihanItem[]
  }
];

export const BAHAS_MATERI = DAFTAR_MATERI[0];

export const EVALUASI_QUESTIONS: EvaluasiQuestion[] = [
  {
    id: 1,
    question: "Kata tanya manakah yang tepat digunakan untuk menanyakan asal daerah seseorang ('Dari mana kamu?') dalam bahasa Arab?",
    options: [
      "مَنْ أَنْتَ (Man anta)",
      "مِنْ أَيْنَ أَنْتَ (Min ayna anta)",
      "مَا هَذَا (Maa haadza)",
      "كَيْفَ حَالُكَ (Kayfa haluka)"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Apabila seseorang menyapa Anda dengan 'صَبَاحُ الْخَيْرِ' (Shabaahul khair), maka respon jawaban yang tepat adalah...",
    options: [
      "مَسَاءُ النُّوْرِ (Masaa-un nuur)",
      "أَهْلًا بِكَ (Ahlan bika)",
      "صَبَاحُ النُّوْرِ (Shabaahun nuur)",
      "بِخَيْرٍ وَالْحَمْدُ للهِ"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "Manakah susunan kalimat Jumlah Ismiyah (Mubtada' & Khabar) yang selaras secara gender di bawah ini?",
    options: [
      "الْمَدْرَسَةُ جَمِيْلٌ (Al-Madrasatu jamiilun)",
      "التِّلْمِيْذُ نَشِيْطَةٌ (At-Tilmiidhu nashiithatun)",
      "التِّلْمِيْذُ نَشِيْطٌ (At-Tilmiidhu nashiithun)",
      "فَاطِمَةُ طَبِيْبٌ (Faathimatu thabiibun)"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "Kata ganti tunggal (Dhamir Mufrad) yang paling tepat untuk menggantikan subjek perempuan tunggal seperti 'Aisyah' (Dia perempuan) adalah...",
    options: [
      "هُوَ (Huwa)",
      "هِيَ (Hiya)",
      "أَنْتَ (Anta)",
      "أَنَا (Ana)"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "Lengkapi kalimat rumpang berikut agar menjadi susunan Mubtada' & Khabar yang benar: 'السَّبُّوْرَةُ ...'",
    options: [
      "نَظِيْفٌ (Nadhiifun)",
      "نَظِيْفَةٌ (Nadhiifatun)",
      "نَظِيْفًا (Nadhiifan)",
      "نَظِيْفٍ (Nadhiifin)"
    ],
    correctAnswer: 1
  }
];

export const MOCK_STUDENT_SCORES: StudentScore[] = [
  { id: "mock_1", name: "Muhammad Rizky", gender: "Laki-laki", role: "Siswa", class: "Kelas 8A", score: 100, date: "2026-07-06", status: "Lulus" },
  { id: "mock_2", name: "Fatimah Azzahra", gender: "Perempuan", role: "Siswa", class: "Kelas 7B", score: 90, date: "2026-07-07", status: "Lulus" },
  { id: "mock_3", name: "Achmad Maulana", gender: "Laki-laki", role: "Siswa", class: "Kelas 9A", score: 80, date: "2026-07-05", status: "Lulus" },
  { id: "mock_4", name: "Zahra Aulia", gender: "Perempuan", role: "Siswa", class: "Kelas 8B", score: 60, date: "2026-07-07", status: "Remedial" },
  { id: "mock_5", name: "Yusuf Habibie", gender: "Laki-laki", role: "Siswa", class: "Kelas 7A", score: 95, date: "2026-07-07", status: "Lulus" }
];

export const REFERENSI_LIST: ReferensiItem[] = [
  {
    id: 1,
    title: "Qoidati Rumus & Qoidah (Amtsilati)",
    author: "Taufiqul Hakim",
    year: "2004",
    publisher: "Al-Falah Offset, Jepara",
    type: "Buku"
  },
  {
    id: 2,
    title: "Bahasa Arab untuk Kelas VII",
    author: "Hasan Saefuloh",
    year: "2026",
    publisher: "PT Gelora Aksara Pratama (Penerbit Erlangga), Jakarta",
    type: "Buku"
  },
  {
    id: 3,
    title: "Bahasa Arab untuk Kelas VII MTs",
    author: "Muhammad Yusuf Ibrahim",
    year: "2025",
    publisher: "PT Global Offset Sejahtera, Sidoarjo",
    type: "Buku"
  },
  {
    id: 4,
    title: "Bahasa Arab untuk Kelas VII Madrasah Tsanawiyah (KMA 450)",
    author: "Alistianatin Naimah",
    year: "2025",
    publisher: "PT Global Tiga Serangkai Pustaka Mandiri, Solo",
    type: "Buku"
  },
  {
    id: 5,
    title: "Bahasa Arab untuk Kelas VII Madrasah Tsanawiyah (KMA 1503)",
    author: "Alistianatin Naimah",
    year: "2026",
    publisher: "PT Global Tiga Serangkai Pustaka Mandiri, Solo",
    type: "Buku"
  }
];

export const ARABIC_QUOTES: ArabicQuote[] = [
  {
    arabic: "مَنْ جَدَّ وَجَدَ",
    pronunciation: "Man jadda wa jada",
    translation: "Barangsiapa bersungguh-sungguh, maka ia akan berhasil.",
    advice: "Kesungguhan adalah kunci utama dalam menuntut ilmu. Tidak ada hasil yang mengkhianati usaha keras."
  },
  {
    arabic: "مَنْ صَبَرَ ظَفِرَ",
    pronunciation: "Man shabara zhafira",
    translation: "Barangsiapa bersabar, maka ia akan beruntung (menang).",
    advice: "Sabar dalam proses belajar adalah kekuatan. Setiap kesulitan yang kamu hadapi hari ini adalah investasi kesuksesanmu esok hari."
  },
  {
    arabic: "مَنْ سَارَ عَلَى الدَّرْبِ وَصَلَ",
    pronunciation: "Man saara 'alaad-darbi washala",
    translation: "Barangsiapa berjalan pada jalannya, sampailah ia (kepada tujuan nya).",
    advice: "Konsistensi dan mengikuti jalur pembelajaran yang benar (terstruktur) akan mengantarkanmu ke tujuan kesuksesan."
  },
  {
    arabic: "مَنْ يَزْرَعْ يَحْصُدْ",
    pronunciation: "Man yazra' yahshud",
    translation: "Barangsiapa yang menanam, pasti akan memetik.",
    advice: "Setiap usaha baik, sekecil apa pun, akan membuahkan hasil yang setimpal di masa depan. Menanam kebaikan memetik kesuksesan."
  },
  {
    arabic: "مَنْ قَلَّ صِدْقُهُ قَلَّ صَدِيْقُهُ",
    pronunciation: "Man qalla shidquhu qalla shadiiquhu",
    translation: "Barangsiapa sedikit kejujurannya, maka sedikit pula temannya.",
    advice: "Kejujuran akademis dan integritas diri adalah pondasi utama dalam menjalin relasi sosial dan menuntut ilmu."
  },
  {
    arabic: "وَمَا اللَّذَّةُ إِلَّا بَعْدَ التَّعَبِ",
    pronunciation: "Wamaal-ladzzatu illa ba'dat-ta'abi",
    translation: "Dan tidak ada kenikmatan kecuali setelah kepayahan (lelah).",
    advice: "Rasa lelah saat belajar akan hilang, tetapi manisnya ilmu dan kesuksesan akan terus membekas selamanya."
  }
];

