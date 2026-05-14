'use client';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function JisshuseiPortal() {
  const router = useRouter();

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-50">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Halo, Jisshusei! 👋</h1>
        <p className="text-gray-600 mb-8">Silakan lengkapi laporan bulanan atau unggah dokumen di bawah ini.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer transition text-center">
            <span className="text-4xl mb-4 block">📋</span>
            <h3 className="font-semibold">Isi Angket Bulanan</h3>
          </div>
          <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer transition text-center">
            <span className="text-4xl mb-4 block">📤</span>
            <h3 className="font-semibold">Upload Sertifikat/Paspor</h3>
          </div>
        </div>

        <button 
          onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
          className="mt-10 text-red-500 font-medium hover:underline"
        >
          Keluar dari Aplikasi
        </button>
      </div>
    </div>
  );
}