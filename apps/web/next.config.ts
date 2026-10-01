import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  agentRules: false,
  transpilePackages: ["@tradehq/domain", "@tradehq/imports"],
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
};
export default config;
