'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Building2, ClipboardList, LogOut, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'ダッシュボード', icon: LayoutDashboard, href: '/' },
    { name: '技能実習生・特定技能生情報', icon: Users, href: '/admin/jisshusei' },
    { name: '受け入れ企業', icon: Building2, href: '/admin/kigyou' },
    { name: 'モニタリング', icon: Bell, href: '/admin/monitoring' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6 flex flex-col">
      <div className="mb-10">
        <h1 className="text-xl font-bold tracking-widest text-blue-400">協同組合西海協</h1>
        <p className="text-xs text-slate-400">管理システム</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors border-t border-slate-800 pt-6"
      >
        <LogOut size={20} />
        <span className="font-medium">ログアウト</span>
      </button>
    </div>
  );
}