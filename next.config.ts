import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: { // Next.js がどんな fetch を実行しているかをコンソールに表示する
    fetches: { fullUrl: true },
  },
  experimental: {
    useCache: true, // "use cache"を有効化
  },
  // ✅ 外部から画像を取得する時には、セキュリティ・パフォーマンス・インフラ保護のために明示的に許可する
  images: {
    remotePatterns: [
      {
        protocol: "https", // プロトコル
        hostname: "places.googleapis.com", // ドメイン名
        // port: "", // ポート番号
        // pathname: "", // パス
        // search: "", // クエリ文字列。
        //                → example.com/image.jpg?key=ABC&size=400
        //                  ?以降がクエリ文字列
      },
      {
        protocol: "https",
        hostname: "ndpohcdojjruiosbmyxz.supabase.co", // Supabaseからの画像
      },
    ],
  },
};

export default nextConfig;
