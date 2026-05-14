'use client';
import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { ArrowUpTrayIcon, ArrowPathIcon, IdentificationIcon } from '@heroicons/react/24/outline';

export default function TambahJisshusei() {
  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState<'Unknown' | 'Passport' | 'Zairyu Card'>('Unknown');
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nomor_dokumen: '',
    expired_date: ''
  });

  const processOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Tesseract.recognize(file, 'eng', { logger: m => console.log(m) })
      .then(({ data: { text } }) => {
        console.log("Full Text:", text);
        const upperText = text.toUpperCase();

        // 1. DETEKSI JENIS DOKUMEN & NOMOR
        let detectedType: 'Passport' | 'Zairyu Card' | 'Unknown' = 'Unknown';
        let docNum = '';
        let detectedName = '';

        // Pola Paspor: 1 Huruf + 7-8 Angka
        const passportMatch = upperText.match(/[A-Z][0-9]{7,8}/);
        // Pola Zairyu Card: 2 Huruf + 8 Angka + 2 Huruf (Biasanya)
        const zairyuMatch = upperText.match(/[A-Z]{2}[0-9]{8}[A-Z]{2}/);

        if (passportMatch) {
          detectedType = 'Passport';
          docNum = passportMatch[0];
          
          // Logika Nama Paspor (Biasanya setelah kata 'Name' atau di baris bawah)
          // Baris yang mengandung baris kode MRZ (bawah paspor) seringkali punya format: P<IDNNAME<<...
          const mrzName = upperText.match(/P<[A-Z]{3}([A-Z<]+)/);
          if (mrzName) {
            detectedName = mrzName[1].replace(/<+/g, ' ').trim();
          }
        } else if (zairyuMatch || upperText.includes('RESIDENCE CARD')) {
          detectedType = 'Zairyu Card';
          docNum = zairyuMatch ? zairyuMatch[0] : '';
          
          // Logika Nama di Zairyu Card (Biasanya di baris atas setelah kata 'NAME')
          const nameMatch = upperText.match(/NAME\s+([A-Z\s]+)\n/);
          if (nameMatch) detectedName = nameMatch[1].trim();
        }

        setDocType(detectedType);
        setFormData({
          nama_lengkap: detectedName || formData.nama_lengkap,
          nomor_dokumen: docNum || formData.nomor_dokumen,
          expired_date: '' // Expired date lebih sulit, biasanya perlu filter tanggal
        });

        alert(`Terdeteksi: ${detectedType}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold mb-6">Tambah Data Personel</h2>
      
      <div className="mb-8 p-6 border-2 border-dashed border-blue-100 rounded-lg bg-blue-50 text-center">
        <label className="cursor-pointer">
          <div className="flex flex-col items-center">
            {loading ? (
              <ArrowPathIcon className="w-10 h-10 text-blue-600 animate-spin" />
            ) : (
              <IdentificationIcon className="w-10 h-10 text-blue-600 mb-2" />
            )}
            <span className="font-medium text-blue-700">
              {loading ? 'Memproses Dokumen...' : 'Upload Paspor / Zairyu Card'}
            </span>
          </div>
          <input type="file" className="hidden" onChange={processOCR} accept="image/*" />
        </label>
      </div>

      <div className="space-y-4">
        {docType !== 'Unknown' && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm font-medium border border-green-200">
            Sistem mendeteksi dokumen ini sebagai: <strong>{docType}</strong>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-700">Nama (Hasil Scan)</label>
          <input 
            type="text" 
            className="w-full p-2 border border-slate-200 rounded-md focus:ring-blue-500 bg-white" 
            value={formData.nama_lengkap}
            onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
            placeholder="Nama otomatis terisi jika terbaca..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Nomor {docType !== 'Unknown' ? docType : 'Dokumen'}</label>
          <input 
            type="text" 
            className="w-full p-2 border border-slate-200 rounded-md bg-white" 
            value={formData.nomor_dokumen}
            onChange={(e) => setFormData({...formData, nomor_dokumen: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
}