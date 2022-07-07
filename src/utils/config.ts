import { config } from "dotenv"
config()

// Type and export environment variables
export default {
  // Clash of Clans environment variables
  CLASH_API_TOKEN: process.env.CLASH_API_TOKEN || "",
  CLAN_TAG: process.env.CLAN_TAG || "",

  // Google Sheets environment variables
  CLIENT_ID: process.env.CLIENT_ID || "",
  CLIENT_SECRET: process.env.CLIENT_SECRET || "",
  SHEET_ID: process.env.SHEET_ID || ""
}
