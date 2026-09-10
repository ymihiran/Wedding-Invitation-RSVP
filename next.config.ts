import type { NextConfig } from "next";
import path from "node:path";

const threeShim = path.resolve(process.cwd(), "src/shims/three.ts");

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export',
  transpilePackages: ["mind-ar"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      three$: threeShim,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      three: "./src/shims/three.ts",
      fs: "./src/shims/empty.ts",
    },
  },
};

export default nextConfig;
