export interface FloatingLetter {
  id: number;
  char: string;
  fontSize: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
}

export type PeranUser = 'siswa' | 'guru' | 'admin';
export type GenderUser = 'laki-laki' | 'perempuan';

export interface UserSession {
  peran: PeranUser;
  gender: GenderUser;
  kelas: string;
  name: string;
}

export interface KbcSection {
  title: string;
  content: string;
  points: string[];
}

export interface CpFaseDSection {
  elemen: string;
  capaian: string;
  kompetensi: string[];
}

export interface ContohItem {
  id: number;
  arabic: string;
  latin: string;
  translation: string;
  explanation: string;
}

export interface TableRow {
  no: string;
  kataTanya: string;
  arti: string;
  peruntukan: string;
  contohPertanyaan: string;
  contohJawaban: string;
}

export interface MubtadaTableRow {
  dhamir: string;
  contoh: string;
  makna: string;
}

export interface SifatTableRow {
  contoh: string;
  mubtada: string;
  khabar: string;
}

export interface MacamMaarifatingItem {
  id: number;
  title: string;
  contoh: string;
}

export interface MateriTambahan {
  title: string;
  points: string[];
  macamMaarifatingTitle: string;
  macamMaarifatingList: MacamMaarifatingItem[];
  closingPoint: string;
}

export interface TahiyyahTableRow {
  tahiyyah: string;
  jawab: string;
  bayan: string;
}

export interface DhamirTableRow {
  dhamir: string;
  arti: string;
  keterangan: string;
}

export interface FiilChangeRow {
  nomor: string;
  makna: string;
  hiya: string;
  huwa: string;
  anti: string;
  anta: string;
  ana: string;
}

export interface DhamirTambahan {
  hukumDhamir: string;
  jenisDhamirPoints: string[];
  polaPenggunaan: {
    dhamir: string;
    items: {
      category: string;
      examples: string;
    }[];
  }[];
}

export interface IsyarahTableRow {
  kataTunjuk: string;
  arti: string;
  penggunaan: string;
  contoh: string;
  penjelasan: string;
}

export interface MateriContent {
  title: string;
  introduction: string;
  sections: {
    subtitle: string;
    arabicText?: string;
    explanation: string;
    points?: string[];
  }[];
  table?: TableRow[];
  tahiyyahTable?: TahiyyahTableRow[];
  tahiyyahTambahanIntro?: string;
  tahiyyahTambahanTable?: TahiyyahTableRow[];
  dhamirTable?: DhamirTableRow[];
  fiilChangeTable?: FiilChangeRow[];
  dhamirTambahan?: DhamirTambahan;
  mubtadaTable?: MubtadaTableRow[];
  keteranganMubtada?: string[];
  sifatTableTitle?: string;
  sifatTable?: SifatTableRow[];
  isyarahTable?: IsyarahTableRow[];
  materiTambahan?: MateriTambahan;
}

export interface LatihanItem {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  image?: string;
}

export interface EvaluasiQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface StudentScore {
  id?: string;
  name: string;
  gender?: 'Laki-laki' | 'Perempuan';
  role: string;
  class: string;
  score: number;
  date: string;
  status: 'Lulus' | 'Remedial';
  narrativeScore?: string;
}

export interface ReferensiItem {
  id: number;
  title: string;
  author: string;
  year: string;
  publisher: string;
  type: 'Buku' | 'Jurnal' | 'Kurikulum';
}

export interface ArabicQuote {
  arabic: string;
  pronunciation: string;
  translation: string;
  advice: string;
}

