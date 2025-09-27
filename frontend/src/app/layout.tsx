'use client';

import "@/styles/global.scss";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const noHeaderRoutes = ['/auth/login', '/auth/register'];
  const shouldShowHeader = !noHeaderRoutes.includes(pathname);

  return (
    <html lang="pt-br">
      <body>
        {shouldShowHeader && (
          <header>
            <Navbar />
          </header>
        )}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
