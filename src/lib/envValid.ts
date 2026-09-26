import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "Publishable key is required"),
  CLERK_SECRET_KEY: z.string().min(1, "Secret key is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid or missing environment variables:")

  console.error(z.treeifyError(parsedEnv.error))

  process.exit(1)
}

export const envValid = parsedEnv.data;