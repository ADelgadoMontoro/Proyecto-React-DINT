import fs from "fs";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "backend", "data", "db.json");
const BACKUP_PATH = path.resolve(process.cwd(), "backend", "data", "db.e2e.backup.json");

export default async function globalTeardown() {
  if (!fs.existsSync(BACKUP_PATH)) return;
  fs.copyFileSync(BACKUP_PATH, DB_PATH);
  fs.unlinkSync(BACKUP_PATH);
}
