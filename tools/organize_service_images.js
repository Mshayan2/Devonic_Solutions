const fs = require('fs')
const path = require('path')
const dbPath = path.join(__dirname, '..', 'server', 'db.json')
const servicesDir = path.join(__dirname, '..', 'public', 'assets', 'services')

function safeCopy(src, dest) {
  try {
    fs.copyFileSync(src, dest)
    console.log('copied', src, '->', dest)
  } catch (e) {
    console.error('copy failed', src, dest, e.message)
  }
}

function main() {
  if (!fs.existsSync(dbPath)) return console.error('db.json not found')
  if (!fs.existsSync(servicesDir)) return console.error('services dir not found')
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  const services = db.services || []
  const files = fs.readdirSync(servicesDir)
  services.forEach(svc => {
    const id = (svc.id || '').toString()
    const titleKey = (svc.title || '').toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
    const candidates = []
    // prefer existing hero
    candidates.push(`${id}-hero`)
    candidates.push(`${id}`)
    candidates.push(titleKey + '-hero')
    candidates.push(titleKey)
    // search files that include id or title
    let found = null
    for (const f of files) {
      const name = f.toLowerCase()
      if (name.includes(id.toLowerCase()) || (titleKey && name.includes(titleKey))) {
        found = f
        break
      }
    }
    if (found) {
      const ext = path.extname(found)
      const destName = `${id}-hero${ext}`
      const src = path.join(servicesDir, found)
      const dest = path.join(servicesDir, destName)
      if (path.basename(found) !== destName) {
        // copy so original remains
        safeCopy(src, dest)
      } else {
        console.log('already correct', destName)
      }
    } else {
      console.log('no image found for', id)
    }
  })
}

main()
