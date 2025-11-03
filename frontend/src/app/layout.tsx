'use client';

import "@/styles/global.scss";
import { ThemeProvider } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const noHeaderRoutes = ['/auth/login', '/auth/register'];
  const shouldShowHeader = !noHeaderRoutes.includes(pathname);

  const noSidebarRoutes = ['/', '/auth/login', '/auth/register'];
  const shouldShowSidebar = !noSidebarRoutes.includes(pathname);

  return (
    <html lang="pt-br">
      <body>
        <ThemeProvider>
          {shouldShowHeader && (
            <header>
              <Navbar />
            </header>
          )}
          <main>
            {shouldShowSidebar && (<Sidebar />)}
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
