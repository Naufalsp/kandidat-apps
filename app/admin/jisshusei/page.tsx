  'use client';
  import { useEffect, useState } from 'react';
  import { supabase } from '@/lib/supabase';
  import { UserPlusIcon, MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';
  import Link from 'next/link';

  export default function JisshuseiPage() {
    const [list, setList] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
      fetchJisshusei();
    }, []);

    async function fetchJisshusei() {
      const { data, error } = await supabase
        .from('jisshusei')
        .select(`
          *,
          kigyou (
            nama_perusahaan
          )
        `); // Supabase sekarang tahu cara join karena relasi sudah Anda Save tadi

      if (error) {
        console.error('Error Supabase:', error.message);
        return;
      }
      
      if (data) {
        console.log('Cek data join:', data); // Lihat apakah sekarang ada objek kigyou
        setList(data);
      }
    }

    const filteredData = list.filter((item: any) => 
      item.nama_lengkap.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">技能実習生・特定技能生情報</h2>
          <Link href="/admin/jisshusei/tambah" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
            <UserPlusIcon className="w-5 h-5" /> 追加
          </Link>
        </div>

        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text"
            placeholder="検索..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4 whitespace-nowrap">会社</th>
                <th className="p-4">期</th>
                <th className="p-4">氏名</th>
                <th className="p-4">性別</th>
                <th className="p-4">生年月日</th>
                <th className="p-4">国籍</th>
                <th className="p-4">在留資格</th>
                <th className="p-4">在留期限</th>
                <th className="p-4 text-center">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition text-sm">
                  {/* Kolom Perusahaan */}
                  <td className="p-4 font-medium text-blue-700">{item.kigyou?.nama_perusahaan || '-'}</td>
                  
                  {/* Kolom Angkatan (menggunakan kolom baru: angkatan) */}
                  <td className="p-4">{item.angkatan || '-'}</td>
                  
                  <td className="p-4 font-bold text-slate-800">{item.nama_lengkap}</td>
                  
                  {/* Kolom L/P */}
                  <td className="p-4">{item.jenis_kelamin}</td>
                  
                  <td className="p-4 whitespace-nowrap">{item.tanggal_lahir}</td>
                  <td className="p-4">{item.kewarganegaraan}</td>
                  
                  {/* Kolom Zairyuu Shikaku (disesuaikan nama kolom db) */}
                  <td className="p-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                      {item.zairyu_shikaku || 'N/A'}
                      </span>
                  </td>
                  
                  {/* Kolom Zairyuu Kigen (disesuaikan nama kolom db) */}
                  <td className="p-4 text-red-600 font-medium">{item.zairyu_kigen || '-'}</td>
                  
                  <td className="p-4 text-center">
                      <Link href={`/admin/jisshusei/${item.id}`} className="text-slate-400 hover:text-blue-600 transition">
                      <EyeIcon className="w-5 h-5 mx-auto" />
                      </Link>
                  </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }