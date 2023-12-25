import { execSync } from "child_process";

execSync("npm run seed", { stdio: "inherit" });
