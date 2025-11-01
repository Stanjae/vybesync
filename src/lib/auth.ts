import { sanityAdapter } from "@/adapter/sanity-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database:sanityAdapter(),
  socialProviders: {
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_ID!,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET!,
    },
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_ID!,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET!,
    },
  },
  plugins: [nextCookies()],
});