import type { NextConfig } from "next";
import { cloneElement } from "react";

const nextConfig: NextConfig = {
  /* config options here */
  distDir : "./dist",
   images: {
    remotePatterns: [{
      protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "**", 
    }],
  },
};

export default nextConfig;
