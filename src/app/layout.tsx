import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/lib/ThemeContext";
import { CustomerProvider } from "@/lib/CustomerContext";

export const metadata: Metadata = {
  title: "CrushBank Dashboard",
  description: "System Monitoring & Analytics Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117] transition-colors duration-200">
        <ThemeProvider>
          <CustomerProvider>
            <Header />
            <main className="max-w-[1440px] mx-auto px-6 py-6">
              {children}
            </main>
          </CustomerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
