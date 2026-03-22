const fs = require('fs')
const path = require('path')

const DB_FILE = path.join(__dirname, 'db.json')

function readDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    return { users: [], services: [], requests: [], projects: [], content: { home: {} } }
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8')
}

module.exports = {
  readDB,
  writeDB
}
