/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ai-task-processor' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/ai-task-processor' : '',
};

module.exports = nextConfig;
