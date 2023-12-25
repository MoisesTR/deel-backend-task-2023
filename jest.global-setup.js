import { execSync } from "child_process";

module.exports = async () => {
  execSync("npm run seed", { stdio: "inherit" });
};
