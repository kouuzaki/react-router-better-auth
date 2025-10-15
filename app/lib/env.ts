import { z } from "zod";

const envSchema = z.object({
  VITE_BACKEND_BASE_URL: z.url("VITE_BACKEND_BASE_URL must be a valid URL"),
});

type EnvSchema = z.infer<typeof envSchema>;

const parseEnv = (): EnvSchema => {
  const result = envSchema.safeParse(import.meta.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  return result.data;
};

export const env = parseEnv();