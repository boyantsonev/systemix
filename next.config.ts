import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/contract",            destination: "/design-system", permanent: false },
      { source: "/contract/tokens",     destination: "/design-system", permanent: false },
      { source: "/contract/components", destination: "/design-system", permanent: false },
      { source: "/contract/:slug",      destination: "/design-system", permanent: false },
    ];
  },
};

export default nextConfig;
