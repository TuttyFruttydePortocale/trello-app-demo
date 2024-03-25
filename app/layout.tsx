import "./globals.css";

export const metadata = {
  title: "Trello Demo",
  description: "Generated by Tutty Frutty de Portocale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F5F6F8]">{children}</body>
    </html>
  );
}