import { db } from "./src/db/index";
import { events } from "./src/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testQuery() {
  try {
    const result = await db.select().from(events).limit(1);
    console.log("Success:", result);
  } catch (error: any) {
    console.error("Database Error:");
    console.error(error);
  }
  process.exit(0);
}

testQuery();
