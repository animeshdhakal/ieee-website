import { db } from "./src/db/index";
import { forms } from "./src/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testQuery() {
  try {
    const result = await db.select().from(forms).limit(1);
    console.log("Forms query success:", result);
  } catch (error: unknown) {
    console.error("Database Error:", error);
  }
  process.exit(0);
}

testQuery();
