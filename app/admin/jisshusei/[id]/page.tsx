'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function DetailJisshusei() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('個人情報');

  useEffect(() => {
    const fetchData = async () => {
      // Mengambil data spesifik berdasarkan ID yang diklik dari tabel utama
      const { data: jisshuseiData, error } = await supabase
        .from('jisshusei')
        .select(`
          *,
          kigyou (
            nama_perusahaan
          )
        `)
        .eq('id', id)
        .single();

      if (!error) setData(jisshuseiData);
    };
    fetchData();
  }, [id]);

  if (!data) return <div className="p-10 text-center">Memuat data personel...</div>;

  return (
    <div className="space-y-6">
      {/* Header Profil Otomatis */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex gap-8 items-start">
        <div className="w-32 h-40 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
           {data.foto_url ? (
             <img src={data.foto_url} className="w-full h-full object-cover" />
           ) : (
             <span className="text-slate-400 text-xs">NO PHOTO</span>
           )}
        </div>
        <div className="grid grid-cols-2 flex-1 gap-y-4">
          <div className="col-span-2">
            <h1 className="text-2xl font-bold text-slate-800">{data.nama_lengkap}</h1>
            <p className="text-slate-500 font-medium">{data.nama_romaji || 'Nama Kanji Belum Diisi'}</p>
          </div>
          <div><p className="text-xs text-slate-400 uppercase font-bold">会社</p><p className="font-medium text-slate-700">{data.kigyou?.nama_perusahaan || '-'}</p></div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold">住所</p>
            <div className="flex gap-2 font-medium text-slate-700">
              <span>{data.kode_pos}</span>
              <span>{data.alamat || '-'}</span>
            </div>
          </div>
          <div><p className="text-xs text-slate-400 uppercase font-bold">在留資格</p><p className="font-medium text-blue-600">{data.zairyu_shikaku || '-'}</p></div>
        </div>
      </div>

      {/* Konten Tab Otomatis */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50">
          {['個人情報', '在留カード・旅券', '活動内容', '関連書類'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-6 py-3 text-sm font-bold transition-all ${activeTab === tab.toLowerCase() ? 'bg-white text-blue-600 border-t-2 border-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8">
           {/* Tab 個人情報 */}
           {activeTab === '個人情報' && (
             <div className="grid grid-cols-2 gap-12">
               <div className="space-y-4">
                 <h3 className="font-bold border-b pb-2 text-blue-800">Data Fisik</h3>
                 <div className="space-y-2">
                    <p className="text-sm flex justify-between"><span>血液型:</span> <b className="text-slate-700">{data.gol_darah || '-'}</b></p>
                    <p className="text-sm flex justify-between"><span>身長:</span> <b className="text-slate-700">{data.tinggi_badan || '-'} cm</b></p>
                    <p className="text-sm flex justify-between"><span>体重:</span> <b className="text-slate-700">{data.berat_badan || '-'} kg</b></p>
                 </div>
               </div>
               <div className="space-y-4">
                 <h3 className="font-bold border-b pb-2 text-blue-800">Informasi Pribadi</h3>
                 <div className="space-y-2">
                    <p className="text-sm flex justify-between"><span>生年月日:</span> <b className="text-slate-700">{data.tanggal_lahir || '-'}</b></p>
                    <p className="text-sm flex justify-between"><span>性別:</span> <b className="text-slate-700">{data.jenis_kelamin || '-'}</b></p>
                    <p className="text-sm flex justify-between"><span>国籍:</span> <b className="text-slate-700">{data.kewarganegaraan || '-'}</b></p>
                 </div>
               </div>
             </div>
           )}

           {/* Tab 在留カード */}
           {activeTab === '在留カード・旅券' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                 <h4 className="text-xs font-bold text-red-800 uppercase mb-2">在留期限</h4>
                 <p className="text-lg font-bold text-red-600">{data.zairyu_kigen || 'Belum Diatur'}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">旅券有効期限</h4>
                 <p className="text-lg font-bold text-slate-700">{data.paspor_kigen || '-'}</p>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}