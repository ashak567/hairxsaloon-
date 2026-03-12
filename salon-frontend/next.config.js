/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint v8 + eslint-config-next v15 conflict — lint manually with npm run lint
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
