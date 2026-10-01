import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Botão "N" do Next (só em dev) no único canto livre: o esquerdo tem o
  // avatar-menu e o superior direito, a busca no celular.
  devIndicators: { position: "bottom-right" },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
