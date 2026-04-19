import "dotenv/config";

const parsedPort = Number(process.env.PORT ?? 3001);
if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}
const host = process.env.HOST ?? "localhost";
const dbUrl = process.env.DATABASE_URL ?? "";
const node_env = process.env.NODE_ENV ?? "development";

export const appConfig = {
  host,
  port: parsedPort,
  dbUrl,
  node_env
} as const;
