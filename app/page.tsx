'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BellAlertIcon, UsersIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalJisshusei: 0, totalKigyou: 0, alerts: 0 });
  const [alertList, setAlertList] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    // 1. Ambil Total Jisshusei
    const { count: jCount } = await supabase.from('jisshusei').select('*', { count: 'exact', head: true });
    // 2. Ambil Total Kigyou
    const { count: kCount } = await supabase.from('kigyou').select('*', { count: 'exact', head: true });
    
    // 3. Poin C: Cari dokumen yang expire dalam 6 bulan ke depan
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    const { data: expiredDocs } = await supabase
      .from('jisshusei')
      .select('nama_romaji, expired_paspor, expired_zairyu_card')
      .or(`expired_paspor.lte.${sixMonthsFromNow.toISOString()},expired_zairyu_card.lte.${sixMonthsFromNow.toISOString()}`);

    setStats({
      totalJisshusei: jCount || 0,
      totalKigyou: kCount || 0,
      alerts: expiredDocs?.length || 0
    });
    setAlertList(expiredDocs as any || []);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">全体情報</h2>
      
      {/* Poin A: Dashboard Analytics Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><UsersIcon className="w-6 h-6" /></div>
          <div><p className="text-sm text-slate-500">技能実習生・特定技能生</p><p className="text-2xl font-bold">{stats.totalJisshusei}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><BuildingOfficeIcon className="w-6 h-6" /></div>
          <div><p className="text-sm text-slate-500">担当企業</p><p className="text-2xl font-bold">{stats.totalKigyou}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg"><BellAlertIcon className="w-6 h-6" /></div>
          <div><p className="text-sm text-slate-500">アラート</p><p className="text-2xl font-bold">{stats.alerts}</p></div>
        </div>
      </div>

      {/* Poin C: Alert List (System Peringatan Dini) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-red-50 border-b border-red-100">
          <h3 className="text-red-700 font-semibold flex items-center gap-2">
            <BellAlertIcon className="w-5 h-5" /> Peringatan Dokumen (Jatuh Tempo &lt; 6 Bulan)
          </h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
            <tr>
              <th className="p-4">氏名</th>
              <th className="p-4">旅券有効期限</th>
              <th className="p-4">在留期限</th>
              <th className="p-4">アクション</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alertList.map((item: any, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition">
                <td className="p-4 font-medium text-slate-800">{item.nama_romaji}</td>
                <td className="p-4 text-red-600">{item.expired_paspor || '-'}</td>
                <td className="p-4 text-red-600">{item.expired_zairyu_card || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}