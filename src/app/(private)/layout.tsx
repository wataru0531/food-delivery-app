
// layout.ts
// → トップページのlayout

import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

// ✅ layout.tsx → サイト全体の共通のmetadata
//                 favicon、og image、twitter card、metadataBaseなど
// ✅ page.tsx → そのページ専用のmetadata
//               トップページなどでは個別タイトルだけを書く
//               
export const metadata: Metadata = {
  title: {
    default: "Food Delivery Service", // 👉 各ページにtitleの設定がない場合に使われる
    template: "%s | Food Delivery Service", // %s 👉 他のページの、titleが入る。
                                            // しかし、トップは同じなので使われない
  },
  description: "Find nearby restaurants easily.",
  openGraph: {
    siteName: "Food Delivery Service",
    type: "website",
  },
  metadataBase: new URL("https://example.com"),
};


export default function PrivatePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="mt-16 max-w-screen-xl mx-auto px-10">
        { children }
      </main>
      <Footer />
    </>
  );
}
