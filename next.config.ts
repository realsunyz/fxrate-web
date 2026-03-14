import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const { execSync } = require("child_process");
const pkg = require("./package.json");

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

function resolveCommitId(): string {
  try {
    const fromEnv =
      process.env.GIT_HASH || process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_ID;
    if (fromEnv && fromEnv.trim()) return fromEnv.trim().slice(0, 7);
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "dev";
  }
}

const _cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.sunyz.net https://analytics.sunyz.net https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://cdn.sunyz.net https://fonts.googleapis.com https://challenges.cloudflare.com;
    img-src 'self' blob: data: https://cdn.sunyz.net;
    font-src 'self' https://cdn.sunyz.net https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://challenges.cloudflare.com;
    connect-src 'self' https://fxrate-api.sunyz.net https://analytics.sunyz.net https://challenges.cloudflare.com;
`;

const commitId = resolveCommitId();

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
    preloadEntriesOnStart: false,
  },
  generateBuildId: async () => {
    return commitId;
  },
  env: {
    COMMIT_ID: commitId,
    APP_VERSION: pkg.version,
  },
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_FXRATE_API}/v1/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_FXRATE_API}/auth/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value:
              "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // {
          //   key: "Content-Security-Policy",
          //   value: cspHeader.replace(/\n/g, ""),
          // },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
