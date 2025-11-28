import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Deshabilitar React Compiler temporalmente para evitar problemas de CSP
  reactCompiler: false,

  // Configuración de imágenes para permitir dominios externos
  images: {
    domains: [
      'images.unsplash.com',
      'picsum.photos',
      'i.ibb.co',
      'via.placeholder.com',
    ],
    // Permitir data URLs para imágenes base64
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
