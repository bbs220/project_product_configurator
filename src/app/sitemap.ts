import type { MetadataRoute } from "next";

// generate static sitemap for all canonical routes
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://forma-config.vercel.app";
  const routes = [
    "",
    "/configurator",
    "/dashboard",
    "/garage",
    "/privacypolicy",
    "/terms-of-service",
    "/sign-in",
    "/sign-up",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/configurator" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}

