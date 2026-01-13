/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ output: "export"  <-- ye kabhi bhi add mat karna (ADMIN dashboard ke liye)

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
