'use client';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export default function MonitoringTable({ data }: { data: any[] }) {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Nama Jisshusei</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Prosedur</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {data.map((item) => {
                    const deadlineDate = parseISO(item.deadline);
                    const today = new Date();
                    const diffInDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    
                    // Tentukan warna berdasarkan sisa hari
                    let badgeColor = "bg-green-100 text-green-800";
                    if (diffInDays < 30) badgeColor = "bg-red-100 text-red-800 animate-pulse";
                    else if (diffInDays < 90) badgeColor = "bg-yellow-100 text-yellow-800";

                    return (
                        <tr key={item.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{item.nama}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.prosedur}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColor}`}>
                            {formatDistanceToNow(deadlineDate, { addSuffix: true, locale: id })}
                            </span>
                        </td>
                        </tr>
                    );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}