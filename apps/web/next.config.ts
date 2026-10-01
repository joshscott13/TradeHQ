import type { NextConfig } from "next";
const config: NextConfig = { agentRules: false, transpilePackages: ["@tradehq/domain", "@tradehq/imports"] };
export default config;
