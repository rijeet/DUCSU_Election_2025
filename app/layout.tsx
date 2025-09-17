import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-6xl mx-auto p-4 md:p-6">{children}</div>
      </body>
    </html>
  );
}
