import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FailureTwin | Edtech Assignment",
  description: "A multi-agent failure-mode simulator for startup ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 mt-12 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
              <p>House of Edtech - Fullstack Developer Assignment</p>
              <div className="flex justify-center gap-4 mt-2">
                <span>Name: Jagjeet Singh Dhillon</span>
                <a href="https://github.com/TheJd04" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  GitHub Profile
                </a>
                <a href="https://linkedin.com/in/jagjeetsinghdhillon" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
