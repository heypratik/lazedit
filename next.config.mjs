const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "replicate.delivery" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "d7dum6r51r1fd.cloudfront.net" }, // mybranzs3
      { protocol: "https", hostname: "d1kw46qh6t9dlp.cloudfront.net" }, // lazedit s3
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
