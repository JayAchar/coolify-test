import { z } from "zod";

const envSchema = z.object({
  HOST_NAME: z.string(),
});

export async function GET() {
  const env = process.env;

  const { data, error, success } = envSchema.safeParse(env);

  if (!success) {
    console.error(JSON.stringify(error));
    return Response.json({
      error,
    });
  }

  return Response.json({
    hello: "world",
    env: data.HOST_NAME,
  });
}
