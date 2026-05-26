import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

// TiDB Cloud, Aiven, PlanetScale, Neon e similares exigem TLS.
const needsSsl =
  /tidbcloud|aivencloud|planetscale|psdb\.cloud|neon\.tech|ssl=true|ssl-mode=/i.test(
    connectionString,
  );

// drizzle-kit 0.31 não combina `url` + `ssl`. Quando precisa de TLS, parseamos
// a URL e passamos host/port/user/password/database separadamente.
const dbCredentials = needsSsl
  ? (() => {
      const u = new URL(connectionString);
      return {
        host: u.hostname,
        port: Number(u.port) || 3306,
        user: decodeURIComponent(u.username),
        password: decodeURIComponent(u.password),
        database: u.pathname.replace(/^\//, "") || "test",
        ssl: { rejectUnauthorized: true },
      };
    })()
  : { url: connectionString };

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials,
});
