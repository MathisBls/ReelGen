import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Reelgen - Génération Automatique de Reels",
  description: "Transformez vos vidéos en reels automatiquement avec l'IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
