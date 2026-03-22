(async () => {
  const base = 'http://localhost:4000/api'
  try {
    console.log('Health check...')
    let r = await fetch(`${base}/health`)
    console.log('health status', await r.json())

    console.log('Login admin...')
    r = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@devonic.local', password: 'AdminPass123!' })
    })
    const login = await r.json()
    if (!login.accessToken) throw new Error('login failed: ' + JSON.stringify(login))
    const token = login.accessToken
    console.log('Got token')

    console.log('Create course without instructor...')
    r = await fetch(`${base}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ title: 'Test Course No Instructor', summary: 'Test', description: 'Desc', price: 0, duration: '1 week', capacity: 10, tags: ['test'] })
    })
    const created = await r.json()
    console.log('Created course:', created)

    console.log('Submit request with gmail and whatsapp...')
    r = await fetch(`${base}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', gmail: 'alice@gmail.com', whatsapp: '+923001234567', message: 'Hello from test' })
    })
    const req = await r.json()
    console.log('Request created:', req)

    console.log('Enroll in created course...')
    r = await fetch(`${base}/courses/${created.id}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bob', email: 'bob@example.com', message: 'Enroll me' })
    })
    const enroll = await r.json()
    console.log('Enroll response:', enroll)

    console.log('Done')
  } catch (e) {
    console.error('Error', e)
    process.exit(1)
  }
})()
