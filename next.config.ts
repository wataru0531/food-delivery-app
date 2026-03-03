import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: { // Next.js がどんな fetch を実行しているかをコンソールに表示する
    fetches: { fullUrl: true },
  },
  experimental: {
    useCache: true, // "use cache"を有効化
  }
};

export default nextConfig;
