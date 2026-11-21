import * as XLSX from 'xlsx';
import { StudentScore } from '../types';

export function getNarrativeScore(item: StudentScore): string {
  const genderVal = item.gender || 'Laki-laki';
  const panggilan = genderVal === 'Perempuan' ? 'Siswi' : 'Siswa';
  const scoreNum = Number(item.score) || 0;
  
  let predikat = '';
  if (scoreNum >= 90) {
    predikat = 'Mumtaz (Sangat Baik / Sangat Menguasai)';
  } else if (scoreNum >= 75) {
    predikat = 'Jayyid (Baik / Tuntas)';
  } else if (scoreNum >= 60) {
    predikat = 'Maqbul (Cukup Memahami)';
  } else {
    predikat = 'Rasib (Memerlukan Bimbingan Lebih Lanjut)';
  }

  return `${panggilan} atas nama ${item.name} dari ${item.class || 'Kelas 7'} memperoleh nilai evaluasi sebesar ${scoreNum} dengan capaian predikat ${predikat} dalam pembelajaran Tata Bahasa Arab.`;
}

export function exportScoresToExcel(scores: StudentScore[]): boolean {
  const safeScores = scores || [];

  try {
    // 1. Prepare formatted data rows for SheetJS XLSX
    let dataForSheet: any[] = [];

    if (safeScores.length === 0) {
      dataForSheet = [
        {
          'No': 1,
          'Nama Siswa': '(Data Kosong)',
          'Kelas': '-',
          'Jenis Kelamin': '-',
          'Nilai Evaluasi': 0,
          'Status Target': 'Belum Ada Data',
          'Tanggal Input': new Date().toLocaleDateString('id-ID'),
          'Deskripsi Naratif & Predikat': 'Belum ada data nilai siswa yang tersimpan.'
        }
      ];
    } else {
      dataForSheet = safeScores.map((item, idx) => {
        const scoreNum = Number(item.score) || 0;
        const statusVal = item.status || (scoreNum >= 75 ? 'Lulus' : 'Remedial');
        const narrativeText = item.narrativeScore || getNarrativeScore(item);

        return {
          'No': idx + 1,
          'Nama Siswa': item.name || '-',
          'Kelas': item.class || 'Kelas 7A',
          'Jenis Kelamin': item.gender || 'Laki-laki',
          'Nilai Evaluasi': scoreNum,
          'Status Target': statusVal,
          'Tanggal Input': item.date || new Date().toLocaleDateString('id-ID'),
          'Deskripsi Naratif & Predikat': narrativeText
        };
      });
    }

    // 2. Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataForSheet);

    // Set auto column widths for beautiful layout
    const columnWidths = [
      { wch: 6 },   // No
      { wch: 25 },  // Nama
      { wch: 12 },  // Kelas
      { wch: 15 },  // Gender
      { wch: 15 },  // Nilai
      { wch: 15 },  // Status
      { wch: 15 },  // Tanggal
      { wch: 80 }   // Deskripsi
    ];
    worksheet['!cols'] = columnWidths;

    // 3. Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Nilai Evaluasi');

    // 4. Generate filename with date timestamp
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `Rekap_Nilai_Evaluasi_Tata_Bahasa_Arab_${dateStr}.xlsx`;

    // 5. Write file directly using SheetJS binary export
    XLSX.writeFile(workbook, fileName);
    return true;
  } catch (error) {
    console.error("Gagal mengekspor file Excel:", error);
    
    // Fallback: CSV export with UTF-8 BOM
    try {
      const headers = ["No", "Nama Siswa", "Kelas", "Jenis Kelamin", "Nilai", "Status", "Tanggal", "Deskripsi Naratif"];
      const csvRows = [headers.join(",")];

      scores.forEach((item, idx) => {
        const scoreNum = Number(item.score) || 0;
        const statusVal = item.status || (scoreNum >= 75 ? 'Lulus' : 'Remedial');
        const narrativeText = (item.narrativeScore || getNarrativeScore(item)).replace(/"/g, '""');
        
        const row = [
          idx + 1,
          `"${item.name || ''}"`,
          `"${item.class || 'Kelas 7A'}"`,
          `"${item.gender || 'Laki-laki'}"`,
          scoreNum,
          `"${statusVal}"`,
          `"${item.date || ''}"`,
          `"${narrativeText}"`
        ];
        csvRows.push(row.join(","));
      });

      const csvString = '\uFEFF' + csvRows.join("\n");
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Rekap_Nilai_Evaluasi_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return true;
    } catch (csvError) {
      alert("Terjadi kesalahan saat mengunduh berkas Excel. Silakan coba lagi.");
      return false;
    }
  }
}
