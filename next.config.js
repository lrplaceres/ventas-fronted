/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  env: {
    NEXT_PUBLIC_MI_API_BACKEND: "http://bsimple.gobiernocav.co.cu",

    NEXTAUTH_URL: "http://simple.gobiernocav.co.cu",
    //openssl rand -base64 32
    NEXTAUTH_SECRET: "tcUd+DX/gAlVw6tWzGKw6QE2Zi2reXoOuWI2LJw5YGo=",
  },
  };

module.exports = nextConfig;
