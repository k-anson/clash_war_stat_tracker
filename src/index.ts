import { Client } from "clashofclans.js"
import * as fs from "fs"
import * as path from "path"

import config from "./utils/config"
import Sheets from "./libs/Sheets"

const client = new Client({ keys: [config.CLASH_API_TOKEN]});

client.events.addClans(config.CLAN_TAG)
client.events.setWarEvent({
  name: "clanWarEnd",
  filter: (oldWar, newWar) => {
    return newWar.state === "warEnded"
  }
})

client.on("clanWarEnd", (oldWar, newWar) => {
  let war
  if (false /* if called from manual script */) {
    // set war to previous war file contents
  } else {
    war = newWar
    // save war to file incase of issues
  }

  // Spin up async function to utilize google-spreadsheet library
  (async () => {
    // await sheets.authenticate()
  })()
});

// Begin event watching
(async () => {
  const mockWarData = JSON.parse(fs.readFileSync(path.join(__dirname, "./mockWarData.json"), { encoding: "utf-8"}))
  await Sheets.authenticate()
  await Sheets.fetchSpreadsheet()
  await Sheets.parseSpreadsheet()
  // await client.events.init()
})()
