/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qtrypzzcjebvfcihiynt.supabase.co",
      },
    ],
  },
  // Suppress hydration warnings from browser extensions
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
