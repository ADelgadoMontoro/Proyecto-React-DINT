import fs from "fs";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "backend", "data", "db.json");
const BACKUP_PATH = path.resolve(process.cwd(), "backend", "data", "db.e2e.backup.json");

export default async function globalSetup() {
  if (!fs.existsSync(DB_PATH)) return;
  fs.copyFileSync(DB_PATH, BACKUP_PATH);
}
