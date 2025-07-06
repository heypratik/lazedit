const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "replicate.delivery" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "d7dum6r51r1fd.cloudfront.net" },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
