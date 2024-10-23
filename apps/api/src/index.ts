import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { z } from "zod";
import { config } from "dotenv";

config();
const app = new Hono();

const envSchema = z.object({
  HOST_NAME: z.string(),
});

type Env = z.infer<typeof envSchema>;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api/users", (c) => {
  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];
  return c.json(users);
});

app.get("/vars", (c) => {
  const vars = env<Env>(c);
  const { data, error, success } = envSchema.safeParse(vars);
  if (!success) {
    return c.json(error);
  }
  return c.json(data.HOST_NAME);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
