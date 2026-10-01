import type { NextConfig } from "next";
const config: NextConfig = { agentRules: false, transpilePackages: ["@tradehq/domain"] };
export default config;
