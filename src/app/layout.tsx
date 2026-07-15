import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import NetworkBackground from "@/components/ui/NetworkBackground";

const ibmPlexSans = IBM_Plex_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

// Removed ibmPlexMono as it's loaded in globals.css or unused directly

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
    <html lang="en" className="dark">
      <body className={`ft-root ${ibmPlexSans.className} min-h-screen flex flex-col relative`}>
        <NetworkBackground />
        <Providers>
          <Navbar />
          <main className="flex-1 ft-content">{children}</main>
          <footer className="w-full py-6 mt-12 border-t border-[var(--ft-line)] bg-[var(--ft-surface)]">
            <div className="container mx-auto px-4 text-center text-sm text-[var(--ft-text-dim)]">
              <p>House of Edtech - Fullstack Developer Assignment</p>
              <div className="flex justify-center gap-4 mt-2">
                <span>Name: Jagjeet Singh Dhillon</span>
                <a href="https://github.com/TheJd04" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ft-accent)] transition-colors ft-link">
                  GitHub Profile
                </a>
                <a href="https://linkedin.com/in/jagjeetsinghdhillon" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ft-accent)] transition-colors ft-link">
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
