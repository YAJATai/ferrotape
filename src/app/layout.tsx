import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ferroo Tape | Engineered Dust Protection",
  description: "Premium breathable mesh dust-protection tape for laptop vents. Protect airflow. Block dust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
