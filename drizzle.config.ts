import { type Config } from "drizzle-kit";

import { env } from "@/env";

const DATABASE_URL = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DBNAME}`;

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  tablesFilter: ["fe_isi_test_nizar_izzuddin_yatim_fadlan_*"],
} satisfies Config;
