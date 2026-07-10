import type { MetadataRoute } from "next";

// The (app) product surface (/config, /contract, /design, /skills) is app UI,
// not marketing content — keep it out of the index. /experiments is the
// exception: it's the public dogfood proof wall, linked from the landing
// page and llms.txt, so it stays crawlable.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/config", "/contract", "/design", "/skills"],
    },
    sitemap: "https://getsystemix.vercel.app/sitemap.xml",
  };
}
