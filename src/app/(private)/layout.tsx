
// layout.ts
// → トップページのlayout

import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function PrivatePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <main className="mt-16 max-w-screen-xl mx-auto px-10">
        { children }
      </main>
      <Footer />
    </div>
  );
}
