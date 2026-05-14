'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function PendaftaranKandidat() {
  const [umur, setUmur] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Inisialisasi SEMUA state sebagai string kosong agar form bersih di awal
  const [formData, setFormData] = useState<any>({
    furigana: '', nama_lengkap: '', tanggal_lahir: '', 
    jenis_kelamin: '', kewarganegaraan: '', status_pernikahan: '',
    zairyu_shikaku_sekarang: '', zairyu_kigen: '', domisili: '',
    merokok: '', pengalaman_night_shift: '', tato: '',
    tinggi_badan: '', berat_badan: '', kemampuan_percakapan: '',
    jlpt_level: '', jlpt_tanggal: '', jft_basic: '', jft_tanggal: '',
    bikou: '', 
    pengalaman: [{ bidang: '', periode: '' }],
    sertifikat: [{ nama_ssw: '', tanggal: '', status: '取得' }]
  });

  // Logika Hitung Umur
  useEffect(() => {
    if (formData.tanggal_lahir) {
      const birth = new Date(formData.tanggal_lahir);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
      setUmur(age);
    }
  }, [formData.tanggal_lahir]);

  const addPengalaman = () => setFormData({...formData, pengalaman: [...formData.pengalaman, { bidang: '', periode: '' }]});
  const addSertifikat = () => setFormData({...formData, sertifikat: [...formData.sertifikat, { nama_ssw: '', tanggal: '', status: '取得' }]});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    
// 2. Pembersihan Data sebelum Insert
    const cleanData = { ...formData };

// Konversi Angka (agar tidak error int4 di image_938cfa.png)
    cleanData.tinggi_badan = cleanData.tinggi_badan ? parseInt(cleanData.tinggi_badan) : null;
    cleanData.berat_badan = cleanData.berat_badan ? parseInt(cleanData.berat_badan) : null;

    // Handle kolom Tanggal agar tidak error (image_9fd5c7.png)
    const dateFields = ['zairyu_kigen', 'jlpt_tanggal', 'jft_tanggal', 'tanggal_lahir'];
    dateFields.forEach(field => {
      if (cleanData[field] === "") cleanData[field] = null;
    });

    // 3. Eksekusi ke Supabase
    const { error } = await supabase.from('kandidat_pendaftaran').insert([cleanData]);
    
    setIsSubmitting(false);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Pendaftaran berhasil!');
      window.location.reload(); 
    }
  };

  // // Di tombol Daftar:
  // <button 
  //   disabled={isSubmitting}
  //   className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isSubmitting ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}
  // >
  //   {isSubmitting ? 'Mengirim...' : '送信'}
  // </button>

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">候補者キャリアシート</h1>
          <p className="text-blue-100 text-sm">Form Pendaftaran Kandidat Tokutei Ginou</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-l-4 border-blue-600 pl-3 text-slate-700">基本情報 (Informasi Dasar)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <input type="text" placeholder="フリガナ (Furigana)" className="w-full border-b p-2 outline-none focus:border-blue-500" value={formData.furigana} onChange={e => setFormData({...formData, furigana: e.target.value})} />
                <input type="text" placeholder="名前 (Nama Lengkap)" required className="w-full border-b p-2 text-lg font-bold outline-none focus:border-blue-500" value={formData.nama_lengkap} onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} />
              </div>
              <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-500">生年月日 (Tanggal Lahir)</label>
                  <input type="date" required className="bg-transparent outline-none" value={formData.tanggal_lahir} onChange={e => setFormData({...formData, tanggal_lahir: e.target.value})} />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">年齢 (Usia)</span>
                  <p className="text-xl font-bold text-blue-600">{umur ?? '-'} 歳</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Dropdown dengan Option Kosong di Awal */}
              <div>
                <label className="text-xs font-bold text-slate-500">性別 (Jenis Kelamin)</label>
                <select required className="w-full border p-2 rounded" value={formData.jenis_kelamin} onChange={e => setFormData({...formData, jenis_kelamin: e.target.value})}>
                  <option value="" disabled>Pilih</option>
                  <option value="男性">男性 (Pria)</option>
                  <option value="女性">女性 (Wanita)</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500">国籍 (Kewarganegaraan)</label>
                <select required className="w-full border p-2 rounded" value={formData.kewarganegaraan} onChange={e => setFormData({...formData, kewarganegaraan: e.target.value})}>
                  <option value="" disabled>Pilih</option>
                  <option value="インドネシア">インドネシア (Indonesia)</option>
                  <option value="ベトナム">ベトナム (Vietnam)</option>
                  <option value="タイ">タイ (Thailand)</option>
                  <option value="フィリピン">フィリピン (Filipin)</option>
                  <option value="中国">中国 (Cina)</option>
                  <option value="ミャンマー">ミャンマー (Myanmar)</option>
                  <option value="ウズベキスタン">ウズベキスタン (Uzbekistan)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">婚姻 (Status Pernikahan)</label>
                <select required className="w-full border p-2 rounded" value={formData.status_pernikahan} onChange={e => setFormData({...formData, status_pernikahan: e.target.value})}>
                  <option value="" disabled>Pilih</option>
                  <option value="未婚">未婚 (Tidak Menikah)</option>
                  <option value="既婚（子無）">既婚子無 (Sudah Menikah Tidak Ada Anak)</option>
                  <option value="既婚（子有）">既婚子有 (Sudah Menikah Sudah Ada Anak)</option>
                  <option value="離婚（子無）">離婚子無 (Bercerai Tidak Ada Anak)</option>
                  <option value="離婚（子有）">離婚子有 (Bercerai Sudah Ada Anak)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">現住所 (Domisili)</label>
                <select required className="w-full border p-2 rounded bg-white" value={formData.domisili} onChange={e => setFormData({...formData, domisili: e.target.value})}>
                  <option value="" disabled>Pilih</option>
                  <optgroup label="国外 (Luar Negeri)">
                    <option value="ベトナム">ベトナム (Vietnam)</option>
                    <option value="タイ">タイ (Thailand)</option>
                    <option value="インドネシア">インドネシア (Indonesia)</option>
                    <option value="フィリピン">フィリピン (Filipina)</option>
                    <option value="中国">中国 (China)</option>
                    <option value="ミャンマー">ミャンマー (Myanmar)</option>
                    <option value="ウズベキスタン">ウズベキスタン (Uzbekistan)</option>
                  </optgroup>
                  
                  <optgroup label="日本国内 (Prefektur di Jepang)">
                    <option value="広島県">広島県 (Hiroshima)</option>
                    <option value="東京都">東京都 (Tokyo)</option>
                    <option value="神奈川県">神奈川県 (Kanagawa)</option>
                    <option value="千葉県">千葉県 (Chiba)</option>
                    <option value="埼玉県">埼玉県 (Saitama)</option>
                    <option value="茨城県">茨城県 (Ibaraki)</option>
                    <option value="栃木県">栃木県 (Tochigi)</option>
                    <option value="群馬県">群馬県 (Gunma)</option>
                    <option value="山口県">山口県 (Yamaguchi)</option>
                    <option value="鳥取県">鳥取県 (Tottori)</option>
                    <option value="島根県">島根県 (Shimane)</option>
                    <option value="岡山県">岡山県 (Okayama)</option>
                    <option value="福岡県">福岡県 (Fukuoka)</option>
                    <option value="佐賀県">佐賀県 (Saga)</option>
                    <option value="長崎県">長崎県 (Nagasaki)</option>
                    <option value="熊本県">熊本県 (Kumamoto)</option>
                    <option value="大分県">大分県 (Oita)</option>
                    <option value="宮崎県">宮崎県 (Miyazaki)</option>
                    <option value="鹿児島県">鹿児島県 (Kagoshima)</option>
                    <option value="徳島県">徳島県 (Tokushima)</option>
                    <option value="香川県">香川県 (Kagawa)</option>
                    <option value="愛媛県">愛媛県 (Ehime)</option>
                    <option value="高知県">高知県 (Kochi)</option>
                    <option value="滋賀県">滋賀県 (Shiga)</option>
                    <option value="京都府">京都府 (Kyoto)</option>
                    <option value="大阪府">大阪府 (Osaka)</option>
                    <option value="兵庫県">兵庫県 (Hyogo)</option>
                    <option value="奈良県">奈良県 (Nara)</option>
                    <option value="和歌山県">和歌山県 (Wakayama)</option>
                    <option value="新潟県">新潟県 (Niigata)</option>
                    <option value="富山県">富山県 (Toyama)</option>
                    <option value="石川県">石川県 (Ishikawa)</option>
                    <option value="福井県">福井県 (Fukui)</option>
                    <option value="山梨県">山梨県 (Yamanashi)</option>
                    <option value="長野県">長野県 (Nagano)</option>
                    <option value="岐阜県">岐阜県 (Gifu)</option>
                    <option value="静岡県">静岡県 (Shizuoka)</option>
                    <option value="愛知県">愛知県 (Aichi)</option>
                    <option value="三重県">三重県 (Mie)</option>
                    <option value="青森県">青森県 (Aomori)</option>
                    <option value="岩手県">岩手県 (Iwate)</option>
                    <option value="宮城県">宮城県 (Miyagi)</option>
                    <option value="秋田県">秋田県 (Akita)</option>
                    <option value="山形県">山形県 (Yamagata)</option>
                    <option value="福島県">福島県 (Fukushima)</option>
                    <option value="北海道">北海道 (Hokkaido)</option>
                    <option value="沖縄県">沖縄県 (Okinawa)</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </section>

          {/* BAGIAN 2: STATUS TINGGAL & FISIK */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-xl">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500">現在の在留資格 (Status Izin Tinggal Saat Ini)</label>
                <select required className="w-full border p-2 rounded bg-white" value={formData.zairyu_shikaku_sekarang} onChange={e => setFormData({...formData, zairyu_shikaku_sekarang: e.target.value})}>
                  <option value="" disabled>Pilih</option>
                  <option value="技能実習1号">技能実習1号 (Pemagang Tahun 1)</option>
                  <option value="技能実習2号">技能実習2号 (Pemagang Tahun 2 & 3)</option>
                  <option value="技能実習3号">技能実習3号 (Pemagang Tahun 4 & 5)</option>
                  <option value="特定技能1号">特定技能1号 (TG 1)</option>
                  <option value="留学生">留学生 (Pelajar)</option>
                  <option value="国外">国外 (Tidak Ada)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">在留期間満了日 (Masa Berlaku Izin Tinggal)</label>
                <input type="date" className="w-full border p-2 rounded bg-white" value={formData.zairyu_kigen} onChange={e => setFormData({...formData, zairyu_kigen: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500">喫煙 (Rokok)</label>
                <select required className="w-full border p-2 rounded bg-white" value={formData.merokok} onChange={e => setFormData({...formData, merokok: e.target.value})}>
                  <option value="" disabled>Pilih</option>
                  <option value="非喫煙">非喫煙 (Tidak Merokok)</option>
                  <option value="喫煙">喫煙 (Merokok)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">夜勤経験 (Shift Malam)</label>
                <select required className="w-full border p-2 rounded bg-white" value={formData.pengalaman_night_shift} onChange={e => setFormData({...formData, pengalaman_night_shift: e.target.value})}>
                  <option value="" disabled>Pilih</option>
                  <option value="無">無 (Tidak Ada Pengalaman)</option>
                  <option value="有">有 (Ada Pengalaman)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">タトゥー (Tato)</label>
                <select required className="w-full border p-2 rounded bg-white" value={formData.tato} onChange={e => setFormData({...formData, tato: e.target.value})}>
                  <option value="" disabled>Pilih</option>
                  <option value="無">無 (Tidak Ada)</option>
                  <option value="有">有 (Ada)</option>
                </select>
              </div>
              <div>
                 <label className="text-xs font-bold text-slate-500">会話力 (Percakapan)</label>
                 <select required className="w-full border p-2 rounded bg-white" value={formData.kemampuan_percakapan} onChange={e => setFormData({...formData, kemampuan_percakapan: e.target.value})}>
                    <option value="" disabled>Pilih</option>
                    <option value="評価：A（非常に高い）">評価：A（Sangat Baik）</option>
                    <option value="評価：B（高い）">評価：B（Baik）</option>
                    <option value="評価：C（平均的）">評価：C（Biasa Saja）</option>
                    <option value="評価：D（やや低い）">評価：D（Rendah）</option>
                 </select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500">身長 (cm)</label>
                  <input type="number" required className="w-full border p-2 rounded bg-white" value={formData.tinggi_badan} onChange={e => setFormData({...formData, tinggi_badan: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500">体重 (kg)</label>
                  <input type="number" required className="w-full border p-2 rounded bg-white" value={formData.berat_badan} onChange={e => setFormData({...formData, berat_badan: e.target.value})} />
                </div>
              </div>
            </div>
          </section>

          {/* BAGIAN 3: BAHASA & SERTIFIKAT */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-l-4 border-blue-600 pl-3 text-slate-700">語学 & 資格 (Bahasa & Sertifikat)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4 items-end border p-4 rounded-lg">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500">JLPT</label>
                  <select className="w-full border p-2 rounded" onChange={e => setFormData({...formData, jlpt_level: e.target.value})}>
                    {/* <option value="" disabled>Pilih</option> */}
                    <option>無 (Tidak Ada)</option>
                    <option>N4</option>
                    <option>N3</option>
                    <option>N2</option>
                    <option>N1</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500">取得日 (Tanggal Diperoleh)</label>
                  <input type="date" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, jlpt_tanggal: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4 items-end border p-4 rounded-lg">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500">JFT-Basic A2</label>
                  <select className="w-full border p-2 rounded" onChange={e => setFormData({...formData, jft_basic: e.target.value})}>
                    {/* <option value="" disabled>Pilih</option> */}
                    <option>無 (Tidak Ada)</option>
                    <option>有 (Ada)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500">取得日 (Tanggal Diperoleh)</label>
                  <input type="date" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, jft_tanggal: e.target.value})} />
                </div>
              </div>
            </div>

            {/* SSW Sertifikat (Dinamis) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">資格 (SSW & Lainnya)</label>
              {formData.sertifikat.map((item: any, index: number) => (
                <div key={index} className="flex flex-wrap gap-2 mb-2">
                  <input placeholder="Nama Sertifikat (Contoh: 自動車整備)" className="flex-grow border p-2 rounded shadow-sm" 
                    onChange={e => {
                      const newCert = [...formData.sertifikat];
                      newCert[index].nama_ssw = e.target.value;
                      setFormData({...formData, sertifikat: newCert});
                    }} />
                  <input type="date" className="border p-2 rounded shadow-sm" 
                    onChange={e => {
                      const newCert = [...formData.sertifikat];
                      newCert[index].tanggal = e.target.value;
                      setFormData({...formData, sertifikat: newCert});
                    }} />
                  <select className="border p-2 rounded shadow-sm" 
                    onChange={e => {
                      const newCert = [...formData.sertifikat];
                      newCert[index].status = e.target.value;
                      setFormData({...formData, sertifikat: newCert});
                    }}>
                    <option>取得 (Diperoleh)</option>
                    <option>受講 (Sedang Ujian)</option>
                    <option>受験予定 (Baru Akan Ujian)</option>
                  </select>
                </div>
              ))}
              <button type="button" onClick={addSertifikat} className="text-blue-600 text-sm font-bold">+ Tambah Sertifikat</button>
            </div>
          </section>

          {/* BAGIAN 4: PENGALAMAN KERJA */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-l-4 border-blue-600 pl-3 text-slate-700">経験 (Pengalaman Kerja)</h2>
            <div className="space-y-2">
              {formData.pengalaman.map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                  <input placeholder="Bidang Pekerjaan & Nama Perusahaan" className="w-full border p-2 rounded" 
                    onChange={e => {
                      const newExp = [...formData.pengalaman];
                      newExp[index].bidang = e.target.value;
                      setFormData({...formData, pengalaman: newExp});
                    }}/>
                  <input placeholder="Periode (Contoh: 2025/05/27~2026/04/24)" className="w-full border p-2 rounded" 
                    onChange={e => {
                      const newExp = [...formData.pengalaman];
                      newExp[index].periode = e.target.value;
                      setFormData({...formData, pengalaman: newExp});
                    }}/>
                </div>
              ))}
              <button type="button" onClick={addPengalaman} className="text-blue-600 text-sm font-bold">+ Tambah Baris Pengalaman</button>
            </div>
          </section>

          {/* BAGIAN 5: REMARKS */}
          <section>
            <label className="block text-sm font-bold text-slate-700 mb-2">備考 (Detail Diri & Pekerjaan Sebelumnya)</label>
            <textarea rows={6} className="w-full border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Jelaskan detail pekerjaan Anda sebelumnya sebagai referensi bagi perusahaan..."
              onChange={e => setFormData({...formData, bikou: e.target.value})}></textarea>
          </section>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg ${isSubmitting ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Mengirim...' : '送信 (Kirim)'}
          </button>
        </form>
      </div>
    </div>
  );
}