import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Imagens das notícias enviadas para o Vercel Blob
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
