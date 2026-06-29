import AdminSidebar from './AdminSidebar';
import AdminAuthGuard from './AdminAuthGuard';

export const metadata = { title: 'Admin — GenHi' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-slate-950 flex">
        <AdminSidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
