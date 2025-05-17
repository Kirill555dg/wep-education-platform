import { ResponsiveHeader } from "../header/ResponsiveHeader";
import { Footer } from "../footer/Footer";

export function MainLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white sm:bg-gray-100 flex flex-col">
      <ResponsiveHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
