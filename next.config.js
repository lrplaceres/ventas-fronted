/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    MI_API_FRONTEND: "http://127.0.0.1:3000",
    MI_API_BACKEND: "http://127.0.0.1:8000",

    NEXTAUTH_URL: "http://localhost:3000",
    //openssl rand -base64 32
    NEXTAUTH_SECRET: "tcUd+DX/gAlVw6tWzGKw6QE2Zi2reXoOuWI2LJw5YGo=",
    AUTH_GITHUB_ID: "a30cdd8405496487231d",
    AUTH_GITHUB_SECRET: "0c7218830f15ad6514c42772ebf571006df6543d",
  },
};

module.exports = nextConfig;
