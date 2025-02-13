import { hashPassword } from "@/utils/bcrypt";
import { db } from ".";
import { users } from "./schema";

async function runSeeder() {
  try {
    const passwordHash = await hashPassword("@Password123");
    await db.insert(users).values([
      {
        name: "Kenny",
        username: "kenny",
        password: passwordHash,
        role: "lead",
      },
      {
        name: "Jane Doe",
        username: "janedoe",
        password: passwordHash,
        role: "team",
      },
    ]);
    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

runSeeder();
