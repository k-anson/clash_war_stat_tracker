import config from "../utils/config"
import { auth, sheets, sheets_v4 } from "@googleapis/sheets"

/**
 * Custom wrapper class for google apis sheets library
 */
export default abstract class Sheets {
  static Sheets: sheets_v4.Sheets
  static spreadsheet: sheets_v4.Schema$Spreadsheet
  static warMembers: string
  static warLeagueMembers: string

  /**
   * Loads credentials.json file to authenticate with googleapis and saves the returned sheets client to the class
   */
  static authenticate = async () => {
    const clientAuth = new auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    })
    const client = await clientAuth.getClient()

    this.Sheets = sheets({
      version: "v4",
      auth: client
    })
  }

  /**
   * Fetches and updates the static spreadsheet property on the class using the SHEET_ID env
   */
  static fetchSpreadsheet = async () => {
    const spreadsheet = await this.Sheets.spreadsheets.get({
      spreadsheetId: config.SHEET_ID
    })
    this.spreadsheet = spreadsheet.data
  }

  /**
   * Ensures there are 2 sheets titled "Clan Wars" and "Clan War Leagues"
   * Parses some of the sheet data into static variables: warMembers, warLeagueMembers
   */
  static parseSpreadsheet = async () => {
    const clanWarSheet = this.spreadsheet.sheets?.find(sheet => {
      return sheet.properties?.title === "Clan Wars"
    })
    const clanWarLeagueSheet = this.spreadsheet.sheets?.find(sheet => {
      return sheet.properties?.title === "Clan War Leagues"
    })

    // Ensure Clan Wars and Clan War Leagues sheets exist
    if (!clanWarSheet || !clanWarLeagueSheet) {
      const requests: sheets_v4.Schema$Request[] = []
      if (!clanWarSheet) {
        requests.push({
          addSheet: {
            properties: {
              title: "Clan Wars"
            }
          }
        })
      }
      if (!clanWarLeagueSheet) {
        requests.push({
          addSheet: {
            properties: {
              title: "Clan War Leagues"
            }
          }
        })
      }
      await this.Sheets.spreadsheets.batchUpdate({
        spreadsheetId: config.SHEET_ID,
        requestBody: {
          requests
        }
      })
    } else {
      console.log("No problems here")
    }
  }
}
