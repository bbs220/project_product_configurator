import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // configure security and discovery headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "upgrade-insecure-requests; frame-ancestors 'self'",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Link",
            value:
              '</llms.txt>; rel="describedby"; type="text/markdown"; title="Site index for LLMs", </sitemap.xml>; rel="sitemap"; type="application/xml", </.well-known/security.txt>; rel="security"; type="text/plain"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
