/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.cjdropshipping.com" },
      { protocol: "https", hostname: "**.alicdn.com" },
      { protocol: "https", hostname: "**.media-amazon.com" },
      { protocol: "https", hostname: "**" }
    ]
  },
  experimental: { serverActions: { bodySizeLimit: "5mb" } }
};
export default nextConfig;
