import HeaderDasboard from "@/components/dashboard/HeaderDasboard";
import Sidebar from "@/components/sidebar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-gray-50">
        <HeaderDasboard />
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}