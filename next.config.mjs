/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-simple-maps"],
  output: "export",
  basePath: "/stateplanningKYEM",
  images: { unoptimized: true },
};

export default nextConfig;
