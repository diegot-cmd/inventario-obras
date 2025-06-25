/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['http://192.168.18.59:3000'], // reemplaza con tu IP LAN real
  },
};

module.exports = nextConfig;
