import { sql } from "drizzle-orm";
import { db } from "./src/db/index";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function run() {
  await db.execute(sql`DROP TABLE IF EXISTS event_registrations;`);
  console.log("Dropped event_registrations");
  process.exit(0);
}
run();
