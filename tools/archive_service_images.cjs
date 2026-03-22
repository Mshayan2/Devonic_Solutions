const fs = require('fs')
const path = require('path')
const dbPath = path.join(__dirname, '..', 'server', 'db.json')
const servicesDir = path.join(__dirname, '..', 'public', 'assets', 'services')
const archiveDir = path.join(servicesDir, 'archive')

if (!fs.existsSync(dbPath)) { console.error('db.json not found'); process.exit(1) }
if (!fs.existsSync(servicesDir)) { console.error('services dir not found'); process.exit(1) }
if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir)

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
const ids = (db.services || []).map(s => (s.id || '').toString())

const files = fs.readdirSync(servicesDir)
files.forEach(f => {
  if (f === 'archive') return
  const lower = f.toLowerCase()
  // keep placeholders and hero images and exact id files
  const isPlaceholder = lower.startsWith('placeholder')
  const isHero = /-hero\./.test(lower)
  const matchesId = ids.some(id => lower === `${id}.jpg` || lower === `${id}.png` || lower === `${id}.webp` || lower === `${id}.jpeg`)
  const matchesIdWithHyphen = ids.some(id => lower === `${id}.jpg` || lower === `${id}-hero.jpg`)
  if (isPlaceholder || isHero || matchesId) {
    // keep
    // also keep files that look like user-provided (no -1 or -2)
    return
  }
  // Move file to archive
  const src = path.join(servicesDir, f)
  const dest = path.join(archiveDir, f)
  try {
    fs.renameSync(src, dest)
    console.log('archived', f)
  } catch (e) {
    console.error('failed to archive', f, e.message)
  }
})
console.log('done')
