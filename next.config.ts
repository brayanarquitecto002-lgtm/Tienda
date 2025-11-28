import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Deshabilitar React Compiler temporalmente para evitar problemas de CSP
  reactCompiler: false,
};

export default nextConfig;
