import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/brain/media/*": ["./content/brain-media/**/*", "./content/brain-previews/**/*"],
    "/protected-media/adem-user-list/*": ["./content/protected/adem-user-list/**/*"],
  },
};

export default nextConfig;
